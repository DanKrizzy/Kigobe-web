import { useState } from "react";
import { Play, Plus, Pencil, Video } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton, ImageUploader } from "@/admin/components/AdminUI";
import { useSermons } from "@/admin/stores/adminDataStore";
import { logActivity, type Sermon } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const blank: Omit<Sermon, "id"> = {
  title: "",
  pastor: "",
  date: "",
  series: "",
  thumbnail: "",
  description: "",
  youtubeId: "",
};

export default function AdminSermons() {
  const { items, add, update, remove } = useSermons();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Sermon, "id">>(blank);

  const openCreate = () => {
    setEditingId(null);
    setForm(blank);
    setOpen(true);
  };

  const openEdit = (sermon: Sermon) => {
    setEditingId(sermon.id);
    const { id: _id, ...rest } = sermon;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.youtubeId.trim()) {
      toast.error("Title and YouTube video ID are required");
      return;
    }
    const thumbnail =
      form.thumbnail.trim() || `https://i.ytimg.com/vi/${form.youtubeId.trim()}/hqdefault.jpg`;
    const payload = { ...form, thumbnail, title: form.title.trim() };

    if (editingId) {
      update(editingId, payload);
      logActivity("updated", `sermon “${payload.title}”`);
      toast.success("Sermon updated");
    } else {
      add(payload);
      logActivity("created", `sermon “${payload.title}”`);
      toast.success("Sermon created");
    }
    setOpen(false);
  };

  const handleDelete = (sermon: Sermon) => {
    remove(sermon.id);
    logActivity("deleted", `sermon “${sermon.title}”`);
    toast.success("Sermon deleted");
  };

  return (
    <div>
      <PageHeader
        title="Sermons"
        description="Add, edit and remove sermon videos shown on the website."
        actions={
          <Button onClick={openCreate} className="gradient-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add sermon
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Video className="w-6 h-6" />}
          title="No sermons yet"
          description="Add your first sermon video to display it on the website."
          action={<Button onClick={openCreate} className="gradient-primary">Add sermon</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((sermon) => (
            <Card key={sermon.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {sermon.thumbnail ? (
                  <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/60 text-white">
                  {sermon.series || "Sermon"}
                </span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-foreground leading-snug line-clamp-2">
                  {sermon.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {sermon.pastor} · {sermon.date}
                </p>
                <div className="flex items-center justify-end gap-1 mt-3">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(sermon)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(sermon)}
                    label="Delete sermon"
                    description={`Delete “${sermon.title}”? This cannot be undone.`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit sermon" : "Add sermon"}</DialogTitle>
            <DialogDescription>
              Paste the YouTube video ID (the part after v=) to embed the sermon.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="Title *">
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Culte du Dimanche..."
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Pastor">
                <Input
                  value={form.pastor}
                  onChange={(e) => setForm({ ...form, pastor: e.target.value })}
                  placeholder="Pasteur Pie"
                />
              </Field>
              <Field label="Date">
                <Input
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="02 Août 2026"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Series">
                <Input
                  value={form.series}
                  onChange={(e) => setForm({ ...form, series: e.target.value })}
                  placeholder="Dimanche Service"
                />
              </Field>
              <Field label="YouTube video ID *" hint="e.g. AoPhDkD4Ekw">
                <Input
                  value={form.youtubeId}
                  onChange={(e) => setForm({ ...form, youtubeId: e.target.value })}
                  placeholder="AoPhDkD4Ekw"
                />
              </Field>
            </div>

            <ImageUploader
              label="Upload thumbnail"
              value={form.thumbnail}
              onChange={(thumbnail) => setForm({ ...form, thumbnail })}
            />

            <Field label="Thumbnail URL" hint="Leave empty to use the YouTube thumbnail automatically.">
              <Input
                value={form.thumbnail.startsWith("data:") ? "" : form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://..."
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Short description of the message..."
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Create sermon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
