import { useState } from "react";
import { HeartHandshake, Lock, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/admin/components/AdminUI";
import { usePrayerRequests } from "@/admin/stores/adminDataStore";
import type { PrayerRequestEntry } from "@/data/siteData";
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

export default function AdminPrayerRequests() {
  const { items, remove } = usePrayerRequests();
  const [active, setActive] = useState<PrayerRequestEntry | null>(null);

  return (
    <div>
      <PageHeader
        title="Prayer Requests"
        description="Read prayer requests submitted from the website."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake className="w-6 h-6" />}
          title="No prayer requests"
          description="Requests submitted through the prayer form will appear here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActive(request)}
                    className="text-left flex-1 min-w-0"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{request.name}</span>
                      <Badge variant="secondary">{request.prayerType || "General"}</Badge>
                      {request.isPrivate && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="w-3 h-3" /> Private
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.request}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive shrink-0" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete prayer request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the request from this browser.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            remove(request.id);
                            toast.success("Prayer request deleted");
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.name}</DialogTitle>
            <DialogDescription>
              {active?.prayerType} · {active ? new Date(active.createdAt).toLocaleString() : ""}
            </DialogDescription>
          </DialogHeader>
          {active?.email && (
            <a href={`mailto:${active.email}`} className="flex items-center gap-2 text-sm text-primary">
              <Mail className="w-4 h-4" /> {active.email}
            </a>
          )}
          <p className="text-sm text-foreground whitespace-pre-wrap">{active?.request}</p>
          {active?.isPrivate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> This request was marked private.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
