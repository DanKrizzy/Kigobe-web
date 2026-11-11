import { useState } from "react";
import { Download, Mail, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field, EmptyState } from "@/admin/components/AdminUI";
import { useSubscribers } from "@/admin/stores/adminDataStore";
import { logActivity, type NewsletterSubscriber } from "@/data/siteData";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function exportCsv(subscribers: NewsletterSubscriber[]) {
  const header = "Name,Email,Subscribed at\n";
  const rows = subscribers
    .map((s) => `"${s.name.replace(/"/g, '""')}","${s.email}","${s.createdAt}"`)
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "newsletter-subscribers.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminNewsletter() {
  const { items, add, remove } = useSubscribers();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    add({ name: form.name.trim(), email: form.email.trim().toLowerCase(), createdAt: new Date().toISOString() } as Omit<NewsletterSubscriber, "id">);
    logActivity("created", `subscriber “${form.email}”`);
    toast.success("Subscriber added");
    setForm({ name: "", email: "" });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description="Manage people subscribed to the newsletter."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => exportCsv(items)}
              disabled={items.length === 0}
              className="gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button onClick={() => setOpen(true)} className="gradient-primary gap-1.5">
              <Plus className="w-4 h-4" /> Add subscriber
            </Button>
          </>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="No subscribers yet"
          description="People who subscribe from the website will appear here."
        />
      ) : (
        <div className="space-y-2">
          {items.map((subscriber) => (
            <Card key={subscriber.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{subscriber.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{subscriber.email}</p>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove subscriber?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove {subscriber.email} from the newsletter list?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          remove(subscriber.id);
                          toast.success("Subscriber removed");
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add subscriber</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field label="Name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} className="gradient-primary">Add subscriber</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
