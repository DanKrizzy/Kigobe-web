import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  name: z.string().trim().min(1, "Name is required").max(100),
});

export default function Newsletter() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = newsletterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubscribed(true);
  };

  return (
    <section id="newsletter" className="py-16 px-4 gradient-primary">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          {t("newsletter.title")}
        </h2>
        <p className="text-white/80 font-body mb-8">
          {t("newsletter.subtitle")}
        </p>

        {subscribed ? (
          <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <CheckCircle className="w-10 h-10 text-white mx-auto mb-3" />
            <p className="text-white font-display text-xl font-bold">{t("newsletter.welcome")}</p>
            <p className="text-white/80 text-sm font-body mt-1">{t("newsletter.subscribed")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("newsletter.yourName")}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-body text-sm"
                />
                {errors.name && <p className="text-white/80 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t("newsletter.yourEmail")}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-body text-sm"
                />
                {errors.email && <p className="text-white/80 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-white text-primary font-bold hover:bg-white/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {t("newsletter.subscribe")}
            </button>
            <p className="text-white/60 text-xs mt-3 font-body">{t("newsletter.privacy")}</p>
          </form>
        )}
      </div>
    </section>
  );
}
