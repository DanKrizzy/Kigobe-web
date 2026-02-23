import heroImage from "@/assets/hero-church.jpg";
import { ChevronDown, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Minevam Kigobe Church worship service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/60 via-transparent to-transparent" />
      </div>

      {/* Floating cross decoration */}
      <div className="absolute top-1/4 right-12 w-2 h-16 bg-white/20 rounded-full hidden md:block animate-float" />
      <div className="absolute top-1/3 right-[52px] w-16 h-2 bg-white/20 rounded-full hidden md:block animate-float" style={{ animationDelay: "0.5s" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full gradient-primary animate-pulse" />
          <span className="text-white text-sm font-medium">{t("hero.badge")}</span>
        </div>

        {/* Church Name */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight animate-fade-up">
          {t("hero.churchName")}
          <span className="block text-accent"> {t("hero.churchNameAccent")}</span>
          <span className="block text-4xl md:text-5xl lg:text-6xl font-semibold text-white/90">{t("hero.church")}</span>
        </h1>

        {/* Tagline */}
        <p className="text-white/85 text-lg md:text-2xl font-body max-w-2xl mx-auto mb-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          {t("hero.tagline")}
        </p>
        <p className="text-white/65 text-sm md:text-base font-body mb-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          {t("hero.location")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/#about"
            className="px-8 py-4 rounded-full gradient-primary text-primary-foreground font-semibold text-base shadow-primary hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
          >
            {t("hero.joinUs")}
          </Link>
          <Link
            to="/#sermons"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold text-base hover:bg-white/25 hover:-translate-y-1 transition-all duration-300"
          >
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Play className="w-3 h-3 text-primary fill-primary ml-0.5" />
            </span>
            {t("hero.watchSermons")}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          {[
            { value: "20+", label: t("hero.yearsMinistry") },
            { value: "1,200+", label: t("hero.churchFamily") },
            { value: "8", label: t("hero.activeMinistries") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
              <p className="text-white/70 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <Link
        to="/#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-float"
        aria-label="Scroll down"
      >
        <ChevronDown className="w-8 h-8" />
      </Link>
    </section>
  );
}
