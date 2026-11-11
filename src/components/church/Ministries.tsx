import { Music, Users, Heart, Baby, Globe, BookOpen, type LucideIcon } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { useSiteMinistries } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Music,
  Users,
  Heart,
  Baby,
  Globe,
  BookOpen,
};

export default function Ministries() {
  const { t } = useTranslation();
  const ref = useReveal();
  const ministries = useSiteMinistries();

  return (
    <section id="ministries" className="section-padding gradient-warm" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("ministries.getInvolved")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("ministries.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            {t("ministries.subtitle")}
          </p>
        </div>

        {ministries.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">No ministries added yet.</p>
        ) : (
          <>
            {/* Featured Ministries with Images */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {ministries.slice(0, 3).map((ministry, i) => (
                <div
                  key={ministry.id}
                  className={`reveal reveal-delay-${i + 1} rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
                >
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30">
                    {ministry.image && (
                      <img
                        src={ministry.image}
                        alt={ministry.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${ministry.color}`} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-display font-bold text-xl">{ministry.name}</p>
                      <p className="text-white/80 text-sm">{ministry.members}</p>
                    </div>
                  </div>
                  <div className="bg-card p-5">
                    <p className="text-muted-foreground text-sm font-body leading-relaxed mb-3">{ministry.description}</p>
                    {ministry.contact && (
                      <a
                        href={`mailto:${ministry.contact}`}
                        className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors"
                      >
                        {ministry.contact}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Remaining Ministries */}
            <div className="grid md:grid-cols-3 gap-6">
              {ministries.slice(3).map((ministry, i) => {
                const Icon = iconMap[ministry.icon] ?? Users;
                return (
                  <div
                    key={ministry.id}
                    className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-hover hover:-translate-y-1 transition-all duration-300`}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-lg mb-2">{ministry.name}</h3>
                    <p className="text-primary text-sm font-semibold font-body mb-3">{ministry.members}</p>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">{ministry.description}</p>
                    {ministry.contact && (
                      <a
                        href={`mailto:${ministry.contact}`}
                        className="text-secondary text-sm font-semibold hover:text-secondary-dark transition-colors"
                      >
                        {ministry.contact}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="reveal mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-secondary text-secondary-foreground font-semibold shadow-secondary hover:shadow-hover hover:-translate-y-0.5 transition-all"
          >
            <Users className="w-5 h-5" />
            {t("ministries.joinMinistry")}
          </a>
        </div>
      </div>
    </section>
  );
}
