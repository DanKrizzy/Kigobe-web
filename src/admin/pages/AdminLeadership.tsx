import { useState } from "react";
import { HeartHandshake, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton } from "@/admin/components/AdminUI";
import { useLeadership } from "@/admin/stores/adminDataStore";
import { logActivity, type Leader } from "@/data/siteData";
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

const blank: Omit<Leader, "id"> = { name: "", role: "", initials: "" };

export default function AdminLeadership() {
  const { items, add, update, remove } = useLeadership();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Leader, "id">>(blank);

  const openCreate = () => {
    setEditingId(null);
    setForm(blank);
    setOpen(true);
  };

  const openEdit = (leader: Leader) => {
    setEditingId(leader.id);
    const { id: _id, ...rest } = leader;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const initials =
      form.initials.trim() ||
      form.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const payload = { ...form, name: form.name.trim(), initials };

    if (editingId) {
      update(editingId, payload);
      logActivity("updated", `leader “${payload.name}”`);
      toast.success("Leader updated");
    } else {
      add(payload);
      logActivity("created", `leader “${payload.name}”`);
      toast.success("Leader added");
    }
    setOpen(false);
  };

  const handleDelete = (leader: Leader) => {
    remove(leader.id);
    logActivity("deleted", `leader “${leader.name}”`);
    toast.success("Leader removed");
  };

  return (
    <div>
      <PageHeader
        title="Leadership"
        description="Manage the leadership team shown in the About section."
        actions={
          <Button onClick={openCreate} className="gradient-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add leader
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake className="w-6 h-6" />}
          title="No leaders"
          description="Add a leader to display them on the website."
          action={<Button onClick={openCreate} className="gradient-primary">Add leader</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {items.map((leader) => (
            <Card key={leader.id}>
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center text-white font-display font-bold text-xl mb-3">
                  {leader.initials}
                </div>
                <p className="font-display font-semibold text-foreground">{leader.name}</p>
                <p className="text-primary text-sm">{leader.role}</p>
                <div className="flex items-center gap-1 mt-3">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(leader)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(leader)}
                    label="Delete leader"
                    description={`Remove “${leader.name}” from leadership?`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit leader" : "Add leader"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Full name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Pasteur Principal" />
            </Field>
            <Field label="Initials" hint="Leave blank to generate automatically.">
              <Input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase() })} placeholder="AP" />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Add leader"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
