import { useState } from "react";
import { CalendarDays, MapPin, Pencil, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState, ConfirmDeleteButton } from "@/admin/components/AdminUI";
import { useEvents } from "@/admin/stores/adminDataStore";
import { logActivity, type ChurchEvent } from "@/data/siteData";
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

const blank: Omit<ChurchEvent, "id"> = {
  month: "",
  day: "",
  title: "",
  time: "",
  location: "",
  category: "",
  description: "",
};

const months = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];

export default function AdminEvents() {
  const { items, add, update, remove } = useEvents();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ChurchEvent, "id">>(blank);

  const openCreate = () => {
    setEditingId(null);
    setForm(blank);
    setOpen(true);
  };

  const openEdit = (event: ChurchEvent) => {
    setEditingId(event.id);
    const { id: _id, ...rest } = event;
    setForm(rest);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.month.trim() || !form.day.trim()) {
      toast.error("Title, month and day are required");
      return;
    }
    if (editingId) {
      update(editingId, form);
      logActivity("updated", `event “${form.title}”`);
      toast.success("Event updated");
    } else {
      add(form);
      logActivity("created", `event “${form.title}”`);
      toast.success("Event created");
    }
    setOpen(false);
  };

  const handleDelete = (event: ChurchEvent) => {
    remove(event.id);
    logActivity("deleted", `event “${event.title}”`);
    toast.success("Event deleted");
  };

  return (
    <div>
      <PageHeader
        title="Events"
        description="Manage the church calendar shown on the website."
        actions={
          <Button onClick={openCreate} className="gradient-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add event
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6" />}
          title="No events yet"
          description="Create your first event to show it on the website."
          action={<Button onClick={openCreate} className="gradient-primary">Add event</Button>}
        />
      ) : (
        <div className="space-y-3">
          {items.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-center gradient-primary text-primary-foreground rounded-xl px-4 py-3 shrink-0 min-w-[64px]">
                  <p className="text-xs font-bold opacity-80">{event.month}</p>
                  <p className="font-display text-2xl font-bold leading-none">{event.day}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-bold text-foreground">{event.title}</h3>
                    {event.category && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {event.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{event.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(event)} aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(event)}
                    label="Delete event"
                    description={`Delete “${event.title}”? This cannot be undone.`}
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
            <DialogTitle>{editingId ? "Edit event" : "Add event"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="Event title *">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Month *">
                <Input
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value.toUpperCase() })}
                  placeholder="MAR"
                  list="months"
                />
                <datalist id="months">
                  {months.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>
              <Field label="Day *">
                <Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="02" />
              </Field>
              <Field label="Category" className="col-span-2">
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Spiritual, Youth..."
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Time">
                <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="6:00 PM – 9:00 PM" />
              </Field>
              <Field label="Location">
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Church main hall" />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gradient-primary">
              {editingId ? "Save changes" : "Create event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
