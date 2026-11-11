import { useState } from "react";
import { Save, FileText, Home, Info, Phone, Share2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, ImageUploader } from "@/admin/components/AdminUI";
import { useSettings } from "@/admin/stores/adminDataStore";
import type { SiteSettings } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPages() {
  const { settings, saveSettings } = useSettings();
  const [draft, setDraft] = useState<SiteSettings>(settings);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    saveSettings(draft);
    toast.success("Website content saved");
  };

  return (
    <div>
      <PageHeader
        title="Pages & Content"
        description="Edit the text and images across your website."
        actions={
          <Button onClick={handleSave} className="gradient-primary gap-1.5">
            <Save className="w-4 h-4" /> Save changes
          </Button>
        }
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" /> Hero section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Church name">
                <Input value={draft.churchName} onChange={(e) => set("churchName", e.target.value)} />
              </Field>
              <Field label="Church name accent">
                <Input value={draft.churchNameAccent} onChange={(e) => set("churchNameAccent", e.target.value)} />
              </Field>
              <Field label="Suffix">
                <Input value={draft.church} onChange={(e) => set("church", e.target.value)} />
              </Field>
            </div>
            <Field label="Badge text">
              <Input value={draft.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <Input value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Location line">
              <Input value={draft.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
            <div>
              <span className="block text-sm font-semibold text-foreground mb-1.5">Hero background image</span>
              <ImageUploader value={draft.heroImage} onChange={(heroImage) => set("heroImage", heroImage)} />
              <div className="mt-2">
                <Input
                  value={draft.heroImage.startsWith("data:") ? "" : draft.heroImage}
                  onChange={(e) => set("heroImage", e.target.value)}
                  placeholder="Image URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> About section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Paragraph 1">
              <Textarea value={draft.aboutParagraph1} onChange={(e) => set("aboutParagraph1", e.target.value)} rows={3} />
            </Field>
            <Field label="Paragraph 2">
              <Textarea value={draft.aboutParagraph2} onChange={(e) => set("aboutParagraph2", e.target.value)} rows={3} />
            </Field>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Mission">
                <Textarea value={draft.mission} onChange={(e) => set("mission", e.target.value)} rows={4} />
              </Field>
              <Field label="Vision">
                <Textarea value={draft.vision} onChange={(e) => set("vision", e.target.value)} rows={4} />
              </Field>
              <Field label="Values">
                <Textarea value={draft.values} onChange={(e) => set("values", e.target.value)} rows={4} />
              </Field>
            </div>
            <div>
              <span className="block text-sm font-semibold text-foreground mb-1.5">About image</span>
              <ImageUploader value={draft.aboutImage} onChange={(aboutImage) => set("aboutImage", aboutImage)} />
              <div className="mt-2">
                <Input
                  value={draft.aboutImage.startsWith("data:") ? "" : draft.aboutImage}
                  onChange={(e) => set("aboutImage", e.target.value)}
                  placeholder="Image URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Contact details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Address">
              <Textarea value={draft.address} onChange={(e) => set("address", e.target.value)} rows={2} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone 1">
                <Input value={draft.phone1} onChange={(e) => set("phone1", e.target.value)} />
              </Field>
              <Field label="Phone 2">
                <Input value={draft.phone2} onChange={(e) => set("phone2", e.target.value)} />
              </Field>
              <Field label="Email 1">
                <Input value={draft.email1} onChange={(e) => set("email1", e.target.value)} />
              </Field>
              <Field label="Email 2">
                <Input value={draft.email2} onChange={(e) => set("email2", e.target.value)} />
              </Field>
            </div>
            <Field label="Office hours">
              <Textarea value={draft.officeHours} onChange={(e) => set("officeHours", e.target.value)} rows={2} />
            </Field>
            <Field label="Google Maps embed URL">
              <Textarea value={draft.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} rows={2} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" /> Social links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Field label="WhatsApp number" hint="Digits only, with country code. e.g. 250783783357">
              <Input value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="Facebook URL">
              <Input value={draft.facebook} onChange={(e) => set("facebook", e.target.value)} />
            </Field>
            <Field label="Instagram URL">
              <Input value={draft.instagram} onChange={(e) => set("instagram", e.target.value)} />
            </Field>
            <Field label="YouTube URL">
              <Input value={draft.youtube} onChange={(e) => set("youtube", e.target.value)} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" /> Footer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Footer verse">
              <Textarea value={draft.footerVerse} onChange={(e) => set("footerVerse", e.target.value)} rows={2} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gradient-primary gap-1.5">
            <Save className="w-4 h-4" /> Save all changes
          </Button>
        </div>
      </div>
    </div>
  );
}
