import { Cross, Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("nav.home"), to: "/#home" },
    { label: t("nav.about"), to: "/#about" },
    { label: t("nav.services"), to: "/#services" },
    { label: t("nav.sermons"), to: "/#sermons" },
    { label: t("nav.events"), to: "/#events" },
    { label: t("nav.ministries"), to: "/#ministries" },
    { label: t("nav.prayerRequest"), to: "/#prayer" },
    { label: t("nav.contact"), to: "/#contact" },
  ];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/MinevamKigobe", color: "hover:text-blue-500" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/MinevamKigobe", color: "hover:text-pink-500" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@MinevamKigobe", color: "hover:text-red-500" },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/25764433144",
    color: "hover:text-green-400",
  },
];
  return (
    <footer className="bg-secondary-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
                <Cross className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white leading-none">Minevam Kigobe</p>
                <p className="text-white/60 text-xs">Church • Bujumbura</p>
              </div>
            </div>
            <p className="text-white/70 text-sm font-body leading-relaxed mb-5">
              Building Faith, Nurturing Community, Changing Lives in the heart of Burundi since 2004.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/70 ${social.color} hover:bg-white/20 transition-all`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-5">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/65 hover:text-primary text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-5">{t("footer.getInvolved")}</h4>
            <ul className="space-y-2.5">
              {quickLinks.slice(4).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/65 hover:text-primary text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/donate" className="text-white/65 hover:text-primary text-sm font-body transition-colors">
                  {t("nav.donate")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-5">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-white/70 font-body">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Quartier Kigobe, Bujumbura, Burundi
              </li>
              <li className="flex gap-3 text-sm text-white/70 font-body">
                <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                +257 61 234 567
              </li>
              <li className="flex gap-3 text-sm text-white/70 font-body">
                <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                info@minervamkigobe.bi
              </li>
            </ul>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/25764433144?text=Bonjour%21"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              {t("footer.chatWhatsApp")}
            </a>
          </div>
        </div>
      </div>

      {/* Verse Banner */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/50 text-sm font-body italic">
            "{t("footer.verse")}"
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 px-4 bg-secondary-dark/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40 font-body">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.madeBy")}</p>
        </div>
      </div>
    </footer>
  );
}
