import { Clock, Calendar, Music, BookOpen, Sun, Star } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

export default function Services() {
  const { t } = useTranslation();
  const ref = useReveal();

  const weeklyServices = [
    { icon: Sun, dayKey: "sunday", time: "8:00 AM", nameKey: "earlyWorship", descKey: "earlyWorshipDesc", color: "text-accent" },
    { icon: Music, dayKey: "sunday", time: "10:30 AM", nameKey: "mainService", descKey: "mainServiceDesc", color: "text-primary" },
    { icon: BookOpen, dayKey: "wednesday", time: "6:00 PM", nameKey: "bibleStudy", descKey: "bibleStudyDesc", color: "text-secondary" },
    { icon: Star, dayKey: "friday", time: "7:00 PM", nameKey: "prayerFasting", descKey: "prayerFastingDesc", color: "text-accent" },
  ];

  const specialPrograms = [
    { titleKey: "youthAlive", scheduleKey: "youthAliveSchedule", descKey: "youthAliveDesc" },
    { titleKey: "womenOfFaith", scheduleKey: "womenOfFaithSchedule", descKey: "womenOfFaithDesc" },
    { titleKey: "mensBreakfast", scheduleKey: "mensBreakfastSchedule", descKey: "mensBreakfastDesc" },
    { titleKey: "childrensChurch", scheduleKey: "childrensChurchSchedule", descKey: "childrensChurchDesc" },
  ];

  return (
    <section id="services" className="section-padding bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("services.joinUs")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("services.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto font-body">
            {t("services.subtitle")}
          </p>
        </div>

        {/* Weekly Services */}
        <h3 className="font-display text-2xl font-bold text-foreground mb-6 reveal flex items-center gap-3">
          <Clock className="w-6 h-6 text-primary" />
          {t("services.weeklyServices")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          {weeklyServices.map((service, i) => (
            <div
              key={service.nameKey}
              className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                  <service.icon className={`w-5 h-5 ${service.color} group-hover:text-primary-foreground`} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display font-bold text-foreground text-lg">{t(`services.${service.nameKey}`)}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary font-semibold text-sm font-body">{t(`services.${service.dayKey}`)}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-sm font-body">{service.time}</span>
                  </div>
                  <p className="text-muted-foreground text-sm font-body">{t(`services.${service.descKey}`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Programs */}
        <h3 className="font-display text-2xl font-bold text-foreground mb-6 reveal flex items-center gap-3">
          <Calendar className="w-6 h-6 text-secondary" />
          {t("services.specialPrograms")}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {specialPrograms.map((program, i) => (
            <div
              key={program.titleKey}
              className={`reveal reveal-delay-${i + 1} bg-gradient-cool rounded-2xl p-6 border border-border hover:shadow-card transition-all duration-300`}
            >
              <div className="flex gap-4 items-start">
                <div className="w-3 h-3 rounded-full gradient-primary mt-1.5 shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-foreground mb-1">{t(`services.${program.titleKey}`)}</h4>
                  <p className="text-secondary font-semibold text-sm mb-2 font-body">{t(`services.${program.scheduleKey}`)}</p>
                  <p className="text-muted-foreground text-sm font-body">{t(`services.${program.descKey}`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Location Note */}
        <div className="reveal mt-10 text-center p-6 rounded-2xl gradient-primary text-primary-foreground">
          <p className="font-display text-xl font-bold mb-1">{t("services.allServicesAt")}</p>
          <p className="font-body opacity-90">{t("services.location")}</p>
          <p className="font-body text-sm opacity-75 mt-1">{t("services.doorsOpen")}</p>
        </div>
      </div>
    </section>
  );
}
