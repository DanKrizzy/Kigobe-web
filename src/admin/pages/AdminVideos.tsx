import { useState } from "react";
import {
  Facebook,
  Info,
  RefreshCw,
  Rss,
  Save,
  Trash2,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState } from "@/admin/components/AdminUI";
import { useVideoSources, useVideoFeedCache } from "@/admin/stores/adminDataStore";
import { defaultVideoSources, type VideoSourceSettings } from "@/data/siteData";
import { syncVideoFeeds } from "@/lib/videoFeeds";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminVideos() {
  const { sources, saveSources, resetSources } = useVideoSources();
  const { cache, clearCache } = useVideoFeedCache();
  const [form, setForm] = useState<VideoSourceSettings>(sources);
  const [syncing, setSyncing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof VideoSourceSettings>(
    key: K,
    value: VideoSourceSettings[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    saveSources(form);
    toast.success("Video feed settings saved");
  };

  const handleReset = () => {
    resetSources();
    setForm(defaultVideoSources);
    setErrors([]);
    toast.success("Video feed settings reset to defaults");
  };

  const handleSync = async () => {
    setSyncing(true);
    setErrors([]);
    try {
      saveSources(form);
      const result = await syncVideoFeeds({ settings: form, force: true });
      setErrors(result.errors);
      if (result.videos.length > 0) {
        toast.success(
          `Fetched ${result.videos.length} video${result.videos.length === 1 ? "" : "s"}`,
        );
      } else {
        toast.error("No videos fetched. Check the settings and the errors below.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sync videos");
    } finally {
      setSyncing(false);
    }
  };

  const youtubeUrl = form.youtubeHandle
    ? `https://www.youtube.com/@${form.youtubeHandle.replace(/^@/, "")}`
    : form.youtubeChannelId
      ? `https://www.youtube.com/channel/${form.youtubeChannelId}`
      : "";

  const facebookCount = cache.videos.filter((v) => v.provider === "facebook").length;
  const youtubeCount = cache.videos.filter((v) => v.provider === "youtube").length;
  const syncedLabel = cache.syncedAt
    ? new Date(cache.syncedAt).toLocaleString()
    : "Never";

  return (
    <div>
      <PageHeader
        title="Video Feeds"
        description="Automatically pull recent videos from your YouTube channel and Facebook page."
        actions={
          <>
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={syncing}
              className="gap-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync now"}
            </Button>
            <Button onClick={handleSave} className="gradient-primary gap-1.5">
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-4 flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-semibold text-foreground">YouTube</span> works
            without a key: videos are read from the channel's public RSS feed through
            the CORS proxies below. A YouTube Data API key is optional but recommended
            for production.
          </p>
          <p>
            <span className="font-semibold text-foreground">Facebook</span> requires
            the Page ID and a Page access token. The token is stored in this browser —
            use a token with minimal permissions and rotate it if it is ever exposed.
          </p>
          <p>
            Fetched videos appear in the “Latest Videos” section of the public Sermons
            area and refresh automatically every 30 minutes.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" /> YouTube channel
              </CardTitle>
              <Switch
                checked={form.youtubeEnabled}
                onCheckedChange={(checked) => set("youtubeEnabled", checked)}
                aria-label="Enable YouTube feed"
              />
            </div>
            <CardDescription>
              Defaults to the MINEVAM Kigobe Church channel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              label="Channel ID"
              hint="Starts with “UC”. Find it under YouTube → Settings → Advanced."
            >
              <Input
                value={form.youtubeChannelId}
                onChange={(e) => set("youtubeChannelId", e.target.value)}
                placeholder="UCxxxxxxxxxxxxxxxxxxxxxx"
              />
            </Field>
            <Field label="Channel handle" hint="Used for the public channel link.">
              <Input
                value={form.youtubeHandle}
                onChange={(e) => set("youtubeHandle", e.target.value)}
                placeholder="MinevamKigobe"
              />
            </Field>
            <Field
              label="YouTube Data API key (optional)"
              hint="When set, the official API is used instead of the RSS feed."
            >
              <Input
                type="password"
                value={form.youtubeApiKey}
                onChange={(e) => set("youtubeApiKey", e.target.value)}
                placeholder="AIza..."
              />
            </Field>
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <Youtube className="w-4 h-4" /> Open channel
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook page
              </CardTitle>
              <Switch
                checked={form.facebookEnabled}
                onCheckedChange={(checked) => set("facebookEnabled", checked)}
                aria-label="Enable Facebook feed"
              />
            </div>
            <CardDescription>
              Requires a Page ID and a Page access token from the Graph API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Page URL" hint="Used for the “Watch on Facebook” links.">
              <Input
                value={form.facebookPageUrl}
                onChange={(e) => set("facebookPageUrl", e.target.value)}
                placeholder="https://facebook.com/MinevamKigobe"
              />
            </Field>
            <Field label="Page ID">
              <Input
                value={form.facebookPageId}
                onChange={(e) => set("facebookPageId", e.target.value)}
                placeholder="1234567890"
              />
            </Field>
            <Field
              label="Page access token"
              hint="Needs the pages_read_engagement permission. Stored only in this browser."
            >
              <Input
                type="password"
                value={form.facebookAccessToken}
                onChange={(e) => set("facebookAccessToken", e.target.value)}
                placeholder="EAAG..."
              />
            </Field>
            {form.facebookPageUrl && (
              <a
                href={form.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <Facebook className="w-4 h-4" /> Open page
              </a>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Rss className="w-4 h-4 text-primary" /> Connection
          </CardTitle>
          <CardDescription>
            Shared by both feeds. AllOrigins works out of the box; you can point this
            to your own proxy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field
            label="CORS proxies"
            hint="One per line. Use {url} as a placeholder, or keep the default where the encoded URL is appended. Requests race and the first successful proxy wins."
          >
            <Textarea
              rows={3}
              value={form.corsProxy}
              onChange={(e) => set("corsProxy", e.target.value)}
              placeholder={"https://api.allorigins.win/raw?url=\nhttps://api.codetabs.com/v1/proxy?quest="}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} className="gradient-primary gap-1.5">
              <Save className="w-4 h-4" /> Save settings
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset to defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Cached videos
              <Badge variant="secondary">{cache.videos.length}</Badge>
            </CardTitle>
            <CardDescription>Last synced: {syncedLabel}</CardDescription>
          </div>
          {cache.videos.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearCache();
                setErrors([]);
                toast.success("Cached videos cleared");
              }}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-500" /> {youtubeCount} YouTube
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-[#1877F2]" /> {facebookCount} Facebook
            </Badge>
          </div>

          {errors.length > 0 && (
            <ul className="mb-4 space-y-1 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {errors.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}

          {cache.videos.length === 0 ? (
            <EmptyState
              icon={<Rss className="w-6 h-6" />}
              title="No videos cached yet"
              description="Click “Sync now” to fetch the latest videos from your channels."
            />
          ) : (
            <ul className="divide-y divide-border max-h-96 overflow-y-auto">
              {cache.videos.map((video) => (
                <li key={video.id} className="py-2.5 flex items-center gap-3">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                      className="w-16 h-10 rounded-md object-cover bg-muted shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-10 rounded-md bg-muted shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {video.provider === "youtube" ? "YouTube" : "Facebook"}
                      {video.publishedAt
                        ? ` · ${new Date(video.publishedAt).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline shrink-0"
                  >
                    Open
                  </a>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
