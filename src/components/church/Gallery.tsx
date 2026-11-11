import { Camera } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { useSiteGallery } from "@/hooks/useSiteContent";

export default function Gallery() {
  const { t } = useTranslation();
  const ref = useReveal();
  const photos = useSiteGallery();

  return (
    <section id="gallery" className="section-padding gradient-cool" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("gallery.churchLife")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("gallery.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </div>

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground font-body">No photos uploaded yet.</p>
        ) : (
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridTemplateRows: "auto" }}>
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "auto" : "1 / 1", minHeight: i === 0 ? "360px" : "160px" }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-display font-semibold text-sm">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instagram CTA */}
        <div className="reveal mt-8 text-center">
          <a
            href="https://instagram.com/minervamkigobe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Camera className="w-5 h-5" />
            {t("gallery.followInstagram")}
          </a>
        </div>
      </div>
    </section>
  );
}
