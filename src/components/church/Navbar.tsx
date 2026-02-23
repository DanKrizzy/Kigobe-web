import { useState, useEffect } from "react";
import { Menu, X, Cross } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

  const navLinks = [
    { label: t("nav.home"), to: "/#home" },
    { label: t("nav.about"), to: "/#about" },
    { label: t("nav.services"), to: "/#services" },
    { label: t("nav.sermons"), to: "/#sermons" },
    { label: t("nav.events"), to: "/#events" },
    { label: t("nav.ministries"), to: "/#ministries" },
    { label: t("nav.contact"), to: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 dark:bg-background/98 backdrop-blur-md shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/#home" className="flex items-center gap-2.5 group" onClick={handleLinkClick}>
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shadow-primary group-hover:scale-105 transition-transform">
              <Cross className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className={`font-display font-bold text-sm leading-none transition-colors ${scrolled ? "text-foreground" : "text-white"}`}>
                Minevam Kigobe
              </p>
              <p className={`font-body text-xs transition-colors ${scrolled ? "text-muted-foreground" : "text-white/75"}`}>
                Church • Bujumbura
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-primary ${
                  scrolled ? "text-foreground hover:bg-muted" : "text-white/90 hover:bg-white/10 dark:hover:bg-white/15"
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/donate"
              className={`ml-3 px-5 py-2 rounded-full gradient-primary text-primary-foreground font-semibold text-sm shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 ${
                scrolled ? "" : ""
              }`}
            >
              {t("nav.donate")}
            </Link>
            <Link
              to="/#prayer"
              className="ml-2 px-5 py-2 rounded-full gradient-primary text-primary-foreground font-semibold text-sm shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200"
              onClick={handleLinkClick}
            >
              {t("nav.prayerRequest")}
            </Link>
            <div className="ml-2 flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/15"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-md border-t border-border px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={handleLinkClick}
              className="block px-4 py-2.5 rounded-lg text-foreground font-medium hover:bg-muted hover:text-primary transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Link
              to="/donate"
              onClick={handleLinkClick}
              className="block text-center px-4 py-2.5 rounded-full gradient-primary text-primary-foreground font-semibold shadow-primary"
            >
              {t("nav.donate")}
            </Link>
            <Link
              to="/#prayer"
              onClick={handleLinkClick}
              className="block text-center px-4 py-2.5 rounded-full gradient-primary text-primary-foreground font-semibold shadow-primary"
            >
              {t("nav.prayerRequest")}
            </Link>
            <div className="flex items-center justify-center gap-2 pt-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
