import communityImage from "@/assets/community.jpg";
import { Heart, Eye, Users } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const ref = useReveal();

  return (
    <section id="about" className="section-padding gradient-warm" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">{t("about.ourStory")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("about.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto" />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Image */}
          <div className="reveal">
            <div className="relative">
              <img
                src={communityImage}
                alt="Minevam Kigobe Church community"
                className="rounded-3xl shadow-card w-full h-80 md:h-96 object-cover"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-card rounded-2xl p-4 shadow-card border border-border">
                <p className="font-display text-2xl font-bold text-primary">{t("about.since2004")}</p>
                <p className="text-muted-foreground text-sm font-body">{t("about.servingBujumbura")}</p>
              </div>
              {/* Accent blob */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/20 rounded-full blur-xl" />
            </div>
          </div>

          {/* Text */}
          <div className="reveal reveal-delay-1">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 font-body">
              {t("about.paragraph1")}
            </p>
            <p className="text-muted-foreground leading-relaxed font-body">
              {t("about.paragraph2")}
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Heart,
              title: t("about.mission"),
              color: "bg-primary/10 text-primary",
              border: "border-primary/20",
              description: t("about.missionDesc"),
            },
            {
              icon: Eye,
              title: t("about.vision"),
              color: "bg-secondary/10 text-secondary",
              border: "border-secondary/20",
              description: t("about.visionDesc"),
            },
            {
              icon: Users,
              title: t("about.values"),
              color: "bg-accent/20 text-accent-foreground",
              border: "border-accent/30",
              description: t("about.valuesDesc"),
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl p-7 shadow-card border ${item.border} hover:shadow-hover hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-body">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Leadership */}
        <div className="reveal text-center bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">{t("about.leadership")}</span>
          <h3 className="font-display text-3xl font-bold text-secondary mb-8">{t("about.guidedBy")}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Pasteur Jean-Pierre Ndayishimiye", role: t("about.seniorPastor"), initials: "JP" },
              { name: "Pasteure Marie-Claire Hakizimana", role: t("about.associatePastor"), initials: "MC" },
              { name: "Diacre Emmanuel Niyonzima", role: t("about.headOfOutreach"), initials: "EN" },
            ].map((leader) => (
              <div key={leader.name} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center text-white font-display font-bold text-xl shadow-secondary">
                  {leader.initials}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{leader.name}</p>
                  <p className="text-primary text-sm font-body">{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
