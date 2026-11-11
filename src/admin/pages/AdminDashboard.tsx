import { Link } from "react-router-dom";
import {
  CalendarDays,
  HandCoins,
  HeartHandshake,
  Images,
  Mail,
  MessageSquare,
  Video,
  Users,
  ArrowRight,
  HardDrive,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/admin/components/AdminUI";
import {
  useActivityLog,
  useStorageStats,
} from "@/admin/stores/adminDataStore";
import { useMessages, usePrayerRequests } from "@/admin/stores/adminDataStore";
import { getDonationRecords } from "@/data/siteData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminDashboard() {
  const { collections, usedBytes } = useStorageStats();
  const messages = useMessages();
  const prayerRequests = usePrayerRequests();
  const activity = useActivityLog();
  const donations = getDonationRecords();

  const unreadMessages = messages.items.filter((m) => !m.read).length;
  const totalDonations = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const stats = [
    { label: "Sermons", value: collections.sermons, icon: Video, to: "/admin/sermons", color: "text-primary bg-primary/10" },
    { label: "Events", value: collections.events, icon: CalendarDays, to: "/admin/events", color: "text-secondary bg-secondary/10" },
    { label: "Gallery photos", value: collections.gallery, icon: Images, to: "/admin/gallery", color: "text-accent-foreground bg-accent/20" },
    { label: "Ministries", value: collections.ministries, icon: Users, to: "/admin/ministries", color: "text-primary bg-primary/10" },
    { label: "Prayer requests", value: collections.prayerRequests, icon: HeartHandshake, to: "/admin/prayer-requests", color: "text-secondary bg-secondary/10" },
    { label: "Messages", value: collections.messages, icon: MessageSquare, to: "/admin/messages", color: "text-accent-foreground bg-accent/20" },
    { label: "Subscribers", value: collections.subscribers, icon: Mail, to: "/admin/newsletter", color: "text-primary bg-primary/10" },
    { label: "Donation records", value: collections.donations, icon: HandCoins, to: "/admin/donation", color: "text-secondary bg-secondary/10" },
  ];

  const quickActions = [
    { label: "Add a sermon", to: "/admin/sermons" },
    { label: "Create an event", to: "/admin/events" },
    { label: "Upload photos", to: "/admin/gallery" },
    { label: "Edit site pages", to: "/admin/pages" },
    { label: "Manage files", to: "/admin/files" },
    { label: "Change settings", to: "/admin/settings" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of everything on your website."
        actions={
          <Button asChild className="gradient-primary">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              Open public site
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-hover hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  {action.label}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" /> Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-display font-bold text-foreground">{formatBytes(usedBytes)}</p>
              <p className="text-xs text-muted-foreground">Stored in this browser</p>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full gradient-primary"
                style={{ width: `${Math.min(100, (usedBytes / (5 * 1024 * 1024)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Browser storage is limited (~5 MB). Export a backup from Settings to keep your data safe.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Recent messages
              {unreadMessages > 0 && <Badge className="ml-1">{unreadMessages} new</Badge>}
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/messages">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {messages.items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {messages.items.slice(0, 5).map((message) => (
                  <li key={message.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {message.name} · {message.email}
                      </p>
                    </div>
                    {!message.read && <Badge variant="secondary" className="shrink-0">New</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Activity log
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/settings">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No activity recorded yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {activity.slice(0, 6).map((entry) => (
                  <li key={entry.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground">
                      <span className="font-semibold capitalize">{entry.action}</span>{" "}
                      <span className="text-muted-foreground">{entry.target}</span>
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(entry.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HandCoins className="w-4 h-4 text-primary" /> Donations overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total recorded</p>
            <p className="font-display text-xl font-bold text-foreground">
              {totalDonations.toLocaleString()} BIF
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Records</p>
            <p className="font-display text-xl font-bold text-foreground">{donations.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prayer requests</p>
            <p className="font-display text-xl font-bold text-foreground">{prayerRequests.items.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
