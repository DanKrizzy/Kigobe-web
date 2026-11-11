import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Rss,
  CalendarDays,
  Megaphone,
  Images,
  Users,
  HandCoins,
  HeartHandshake,
  Mail,
  MessageSquare,
  FileText,
  FolderOpen,
  Settings,
  X,
  Cross,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Sermons", to: "/admin/sermons", icon: Video },
  { label: "Video Feeds", to: "/admin/videos", icon: Rss },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
  { label: "Gallery", to: "/admin/gallery", icon: Images },
  { label: "Ministries", to: "/admin/ministries", icon: Users },
  { label: "Leadership", to: "/admin/leadership", icon: HeartHandshake },
  { label: "Donation", to: "/admin/donation", icon: HandCoins },
  { label: "Prayer Requests", to: "/admin/prayer-requests", icon: HeartHandshake },
  { label: "Messages", to: "/admin/messages", icon: MessageSquare },
  { label: "Newsletter", to: "/admin/newsletter", icon: Mail },
  { label: "Pages & Content", to: "/admin/pages", icon: FileText },
  { label: "Files", to: "/admin/files", icon: FolderOpen },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              <Cross className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold text-sm leading-none">Minevam Kigobe</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "gradient-primary text-white shadow-primary"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 text-xs text-white/40">
          Minevam Kigobe Church
          <br />
          Administration
        </div>
      </aside>
    </>
  );
}
