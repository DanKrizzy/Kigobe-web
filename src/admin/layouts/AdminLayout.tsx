import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ExternalLink, LogOut, Menu, ShieldCheck } from "lucide-react";
import AdminSidebar from "@/admin/components/AdminSidebar";
import { useAdminSession } from "@/admin/stores/adminAuthStore";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { session, logout } = useAdminSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-muted"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Signed in as</span>
              <span className="font-semibold text-foreground">{session?.username ?? "admin"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
