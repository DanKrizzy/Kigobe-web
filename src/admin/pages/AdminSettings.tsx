import { useRef, useState } from "react";
import {
  Activity,
  Download,
  KeyRound,
  RotateCcw,
  Save,
  ShieldCheck,
  Upload,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Field } from "@/admin/components/AdminUI";
import { useAdminCredentials } from "@/admin/stores/adminAuthStore";
import {
  useActivityCollection,
  exportAllContent,
  downloadJson,
  restoreDefaults,
} from "@/admin/stores/adminDataStore";
import {
  STORAGE_KEYS,
  defaultAdminCredentials,
  logActivity,
  writeStore,
} from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function AdminSettings() {
  const { credentials, updateCredentials, resetCredentials } = useAdminCredentials();
  const activity = useActivityCollection();
  const importRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(credentials.username);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSaveCredentials = () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (password && password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    updateCredentials({ username: username.trim(), password: password || credentials.password });
    logActivity("updated", "admin credentials");
    toast.success("Credentials updated");
    setPassword("");
    setConfirm("");
  };

  const handleExport = () => {
    downloadJson(`minevam-kigobe-backup-${Date.now()}.json`, exportAllContent());
    toast.success("Backup downloaded");
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Record<string, unknown>;
      let imported = 0;
      const map: Record<string, string> = {
        sermons: STORAGE_KEYS.sermons,
        events: STORAGE_KEYS.events,
        announcements: STORAGE_KEYS.announcements,
        gallery: STORAGE_KEYS.gallery,
        ministries: STORAGE_KEYS.ministries,
        leadership: STORAGE_KEYS.leadership,
        settings: STORAGE_KEYS.settings,
        donation: STORAGE_KEYS.donation,
        prayerRequests: STORAGE_KEYS.prayerRequests,
        messages: STORAGE_KEYS.messages,
        subscribers: STORAGE_KEYS.subscribers,
        donations: STORAGE_KEYS.donations,
        media: STORAGE_KEYS.media,
        videoSources: STORAGE_KEYS.videoSources,
      };
      Object.entries(map).forEach(([dataKey, storageKey]) => {
        if (dataKey in data) {
          writeStore(storageKey, data[dataKey]);
          imported += 1;
        }
      });
      logActivity("imported", `${imported} data sets`);
      toast.success("Backup restored");
    } catch {
      toast.error("Invalid backup file");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your admin account, backups and data."
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" /> Admin account
            </CardTitle>
            <CardDescription>Change the credentials used to sign in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Username">
              <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            </Field>
            <Field label="New password" hint="Leave blank to keep the current password.">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            <Field label="Confirm new password">
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
            </Field>
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveCredentials} className="gradient-primary gap-1.5">
                <Save className="w-4 h-4" /> Save credentials
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetCredentials();
                  setUsername(defaultAdminCredentials.username);
                  setPassword("");
                  setConfirm("");
                  toast.success("Credentials reset to default");
                }}
              >
                Reset to default
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Credentials are stored in this browser only.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" /> Backup & restore
            </CardTitle>
            <CardDescription>Export your content to a JSON file or restore a backup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExport} className="gap-1.5">
                <Download className="w-4 h-4" /> Export backup
              </Button>
              <input
                ref={importRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => handleImport(e.target.files?.[0])}
              />
              <Button variant="outline" onClick={() => importRef.current?.click()} className="gap-1.5">
                <Upload className="w-4 h-4" /> Import backup
              </Button>
            </div>

            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-foreground">Restore defaults</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Replace your current content with the original website content.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-1.5">
                    <RotateCcw className="w-4 h-4" /> Restore all defaults
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restore default content?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This replaces sermons, events, announcements, gallery, ministries, leadership,
                      donation settings and site content with the defaults. Messages, subscribers and
                      prayer requests are kept.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        restoreDefaults("all");
                        toast.success("Default content restored");
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Restore
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Activity log
            <Badge variant="secondary">{activity.items.length}</Badge>
          </CardTitle>
          {activity.items.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { activity.clear(); toast.success("Activity cleared"); }} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {activity.items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No activity recorded yet.</p>
          ) : (
            <ul className="divide-y divide-border max-h-80 overflow-y-auto">
              {activity.items.map((entry) => (
                <li key={entry.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="font-semibold capitalize">{entry.action}</span>{" "}
                    <span className="text-muted-foreground">{entry.target}</span>
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
