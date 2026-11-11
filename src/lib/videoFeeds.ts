import {
  STORAGE_KEYS,
  getVideoFeedCache,
  getVideoSources,
  nowIso,
  writeStore,
  type ExternalVideo,
  type ExternalVideoProvider,
  type VideoFeedCache,
  type VideoSourceSettings,
} from "@/data/siteData";

/**
 * Live video feeds.
 *
 * YouTube is fetched without any key from the public channel RSS feed. Because
 * that feed does not send CORS headers, requests go through the configurable
 * proxy (AllOrigins by default). If a YouTube Data API key is configured the
 * official API is used instead (CORS-safe and more reliable).
 *
 * Facebook videos require a Page ID and a Page access token for the Graph API.
 * The token is stored in the browser, so only use a token with the minimum
 * scopes and rotate it if it is ever exposed.
 */

const REQUEST_TIMEOUT_MS = 20_000;
const FEED_MAX_AGE_MS = 30 * 60 * 1000;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const FACEBOOK_API_VERSION = "v19.0";

function proxyList(proxy: string): string[] {
  return proxy
    .split(/[\r\n,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function withProxy(url: string, proxy: string): string {
  const trimmed = proxy.trim();
  if (!trimmed) return url;
  if (trimmed.includes("{url}")) {
    return trimmed.replace("{url}", encodeURIComponent(url));
  }
  return `${trimmed}${encodeURIComponent(url)}`;
}

/** Resolve with the first successful task, or reject when every task fails. */
function firstSuccess<T>(tasks: Array<() => Promise<T>>): Promise<T> {
  return new Promise((resolve, reject) => {
    if (tasks.length === 0) {
      reject(new Error("No sources configured."));
      return;
    }
    const errors: unknown[] = [];
    let remaining = tasks.length;
    tasks.forEach((task) => {
      task().then(resolve, (error) => {
        errors.push(error);
        remaining -= 1;
        if (remaining === 0) {
          const first = errors.find((value) => value instanceof Error);
          reject(first instanceof Error ? first : new Error("All sources failed."));
        }
      });
    });
  });
}

async function fetchWithTimeout(url: string): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      fetch(url),
      new Promise<Response>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("The video feed request timed out.")),
          REQUEST_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function directChild(parent: Element | null, localName: string): Element | null {
  if (!parent) return null;
  return Array.from(parent.children).find((child) => child.localName === localName) ?? null;
}

function directText(parent: Element | null, localName: string): string {
  return directChild(parent, localName)?.textContent?.trim() ?? "";
}

/** Parse a YouTube channel RSS (XML) response into videos. */
export function parseYouTubeFeed(xml: string): ExternalVideo[] {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("YouTube returned an invalid feed.");
  }

  const videos: ExternalVideo[] = [];
  for (const entry of Array.from(doc.getElementsByTagName("entry"))) {
    const videoId = directText(entry, "videoId");
    if (!videoId) continue;

    const group = directChild(entry, "group");
    const thumbnails = group ? Array.from(group.getElementsByTagName("thumbnail")) : [];
    const bestThumbnail = thumbnails.sort(
      (a, b) => Number(b.getAttribute("width") ?? 0) - Number(a.getAttribute("width") ?? 0),
    )[0];

    videos.push({
      id: `youtube-${videoId}`,
      provider: "youtube",
      title: directText(entry, "title") || "Untitled video",
      description: group ? directText(group, "description") : "",
      publishedAt: directText(entry, "published"),
      thumbnail:
        bestThumbnail?.getAttribute("url") || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      author: directText(directChild(entry, "author"), "name") || undefined,
    });
  }
  return videos;
}

async function fetchYouTubeViaApi(settings: VideoSourceSettings): Promise<ExternalVideo[]> {
  const params = new URLSearchParams({
    part: "snippet",
    channelId: settings.youtubeChannelId.trim(),
    maxResults: "15",
    order: "date",
    type: "video",
    key: settings.youtubeApiKey.trim(),
  });

  const response = await fetchWithTimeout(`${YOUTUBE_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`YouTube API returned ${response.status}. Check the API key and quota.`);
  }

  const payload = (await response.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        description?: string;
        publishedAt?: string;
        channelTitle?: string;
        thumbnails?: Record<string, { url?: string }>;
      };
    }>;
  };

  return (payload.items ?? []).flatMap((item) => {
    const videoId = item.id?.videoId;
    if (!videoId) return [];
    const snippet = item.snippet ?? {};
    const thumbnail =
      snippet.thumbnails?.high?.url ??
      snippet.thumbnails?.medium?.url ??
      snippet.thumbnails?.default?.url ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    return [
      {
        id: `youtube-${videoId}`,
        provider: "youtube" as const,
        title: snippet.title ?? "Untitled video",
        description: snippet.description ?? "",
        publishedAt: snippet.publishedAt ?? "",
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        author: snippet.channelTitle,
      },
    ];
  });
}

export async function fetchYouTubeVideos(settings: VideoSourceSettings): Promise<ExternalVideo[]> {
  if (!settings.youtubeEnabled) return [];

  const channelId = settings.youtubeChannelId.trim();
  if (!channelId) {
    throw new Error("Add a YouTube channel ID in the video feed settings.");
  }

  if (settings.youtubeApiKey.trim()) {
    try {
      return await fetchYouTubeViaApi(settings);
    } catch {
      // Fall back to the public RSS feed when the API key/quota is not usable.
    }
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const candidates = [
    ...proxyList(settings.corsProxy).map((proxy) => withProxy(feedUrl, proxy)),
    feedUrl,
  ];

  return firstSuccess(
    candidates.map((url) => async () => {
      const response = await fetchWithTimeout(url);
      if (!response.ok) throw new Error(`YouTube feed returned ${response.status}`);
      const videos = parseYouTubeFeed(await response.text());
      if (videos.length === 0) throw new Error("The YouTube feed contained no videos.");
      return videos;
    }),
  );
}

export async function fetchFacebookVideos(settings: VideoSourceSettings): Promise<ExternalVideo[]> {
  if (!settings.facebookEnabled) return [];

  const pageId = settings.facebookPageId.trim();
  const accessToken = settings.facebookAccessToken.trim();
  if (!pageId || !accessToken) {
    throw new Error(
      "Add the Facebook Page ID and a Page access token to fetch Facebook videos.",
    );
  }

  const params = new URLSearchParams({
    fields: "id,title,description,created_time,permalink_url,thumbnail_url",
    limit: "15",
    access_token: accessToken,
  });
  const apiUrl = `https://graph.facebook.com/${FACEBOOK_API_VERSION}/${encodeURIComponent(pageId)}/videos?${params.toString()}`;
  const candidates = [
    ...proxyList(settings.corsProxy).map((proxy) => withProxy(apiUrl, proxy)),
    apiUrl,
  ];

  let payload: { data?: Array<Record<string, unknown>> } | null = null;
  let lastError: unknown;

  for (const url of candidates) {
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(
          `Facebook API returned ${response.status}${body ? `: ${body.slice(0, 160)}` : ""}`,
        );
      }
      payload = (await response.json()) as {
        data?: Array<Record<string, unknown>>;
      };
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!payload) {
    throw lastError instanceof Error
      ? lastError
      : new Error("Could not load the Facebook videos.");
  }

  return (payload.data ?? []).flatMap((item) => {
    const id = String(item.id ?? "");
    if (!id) return [];
    const permalink =
      typeof item.permalink_url === "string"
        ? item.permalink_url
        : `https://www.facebook.com/${id}`;
    return [
      {
        id: `facebook-${id}`,
        provider: "facebook" as const,
        title:
          typeof item.title === "string" && item.title.trim()
            ? item.title
            : "Facebook video",
        description: typeof item.description === "string" ? item.description : "",
        publishedAt: typeof item.created_time === "string" ? item.created_time : "",
        thumbnail: typeof item.thumbnail_url === "string" ? item.thumbnail_url : "",
        url: permalink,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(permalink)}`,
        author: "Facebook",
      },
    ];
  });
}

export type VideoSyncResult = VideoFeedCache & { errors: string[] };

let inflight: Promise<VideoSyncResult> | null = null;

export function isVideoFeedStale(
  cache: VideoFeedCache,
  maxAgeMs = FEED_MAX_AGE_MS,
): boolean {
  if (!cache.syncedAt || cache.videos.length === 0) return true;
  const age = Date.now() - new Date(cache.syncedAt).getTime();
  return !Number.isFinite(age) || age > maxAgeMs;
}

export async function syncVideoFeeds(options?: {
  settings?: VideoSourceSettings;
  force?: boolean;
}): Promise<VideoSyncResult> {
  if (inflight && !options?.force) return inflight;

  const settings = options?.settings ?? getVideoSources();
  const run = (async (): Promise<VideoSyncResult> => {
    const [youtubeResult, facebookResult] = await Promise.allSettled([
      fetchYouTubeVideos(settings),
      fetchFacebookVideos(settings),
    ]);

    const previous = getVideoFeedCache().videos;
    const errors: string[] = [];

    const collect = (
      provider: ExternalVideoProvider,
      enabled: boolean,
      result: PromiseSettledResult<ExternalVideo[]>,
    ): ExternalVideo[] => {
      if (!enabled) return [];
      if (result.status === "fulfilled") return result.value;
      errors.push(
        `${provider === "youtube" ? "YouTube" : "Facebook"}: ${
          result.reason instanceof Error ? result.reason.message : String(result.reason)
        }`,
      );
      return previous.filter((video) => video.provider === provider);
    };

    const videos = [
      ...collect("youtube", settings.youtubeEnabled, youtubeResult),
      ...collect("facebook", settings.facebookEnabled, facebookResult),
    ];

    const cache: VideoFeedCache = { videos, syncedAt: nowIso() };
    writeStore(STORAGE_KEYS.externalVideos, cache);
    return { ...cache, errors };
  })();

  inflight = run;
  try {
    return await run;
  } finally {
    inflight = null;
  }
}

export function clearVideoFeedCache(): void {
  writeStore(STORAGE_KEYS.externalVideos, {
    videos: [],
    syncedAt: "",
  } satisfies VideoFeedCache);
}
