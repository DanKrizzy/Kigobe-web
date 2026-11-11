import { useRef, useState } from "react";
import { Images, Pencil, Plus, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton } from "@/admin/components/AdminUI";
import { useGallery, readFileAsDataUrl } from "@/admin/stores/adminDataStore";
import { logActivity, type GalleryPhoto } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminGallery() {
  const { items, add, update, remove } = useGallery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ src: string; alt: string; caption: string }>({
    src: "",
    alt: "",
    caption: "",
  });
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm({ src: "", alt: "", caption: "" });
    setOpen(true);
  };

  const openEdit = (photo: GalleryPhoto) => {
    setEditingId(photo.id);
    setForm({ src: photo.src, alt: photo.alt, caption: photo.caption });
    setOpen(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const chosen = Array.from(files);
    let success = 0;
    for (const file of chosen) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        add({
          src: dataUrl,
          alt: file.name.replace(/\.[^.]+$/, ""),
          caption: file.name.replace(/\.[^.]+$/, ""),
        });
        success += 1;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Could not upload ${file.name}`);
      }
    }
    setUploading(false);
    if (uploadRef.current) uploadRef.current.value = "";
    if (success > 0) {
      logActivity("uploaded", `${success} gallery photo${success > 1 ? "s" : ""}`);
      toast.success(`${success} photo${success > 1 ? "s" : ""} uploaded`);
    }
  };

  const handleSave = () => {
    if (!form.src) {
      toast.error("Please upload or link an image");
      return;
    }
    if (editingId) {
      update(editingId, form);
      logActivity("updated", "gallery photo");
      toast.success("Photo updated");
    } else {
      add(form);
      logActivity("created", "gallery photo");
      toast.success("Photo added");
    }
    setOpen(false);
  };

  const handleDelete = (photo: GalleryPhoto) => {
    remove(photo.id);
    logActivity("deleted", `gallery photo “${photo.caption || photo.alt}”`);
    toast.success("Photo deleted");
  };

  return (
    <div>
      <PageHeader
        title="Gallery"
        description="Upload and remove photos displayed in the gallery."
        actions={
          <>
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button
              variant="outline"
              onClick={() => uploadRef.current?.click()}
              disabled={uploading}
              className="gap-1.5"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload photos"}
            </Button>
            <Button onClick={openCreate} className="gradient-primary gap-1.5">
              <Plus className="w-4 h-4" /> Add by URL
            </Button>
          </>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Images className="w-6 h-6" />}
          title="No photos yet"
          description="Upload photos to build your church gallery."
          action={
            <Button onClick={() => uploadRef.current?.click()} className="gradient-primary gap-1.5">
              <UploadCloud className="w-4 h-4" /> Upload photos
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((photo) => (
            <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-border bg-card">
              <div className="aspect-square bg-muted">
                {photo.src ? (
                  <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground truncate">{photo.caption || photo.alt || "Untitled"}</p>
                <p className="text-xs text-muted-foreground truncate">{photo.alt}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(photo)}
                  aria-label="Edit photo"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <div className="rounded-md bg-secondary">
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(photo)}
                    label="Delete photo"
                    description="Remove this photo from the gallery?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit photo" : "Add photo"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-foreground mb-1.5">Image</span>
              <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-video flex items-center justify-center">
                {form.src ? (
                  <img src={form.src} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  id="gallery-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const dataUrl = await readFileAsDataUrl(file);
                      setForm((f) => ({ ...f, src: dataUrl }));
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Upload failed");
                    }
                  }}
                />
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="gallery-file" className="cursor-pointer gap-1.5">
                    <UploadCloud className="w-4 h-4" /> Upload image
                  </label>
                </Button>
              </div>
            </div>

            <Field label="Image URL" hint="Or paste an external image URL.">
              <Input
                value={form.src.startsWith("data:") ? "" : form.src}
                onChange={(e) => setForm({ ...form, src: e.target.value })}
                placeholder="https://..."
              />
            </Field>

            <Field label="Caption">
              <Input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Sunday Worship" />
            </Field>

            <Field label="Alt text" hint="Describes the image for accessibility.">
              <Input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} placeholder="Church choir singing" />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Add photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
