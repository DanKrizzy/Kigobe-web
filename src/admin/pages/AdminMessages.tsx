import { useState } from "react";
import { CheckCheck, Mail, MailOpen, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/admin/components/AdminUI";
import { useMessages } from "@/admin/stores/adminDataStore";
import type { ContactMessage } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export default function AdminMessages() {
  const { items, remove, markRead } = useMessages();
  const [active, setActive] = useState<ContactMessage | null>(null);

  const openMessage = (message: ContactMessage) => {
    setActive(message);
    if (!message.read) markRead(message.id, true);
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Contact form messages sent from the website."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-6 h-6" />}
          title="No messages"
          description="Messages sent through the contact form will appear here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((message) => (
            <Card key={message.id} className={message.read ? "" : "border-primary/40"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => openMessage(message)} className="text-left flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{message.subject}</span>
                      {!message.read && <Badge>New</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.name} · {message.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </button>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markRead(message.id, !message.read)}
                      aria-label={message.read ? "Mark unread" : "Mark read"}
                    >
                      {message.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete message?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes the message from this browser.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              remove(message.id);
                              toast.success("Message deleted");
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.subject}</DialogTitle>
            <DialogDescription>
              {active?.name} · {active ? new Date(active.createdAt).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          <a href={`mailto:${active?.email}`} className="flex items-center gap-2 text-sm text-primary">
            <Mail className="w-4 h-4" /> {active?.email}
          </a>
          <p className="text-sm text-foreground whitespace-pre-wrap">{active?.message}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCheck className="w-3 h-3" /> Marked as read
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
