import { describe, expect, it } from "vitest";
import { isVideoFeedStale, parseYouTubeFeed } from "@/lib/videoFeeds";

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"
  xmlns:yt="http://www.youtube.com/xml/schemas/2015"
  xmlns:media="http://search.yahoo.com/mrss/">
  <title>MINEVAM Kigobe Church</title>
  <entry>
    <id>yt:video:abc123</id>
    <yt:videoId>abc123</yt:videoId>
    <title>Test sermon</title>
    <published>2026-11-10T07:00:16+00:00</published>
    <author><name>MINEVAM Kigobe Church</name></author>
    <media:group>
      <media:title>Test sermon</media:title>
      <media:thumbnail url="https://i.ytimg.com/vi/abc123/hqdefault.jpg" width="480" height="360" />
      <media:description>Test description</media:description>
    </media:group>
  </entry>
</feed>`;

describe("parseYouTubeFeed", () => {
  it("maps RSS entries to external videos", () => {
    const [video] = parseYouTubeFeed(feed);

    expect(video).toMatchObject({
      id: "youtube-abc123",
      provider: "youtube",
      title: "Test sermon",
      description: "Test description",
      url: "https://www.youtube.com/watch?v=abc123",
      embedUrl: "https://www.youtube.com/embed/abc123",
      thumbnail: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      author: "MINEVAM Kigobe Church",
    });
  });

  it("ignores entries without a video id", () => {
    expect(parseYouTubeFeed("<feed><entry><title>No id</title></entry></feed>")).toEqual([]);
  });
});

describe("isVideoFeedStale", () => {
  it("treats an empty feed as stale", () => {
    expect(isVideoFeedStale({ videos: [], syncedAt: "" })).toBe(true);
  });

  it("treats a recent feed as fresh", () => {
    expect(
      isVideoFeedStale({
        videos: [
          {
            id: "youtube-1",
            provider: "youtube",
            title: "Video",
            description: "",
            publishedAt: "",
            thumbnail: "",
            url: "https://www.youtube.com/watch?v=1",
          },
        ],
        syncedAt: new Date().toISOString(),
      }),
    ).toBe(false);
  });
});
