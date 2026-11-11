import { useState } from "react";
import { Pencil, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton, ImageUploader } from "@/admin/components/AdminUI";
import { useMinistries } from "@/admin/stores/adminDataStore";
import { logActivity, type Ministry } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const iconOptions = ["Music", "Users", "Heart", "Baby", "Globe", "BookOpen"];

const blank: Omit<Ministry, "id"> = {
  name: "",
  description: "",
  members: "",
  contact: "",
  image: "",
  icon: "Users",
  color: "from-primary/80 to-accent/80",
};

export default function AdminMinistries() {
  const { items, add, update, remove } = useMinistries();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Ministry, "id">>(blank);

  const openCreate = () => {
    setEditingId(null);
    setForm(blank);
    setOpen(true);
  };

  const openEdit = (ministry: Ministry) => {
    setEditingId(ministry.id);
    const { id: _id, ...rest } = ministry;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Ministry name is required");
      return;
    }
    if (editingId) {
      update(editingId, form);
      logActivity("updated", `ministry “${form.name}”`);
      toast.success("Ministry updated");
    } else {
      add(form);
      logActivity("created", `ministry “${form.name}”`);
      toast.success("Ministry created");
    }
    setOpen(false);
  };

  const handleDelete = (ministry: Ministry) => {
    remove(ministry.id);
    logActivity("deleted", `ministry “${ministry.name}”`);
    toast.success("Ministry deleted");
  };

  return (
    <div>
      <PageHeader
        title="Ministries"
        description="Manage the ministries and groups shown on the website."
        actions={
          <Button onClick={openCreate} className="gradient-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add ministry
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6" />}
          title="No ministries yet"
          description="Add a ministry to display it on the website."
          action={<Button onClick={openCreate} className="gradient-primary">Add ministry</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((ministry) => (
            <Card key={ministry.id} className="overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                {ministry.image ? (
                  <img src={ministry.image} alt={ministry.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-foreground">{ministry.name}</h3>
                    <p className="text-xs text-primary font-semibold">{ministry.members}</p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(ministry)} aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <ConfirmDeleteButton
                      onConfirm={() => handleDelete(ministry)}
                      label="Delete ministry"
                      description={`Delete “${ministry.name}”? This cannot be undone.`}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ministry.description}</p>
                <p className="text-xs text-muted-foreground mt-2 truncate">{ministry.contact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit ministry" : "Add ministry"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="Name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Members">
                <Input value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} placeholder="45 membres" />
              </Field>
              <Field label="Contact email">
                <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="choir@example.com" />
              </Field>
            </div>
            <Field label="Icon">
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </Field>
            <ImageUploader
              label="Upload ministry image"
              value={form.image}
              onChange={(image) => setForm({ ...form, image })}
            />
            <Field label="Image URL">
              <Input
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Create ministry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
