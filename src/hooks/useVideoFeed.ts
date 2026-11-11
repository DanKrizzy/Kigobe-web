import { useCallback, useEffect, useRef, useState } from "react";
import {
  DATA_CHANGED_EVENT,
  getVideoFeedCache,
  getVideoSources,
  type ExternalVideo,
  type VideoFeedCache,
  type VideoSourceSettings,
} from "@/data/siteData";
import { isVideoFeedStale, syncVideoFeeds } from "@/lib/videoFeeds";

/**
 * Reads the cached video feed and refreshes it automatically when it is stale
 * (older than 30 minutes). Used by the public Sermons section.
 */
export function useSiteVideos() {
  const [cache, setCache] = useState<VideoFeedCache>(getVideoFeedCache);
  const [sources, setSources] = useState<VideoSourceSettings>(getVideoSources);
  const [syncing, setSyncing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const started = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const refresh = () => {
      setCache(getVideoFeedCache());
      setSources(getVideoSources());
    };
    window.addEventListener(DATA_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      mounted.current = false;
      window.removeEventListener(DATA_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setErrors([]);
    try {
      const result = await syncVideoFeeds();
      if (mounted.current) {
        setCache({ videos: result.videos, syncedAt: result.syncedAt });
        setErrors(result.errors);
      }
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not refresh videos.";
      if (mounted.current) setErrors([message]);
      return null;
    } finally {
      if (mounted.current) setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const current = getVideoSources();
    if (!current.youtubeEnabled && !current.facebookEnabled) return;
    if (isVideoFeedStale(getVideoFeedCache())) {
      void sync();
    }
  }, [sync]);

  const videos: ExternalVideo[] = cache.videos.filter((video) =>
    video.provider === "youtube" ? sources.youtubeEnabled : sources.facebookEnabled,
  );

  return {
    videos,
    syncedAt: cache.syncedAt,
    syncing,
    errors,
    sync,
    sources,
  };
}
