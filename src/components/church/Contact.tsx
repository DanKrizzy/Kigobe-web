import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

export default function Contact() {
  const { t } = useTranslation();
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof form;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSent(true);
  };

  return (
    <section id="contact" className="section-padding bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-primary font-body font-semibold text-sm tracking-widest uppercase mb-3">
            {t("contact.reachOut")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
            {t("contact.title")}
          </h2>
          <div className="w-16 h-1 gradient-primary rounded-full mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div className="reveal space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                We'd love to hear from you
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                Whether you have a question, need pastoral care, or just want to know more about our church, 
                our team is here for you. Reach out and we'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Quartier Kigobe, Avenue de la Mission\nBujumbura, Burundi",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+257 61 234 567\n+257 79 345 678",
                  color: "text-secondary",
                  bg: "bg-secondary/10",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@minervamkigobe.bi\npasteur@minervamkigobe.bi",
                  color: "text-accent-foreground",
                  bg: "bg-accent/20",
                },
                {
                  icon: Clock,
                  label: "Office Hours",
                  value: "Mon – Fri: 8:00 AM – 5:00 PM\nSaturday: 9:00 AM – 1:00 PM",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-card">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm font-body">{item.label}</p>
                    <p className="text-muted-foreground text-sm font-body whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/25761234567?text=Bonjour%20Minevam%20Kigobe%20Church!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border transition-colors group"
              style={{ backgroundColor: "hsl(141 80% 96%)", borderColor: "hsl(141 70% 80%)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "hsl(141 70% 45%)" }}>
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold font-body" style={{ color: "hsl(141 60% 25%)" }}>Chat on WhatsApp</p>
                <p className="text-sm font-body" style={{ color: "hsl(141 55% 35%)" }}>+257 61 234 567 — Usually responds in minutes</p>
              </div>
            </a>

            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden border border-border shadow-card h-56">
              <iframe
                title="Minevam Kigobe Church Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63760.57!2d29.35!3d-3.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c183d8d5f6a6b5%3A0x0!2sBujumbura%2C+Burundi!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal reveal-delay-1 bg-card rounded-3xl shadow-card border border-border p-8">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h3>

            {sent ? (
              <div className="text-center py-10">
                <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
                <h4 className="font-display text-xl font-bold text-foreground mb-2">Message Sent!</h4>
                <p className="text-muted-foreground font-body text-sm">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-5 px-5 py-2.5 rounded-full gradient-primary text-primary-foreground text-sm font-semibold"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                    Subject <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm"
                  />
                  {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5 font-body">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-input bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-body text-sm resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    {errors.message ? <p className="text-destructive text-xs">{errors.message}</p> : <span />}
                    <p className="text-muted-foreground text-xs">{form.message.length}/1000</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full gradient-primary text-primary-foreground font-semibold shadow-primary hover:shadow-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
