import { Play, Youtube, ExternalLink } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const youtubeChannelUrl = "https://www.youtube.com/@minevamkigobe";

const sermonVideos = [
  {
    id: "Cs3hR6gEirI",
    title: "Culte du Dimanche le 02-08-2026",
    pastor: "Pasteur Aime Prosper",
    date: "02 Août 2026",
    series: "Dimanche Service",
    thumbnail: "https://i.ytimg.com/vi/Cs3hR6gEirI/hqdefault.jpg",
    description: "Dernier message de Minevam Kigobe Church pour renforcer votre foi et votre vie de prière.",
  },
  {
    id: "AoPhDkD4Ekw",
    title: "UBUZIMA BUTUMBEREYE INTSINZI",
    pastor: "Pasteur Anaclet",
    date: "02 Août 2026",
    series: "Sermon",
    thumbnail: "https://i.ytimg.com/vi/AoPhDkD4Ekw/hqdefault.jpg",
    description: "Un message puissant sur la victoire, la foi et la transformation personnelle.",
  },
  {
    id: "huHt-zfk0vg",
    title: "Nashaka kumenyekana cane, gutunga, bituma nja muvyubupfumu - Intahe ya Emery NDABARUSHIMANA",
    pastor: "Pasteur Pie",
    date: "28 Juillet 2026",
    series: "Enseignement",
    thumbnail: "https://i.ytimg.com/vi/huHt-zfk0vg/hqdefault.jpg",
    description: "Une réflexion sur les priorités, les tentations et la marche dans la lumière de Dieu.",
  },
  {
    id: "te81XahwdY0",
    title: "Croissance Spirituelle et Puissance de la Parole",
    pastor: "Diacre Eloge",
    date: "24 Juillet 2026",
    series: "Vie Chrétienne",
    thumbnail: "https://i.ytimg.com/vi/te81XahwdY0/hqdefault.jpg",
    description: "Un message d'encouragement pour grandir dans la foi et marcher avec assurance.",
  },
];

function SermonPreview({ video }: { video: typeof sermonVideos[number] }) {
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
              src={`https://www.youtube.com/embed/${video.id}`}
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

export default function Sermons() {
  const { t } = useTranslation();
  const ref = useReveal();
  const featuredVideo = sermonVideos[0];

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
                        src={`https://www.youtube.com/embed/${featuredVideo.id}`}
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
          {sermonVideos.map((video, i) => (
            <div key={video.id} className={`reveal reveal-delay-${i + 1}`}>
              <SermonPreview video={video} />
            </div>
          ))}
        </div>

        {/* YouTube CTA */}
        <div className="reveal mt-10 text-center">
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
        </div>
      </div>
    </section>
  );
}
