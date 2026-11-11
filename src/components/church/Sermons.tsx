import { Play, Youtube, Facebook, ExternalLink, RefreshCw } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { useSiteSermons, useSiteSettings } from "@/hooks/useSiteContent";
import { useSiteVideos } from "@/hooks/useVideoFeed";
import type { ExternalVideo, Sermon } from "@/data/siteData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SermonPreview({ video }: { video: Sermon }) {
  return (
    <Dialog>
      <div className="relative group overflow-hidden rounded-3xl shadow-card border border-border bg-card">
        <div className="relative">
          <img src={video.thumbnail} alt={video.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-secondary-dark/30 group-hover:bg-secondary-dark/10 transition-colors flex items-center justify-center">
            <DialogTrigger asChild>
              <button
                type="button"
                className="w-16 h-16 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-card transition-all"
                aria-label={`Watch ${video.title}`}
              >
                <Play className="w-6 h-6 text-primary fill-primary" />
              </button>
            </DialogTrigger>
          </div>
        </div>
        <div className="p-5">
          <p className="text-primary text-xs font-semibold font-body mb-1.5">{video.series}</p>
          <h4 className="font-display font-bold text-foreground mb-2 leading-snug">{video.title}</h4>
          <p className="text-muted-foreground text-sm font-body">{video.pastor}</p>
          <p className="text-muted-foreground text-xs font-body mt-0.5">{video.date}</p>
        </div>

        <DialogContent className="max-w-5xl sm:max-w-4xl">
          <DialogTitle>{video.title}</DialogTitle>
          <DialogDescription>{video.description}</DialogDescription>
          <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

function ExternalVideoCard({ video }: { video: ExternalVideo }) {
  const { t } = useTranslation();
  const isYouTube = video.provider === "youtube";
  const dateLabel = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString()
    : "";

  const playButton = (
    <span className="w-16 h-16 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-card transition-all">
      <Play className="w-6 h-6 text-primary fill-primary" />
    </span>
  );

  return (
    <div className="group overflow-hidden rounded-3xl shadow-card border border-border bg-card">
      <div className="relative">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            {isYouTube ? (
              <Youtube className="w-12 h-12 text-white/80" />
            ) : (
              <Facebook className="w-12 h-12 text-white/80" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-secondary-dark/30 group-hover:bg-secondary-dark/10 transition-colors flex items-center justify-center">
          {isYouTube && video.embedUrl ? (
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" aria-label={`Watch ${video.title}`}>
                  {playButton}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl sm:max-w-4xl">
                <DialogTitle>{video.title}</DialogTitle>
                <DialogDescription>
                  {video.description || video.author || ""}
                </DialogDescription>
                <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-black">
                  <iframe
                    className="w-full h-full"
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${video.title} on Facebook`}
            >
              {playButton}
            </a>
          )}
        </div>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 text-white text-xs font-semibold px-3 py-1 backdrop-blur">
          {isYouTube ? (
            <Youtube className="w-3.5 h-3.5 text-red-400" />
          ) : (
            <Facebook className="w-3.5 h-3.5 text-blue-400" />
          )}
          {t(isYouTube ? "sermons.fromYouTube" : "sermons.fromFacebook")}
        </span>
      </div>
      <div className="p-5">
        <h4 className="font-display font-bold text-foreground leading-snug line-clamp-2 mb-2">
          {video.title}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-body">{dateLabel}</p>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
          >
            {t("sermons.watchNow")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Sermons() {
  const { t } = useTranslation();
  const ref = useReveal();
  const sermonVideos = useSiteSermons();
  const settings = useSiteSettings();
  const { videos: feedVideos, syncing, sync, sources } = useSiteVideos();

  const featuredVideo = sermonVideos[0];
  const uploadsPlaylistId = sources.youtubeChannelId.startsWith("UC")
    ? `UU${sources.youtubeChannelId.slice(2)}`
    : "";
  const remainingVideos = sermonVideos.slice(1);
  const youtubeChannelUrl = settings.youtube || "https://youtube.com/@MinevamKigobe";
  const facebookPageUrl = settings.facebook || "https://facebook.com/MinevamKigobe";

  return (
    <section id="sermons" className="section-padding gradient-cool" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("sermons.theWord")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("sermons.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            {t("sermons.subtitle")}
          </p>
        </div>

        {featuredVideo ? (
          <>
            {/* Featured Sermon */}
            <div className="reveal mb-12 bg-card rounded-3xl shadow-card overflow-hidden border border-border">
              <div className="grid lg:grid-cols-2">
                <div className="relative group overflow-hidden">
                  <img
                    src={featuredVideo.thumbnail}
                    alt={featuredVideo.title}
                    className="w-full h-72 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-secondary-dark/40 group-hover:bg-secondary-dark/20 transition-colors flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-card hover:scale-110 transition-all"
                          aria-label={`Watch ${featuredVideo.title}`}
                        >
                          <Play className="w-6 h-6 text-primary fill-primary" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl sm:max-w-4xl">
                        <DialogTitle>{featuredVideo.title}</DialogTitle>
                        <DialogDescription>{featuredVideo.description}</DialogDescription>
                        <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-black">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${featuredVideo.youtubeId}`}
                            title={featuredVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {t("sermons.latestMessage")}
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <p className="text-primary text-sm font-semibold font-body mb-2">{featuredVideo.series}</p>
                  <h3 className="font-display text-3xl font-bold text-secondary mb-4">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-muted-foreground font-body mb-2">{featuredVideo.pastor}</p>
                  <p className="text-muted-foreground text-sm font-body mb-6">{featuredVideo.date}</p>
                  <p className="text-foreground/80 font-body text-sm leading-relaxed mb-6">
                    {featuredVideo.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={youtubeChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-primary-foreground font-semibold text-sm shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      {t("sermons.watchNow")}
                    </a>
                    <a
                      href={youtubeChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:border-secondary hover:text-secondary transition-all"
                    >
                      <Youtube className="w-4 h-4 text-destructive" />
                      {t("sermons.youtubeChannel")}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sermon Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {remainingVideos.map((video, i) => (
                <div key={video.id} className={`reveal reveal-delay-${i + 1}`}>
                  <SermonPreview video={video} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground font-body">No sermons published yet.</p>
        )}

        {feedVideos.length === 0 && sources.youtubeEnabled && uploadsPlaylistId && (
          <div className="mt-16">
            <div className="mb-6">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary">
                {t("sermons.latestVideos")}
              </h3>
              <p className="text-muted-foreground text-sm font-body mt-1">
                {t("sermons.latestVideosSubtitle")}
              </p>
            </div>
            <div className="aspect-video overflow-hidden rounded-3xl border border-border bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`}
                title={`${settings.churchName} ${settings.churchNameAccent} videos`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {syncing && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                {t("sermons.loadingVideos")}
              </p>
            )}
          </div>
        )}

        {feedVideos.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-secondary">
                  {t("sermons.latestVideos")}
                </h3>
                <p className="text-muted-foreground text-sm font-body mt-1">
                  {t("sermons.latestVideosSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void sync()}
                disabled={syncing}
                className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-secondary hover:text-secondary disabled:opacity-60 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                {t("sermons.refreshVideos")}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedVideos.map((video) => (
                <ExternalVideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {/* YouTube / Facebook CTA */}
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive text-destructive-foreground font-semibold hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Youtube className="w-5 h-5" />
            {t("sermons.subscribe")}
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={facebookPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1877F2] text-white font-semibold hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Facebook className="w-5 h-5" />
            {t("sermons.watchOnFacebook")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
