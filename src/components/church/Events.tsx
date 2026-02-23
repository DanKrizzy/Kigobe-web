import { Calendar, MapPin, Clock, Bell } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

export default function Events() {
  const { t } = useTranslation();
  const ref = useReveal();

  const events = [
    { month: "MAR", day: "02", titleKey: "event1Title", time: "6:00 AM – 6:00 PM", location: "Salle principale de l'église", category: "Spiritual", categoryColor: "bg-primary/10 text-primary", descKey: "event1Desc" },
    { month: "MAR", day: "15", titleKey: "event2Title", time: "3:00 PM – 9:00 PM", location: "Centre Communautaire Kigobe", category: "Youth", categoryColor: "bg-accent/20 text-accent-foreground", descKey: "event2Desc" },
    { month: "MAR", day: "23", titleKey: "event3Title", time: "9:00 AM – 1:00 PM", location: "Quartier Kinyinya, Bujumbura", category: "Outreach", categoryColor: "bg-secondary/10 text-secondary", descKey: "event3Desc" },
    { month: "APR", day: "05", titleKey: "event4Title", time: "7:00 AM & 10:30 AM", location: "Église Principale & en plein air", category: "Celebration", categoryColor: "bg-primary/10 text-primary", descKey: "event4Desc" },
    { month: "APR", day: "19", titleKey: "event5Title", time: "6:00 PM – 10:00 PM", location: "Hôtel Club du Lac Tanganyika", category: "Fundraising", categoryColor: "bg-accent/20 text-accent-foreground", descKey: "event5Desc" },
    { month: "MAI", day: "10", titleKey: "event6Title", time: "10:00 AM – 5:00 PM", location: "Parc de Bujumbura", category: "Community", categoryColor: "bg-secondary/10 text-secondary", descKey: "event6Desc" },
  ];

  const announcementKeys = ["announcement1", "announcement2", "announcement3", "announcement4"];

  return (
    <section id="events" className="section-padding bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("events.whatsHappening")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("events.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {events.map((event, i) => (
                <div
                  key={event.titleKey}
                  className={`reveal reveal-delay-${Math.min(i + 1, 4)} bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 flex gap-4`}
                >
                  {/* Date Block */}
                  <div className="text-center gradient-primary text-primary-foreground rounded-xl px-4 py-3 h-fit shrink-0 min-w-[60px]">
                    <p className="text-xs font-bold opacity-80">{event.month}</p>
                    <p className="font-display text-2xl font-bold leading-none">{event.day}</p>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <h4 className="font-display font-bold text-foreground leading-snug">{t(`events.${event.titleKey}`)}</h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${event.categoryColor} shrink-0`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground font-body mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed">{t(`events.${event.descKey}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Sidebar */}
          <div className="reveal">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">{t("events.announcements")}</h3>
              </div>
              <div className="space-y-4">
                {announcementKeys.map((key, i) => (
                  <div key={i} className="p-4 bg-muted rounded-xl border border-border">
                    <p className="text-sm font-body text-foreground/85 leading-relaxed">{t(`events.${key}`)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-sm text-muted-foreground font-body text-center">
                  {t("events.stayConnected")}
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#newsletter" className="flex-1 text-center py-2.5 rounded-full gradient-primary text-primary-foreground text-sm font-semibold hover:shadow-primary transition-all">
                    {t("events.subscribe")}
                  </a>
                  <a
                    href="https://wa.me/25761234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all"
                  >
                    {t("events.whatsapp")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
