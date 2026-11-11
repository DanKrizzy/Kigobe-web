import { useState } from "react";
import { Heart, Send, CheckCircle } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { STORAGE_KEYS, generateId, getPrayerRequests, writeStore } from "@/data/siteData";

const prayerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255).or(z.literal("")),
  prayerType: z.string().min(1, "Please select a prayer type"),
  request: z.string().trim().min(10, "Please share more detail (min 10 chars)").max(1000),
  isPrivate: z.boolean(),
});

type PrayerForm = z.infer<typeof prayerSchema>;

const prayerTypeKeys = ["healing", "family", "financial", "salvation", "career", "peace", "spiritual", "other"];

export default function PrayerRequest() {
  const { t } = useTranslation();
  const ref = useReveal();
  const [form, setForm] = useState<PrayerForm>({
    name: "",
    email: "",
    prayerType: "",
    request: "",
    isPrivate: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PrayerForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = prayerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof PrayerForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const requests = getPrayerRequests();
    writeStore(STORAGE_KEYS.prayerRequests, [
      {
        id: generateId("prayer"),
        name: form.name.trim(),
        email: form.email.trim(),
        prayerType: form.prayerType,
        request: form.request.trim(),
        isPrivate: form.isPrivate,
        createdAt: new Date().toISOString(),
      },
      ...requests,
    ]);
    setSubmitted(true);
  };

  return (
    <section id="prayer" className="section-padding bg-background" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 reveal">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary">
            <Heart className="w-8 h-8 text-primary-foreground" />
          </div>
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("prayer.weStandWithYou")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("prayer.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground font-body">
            {t("prayer.subtitle")}
          </p>
        </div>

        <div className="reveal bg-card rounded-3xl shadow-card border border-border p-8 md:p-10">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">{t("prayer.received")}</h3>
              <p className="text-muted-foreground font-body mb-6">
                {t("prayer.thankYou")}
                <br /><em className="text-primary">"{t("prayer.verse")}"</em>
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", prayerType: "", request: "", isPrivate: false }); }}
                className="px-6 py-3 rounded-full gradient-primary text-primary-foreground font-semibold"
              >
                {t("prayer.submitAnother")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                    {t("prayer.yourName")} <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                    {t("prayer.emailOptional")}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jean@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                  {t("prayer.prayerCategory")} <span className="text-primary">*</span>
                </label>
                <select
                  value={form.prayerType}
                  onChange={(e) => setForm({ ...form, prayerType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                >
                  <option value="">{t("prayer.selectCategory")}</option>
                  {prayerTypeKeys.map((key) => (
                    <option key={key} value={t(`prayer.${key}`)}>{t(`prayer.${key}`)}</option>
                  ))}
                </select>
                {errors.prayerType && <p className="text-destructive text-xs mt-1">{errors.prayerType}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                  {t("prayer.yourRequest")} <span className="text-primary">*</span>
                </label>
                <textarea
                  value={form.request}
                  onChange={(e) => setForm({ ...form, request: e.target.value })}
                  rows={5}
                  placeholder="Share what is on your heart. Be as specific as you feel comfortable sharing..."
                  className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm resize-none"
                />
                <div className="flex justify-between mt-1">
                  {errors.request ? <p className="text-destructive text-xs">{errors.request}</p> : <span />}
                  <p className="text-muted-foreground text-xs">{form.request.length}/1000</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={form.isPrivate}
                  onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                  className="w-4 h-4 rounded accent-primary"
                />
                <label htmlFor="isPrivate" className="text-sm text-muted-foreground font-body cursor-pointer">
                  {t("prayer.privateLabel")}
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full gradient-primary text-primary-foreground font-semibold text-base shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t("prayer.submit")}
              </button>

              <p className="text-center text-xs text-muted-foreground font-body">
                {t("prayer.confidentiality")}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
