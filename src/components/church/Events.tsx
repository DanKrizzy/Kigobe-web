import { MapPin, Clock, Bell } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { useSiteAnnouncements, useSiteEvents } from "@/hooks/useSiteContent";

const categoryColor = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes("youth") || value.includes("jeun")) return "bg-accent/20 text-accent-foreground";
  if (value.includes("outreach") || value.includes("community") || value.includes("social")) return "bg-secondary/10 text-secondary";
  return "bg-primary/10 text-primary";
};

export default function Events() {
  const { t } = useTranslation();
  const ref = useReveal();
  const events = useSiteEvents();
  const announcements = useSiteAnnouncements();

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
            {events.length === 0 ? (
              <p className="text-muted-foreground font-body">No events scheduled yet.</p>
            ) : (
              <div className="space-y-4">
                {events.map((event, i) => (
                  <div
                    key={event.id}
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
                        <h4 className="font-display font-bold text-foreground leading-snug">{event.title}</h4>
                        {event.category && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColor(event.category)} shrink-0`}>
                            {event.category}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground font-body mb-2">
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-muted-foreground text-sm font-body leading-relaxed">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements Sidebar */}
          <div className="reveal">
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-display text-xl font-bold text-foreground">{t("events.announcements")}</h3>
              </div>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body">No announcements right now.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-muted rounded-xl border border-border">
                      <p className="text-sm font-body text-foreground/85 leading-relaxed">{announcement.text}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-sm text-muted-foreground font-body text-center">
                  {t("events.stayConnected")}
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#newsletter" className="flex-1 text-center py-2.5 rounded-full gradient-primary text-primary-foreground text-sm font-semibold hover:shadow-primary transition-all">
                    {t("events.subscribe")}
                  </a>
                  <a
                    href="https://wa.me/25764433144"
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
