import sermonImage from "@/assets/sermon.jpg";
import { Play, Youtube, ExternalLink } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

const sermons = [
  {
    title: "La Foi qui Déplace les Montagnes",
    pastor: "Pasteur Jean-Pierre Ndayishimiye",
    date: "16 Février 2025",
    series: "Série: La Puissance de la Foi",
    youtubeId: "dQw4w9WgXcQ", // Placeholder - replace with real ID
    thumbnail: sermonImage,
  },
  {
    title: "Marcher dans l'Amour de Dieu",
    pastor: "Pasteure Marie-Claire Hakizimana",
    date: "9 Février 2025",
    series: "Série: Vivre en Victoire",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: sermonImage,
  },
  {
    title: "L'Esprit Saint: Notre Guide",
    pastor: "Pasteur Jean-Pierre Ndayishimiye",
    date: "2 Février 2025",
    series: "Série: La Puissance de la Foi",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: sermonImage,
  },
];

export default function Sermons() {
  const { t } = useTranslation();
  const ref = useReveal();

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
            <div className="relative group cursor-pointer">
              <img
                src={sermonImage}
                alt="Latest sermon"
                className="w-full h-72 lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-secondary-dark/40 group-hover:bg-secondary-dark/20 transition-colors flex items-center justify-center">
                <a
                  href="https://www.youtube.com/@MinevamKigobe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-card hover:scale-110 transition-all"
                >
                  <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                </a>
              </div>
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                {t("sermons.latestMessage")}
              </div>
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <p className="text-primary text-sm font-semibold font-body mb-2">Série: La Puissance de la Foi</p>
              <h3 className="font-display text-3xl font-bold text-secondary mb-4">
                La Foi qui Déplace les Montagnes
              </h3>
              <p className="text-muted-foreground font-body mb-2">
                Pasteur Jean-Pierre Ndayishimiye
              </p>
              <p className="text-muted-foreground text-sm font-body mb-6">16 Février 2025</p>
              <p className="text-foreground/80 font-body text-sm leading-relaxed mb-6">
                Dans ce message puissant, découvrez comment une foi authentique peut transformer votre vie 
                et déplacer les obstacles qui semblent insurmontables...
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/@MinevamKigobe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-primary-foreground font-semibold text-sm shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all"
                >
                  <Play className="w-4 h-4" />
                  {t("sermons.watchNow")}
                </a>
                <a
                  href="https://www.youtube.com/@MinevamKigobe"
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
        <div className="grid md:grid-cols-3 gap-6">
          {sermons.map((sermon, i) => (
            <div
              key={sermon.title}
              className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl shadow-card border border-border overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className="relative">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-secondary-dark/30 group-hover:bg-secondary-dark/10 transition-colors flex items-center justify-center">
                  <a
                    href="https://www.youtube.com/@MinevamKigobe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-card"
                  >
                    <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                  </a>
                </div>
              </div>
              <div className="p-5">
                <p className="text-primary text-xs font-semibold font-body mb-1.5">{sermon.series}</p>
                <h4 className="font-display font-bold text-foreground mb-2 leading-snug">{sermon.title}</h4>
                <p className="text-muted-foreground text-sm font-body">{sermon.pastor}</p>
                <p className="text-muted-foreground text-xs font-body mt-0.5">{sermon.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube CTA */}
        <div className="reveal mt-10 text-center">
          <a
            href="https://www.youtube.com/@MinevamKigobe"
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
