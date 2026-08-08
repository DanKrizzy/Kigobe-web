import choirImage from "@/assets/choir.jpg";
import youthImage from "@/assets/youth.jpg";
import communityImage from "@/assets/community.jpg";
import { Music, Users, Heart, Baby, Globe, BookOpen } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";

export default function Ministries() {
  const { t } = useTranslation();
  const ref = useReveal();

  const ministries = [
  { icon: Music, nameKey: "choir", image: choirImage, descKey: "choirDesc", membersKey: "membersChoir", contact: "chorale@minervamkigobe.bi", color: "from-primary/80 to-accent/80" },
  { icon: Users, nameKey: "youth", image: youthImage, descKey: "youthDesc", membersKey: "membersYouth", contact: "jeunesse@minervamkigobe.bi", color: "from-secondary/80 to-secondary-light/80" },
  { icon: Heart, nameKey: "outreach", image: communityImage, descKey: "outreachDesc", membersKey: "membersOutreach", contact: "outreach@minervamkigobe.bi", color: "from-red-500/80 to-primary/80" },
  { icon: Baby, nameKey: "kids", descKey: "kidsDesc", membersKey: "membersKids", contact: "enfants@minervamkigobe.bi", color: "from-accent/80 to-primary-light/80" },
  { icon: Globe, nameKey: "missions", descKey: "missionsDesc", membersKey: "membersMissions", contact: "missions@minervamkigobe.bi", color: "from-secondary-dark/80 to-secondary/80" },
  { icon: BookOpen, nameKey: "sundaySchool", descKey: "sundaySchoolDesc", membersKey: "membersSundaySchool", contact: "education@minervamkigobe.bi", color: "from-primary-dark/80 to-secondary/80" },
  ];

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

        {/* Featured Ministries with Images */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {ministries.slice(0, 3).map((ministry, i) => (
            <div
              key={ministry.nameKey}
              className={`reveal reveal-delay-${i + 1} rounded-2xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
            >
              {ministry.image && (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={ministry.image}
                    alt={t(`ministries.${ministry.nameKey}`)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${ministry.color}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-display font-bold text-xl">{t(`ministries.${ministry.nameKey}`)}</p>
                    <p className="text-white/80 text-sm">{t(`ministries.${ministry.membersKey}`)}</p>
                  </div>
                </div>
              )}
              <div className="bg-card p-5">
                <p className="text-muted-foreground text-sm font-body leading-relaxed mb-3">{t(`ministries.${ministry.descKey}`)}</p>
                <a
                  href={`mailto:${ministry.contact}`}
                  className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors"
                >
                  {ministry.contact}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Ministries */}
        <div className="grid md:grid-cols-3 gap-6">
          {ministries.slice(3).map((ministry, i) => (
            <div
              key={ministry.nameKey}
              className={`reveal reveal-delay-${i + 1} bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-hover hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <ministry.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">{t(`ministries.${ministry.nameKey}`)}</h3>
              <p className="text-primary text-sm font-semibold font-body mb-3">{t(`ministries.${ministry.membersKey}`)}</p>
              <p className="text-muted-foreground text-sm font-body leading-relaxed mb-4">{t(`ministries.${ministry.descKey}`)}</p>
              <a
                href={`mailto:${ministry.contact}`}
                className="text-secondary text-sm font-semibold hover:text-secondary-dark transition-colors"
              >
                {ministry.contact}
              </a>
            </div>
          ))}
        </div>

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
