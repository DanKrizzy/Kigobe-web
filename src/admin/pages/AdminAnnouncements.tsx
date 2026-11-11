import { useState } from "react";
import { Megaphone, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton } from "@/admin/components/AdminUI";
import { useAnnouncements } from "@/admin/stores/adminDataStore";
import { logActivity } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminAnnouncements() {
  const { items, add, update, remove } = useAnnouncements();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setText("");
    setOpen(true);
  };

  const openEdit = (id: string, value: string) => {
    setEditingId(id);
    setText(value);
    setOpen(true);
  };

  const handleSave = () => {
    if (!text.trim()) {
      toast.error("Announcement text is required");
      return;
    }
    if (editingId) {
      update(editingId, { text: text.trim() });
      logActivity("updated", "announcement");
      toast.success("Announcement updated");
    } else {
      add({ text: text.trim() });
      logActivity("created", "announcement");
      toast.success("Announcement created");
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    remove(id);
    logActivity("deleted", "announcement");
    toast.success("Announcement deleted");
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Short notices shown in the events sidebar."
        actions={
          <Button onClick={openCreate} className="gradient-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add announcement
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-6 h-6" />}
          title="No announcements"
          description="Add a notice to display it on the website."
          action={<Button onClick={openCreate} className="gradient-primary">Add announcement</Button>}
        />
      ) : (
        <div className="space-y-3">
          {items.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-primary" />
                </div>
                <p className="flex-1 text-sm text-foreground">{announcement.text}</p>
                <Button variant="ghost" size="icon" onClick={() => openEdit(announcement.id, announcement.text)} aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <ConfirmDeleteButton
                  onConfirm={() => handleDelete(announcement.id)}
                  label="Delete announcement"
                  description="Remove this announcement from the website?"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit announcement" : "Add announcement"}</DialogTitle>
          </DialogHeader>
          <Field label="Announcement text">
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Create announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
