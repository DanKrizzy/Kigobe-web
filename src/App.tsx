import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import Donation from "./pages/Donation";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/admin/components/ProtectedRoute";
import AdminLayout from "@/admin/layouts/AdminLayout";
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminSermons from "@/admin/pages/AdminSermons";
import AdminVideos from "@/admin/pages/AdminVideos";
import AdminEvents from "@/admin/pages/AdminEvents";
import AdminAnnouncements from "@/admin/pages/AdminAnnouncements";
import AdminGallery from "@/admin/pages/AdminGallery";
import AdminMinistries from "@/admin/pages/AdminMinistries";
import AdminLeadership from "@/admin/pages/AdminLeadership";
import AdminDonation from "@/admin/pages/AdminDonation";
import AdminPrayerRequests from "@/admin/pages/AdminPrayerRequests";
import AdminMessages from "@/admin/pages/AdminMessages";
import AdminNewsletter from "@/admin/pages/AdminNewsletter";
import AdminPages from "@/admin/pages/AdminPages";
import AdminFiles from "@/admin/pages/AdminFiles";
import AdminSettings from "@/admin/pages/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donate" element={<Donation />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="sermons" element={<AdminSermons />} />
                <Route path="videos" element={<AdminVideos />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="ministries" element={<AdminMinistries />} />
                <Route path="leadership" element={<AdminLeadership />} />
                <Route path="donation" element={<AdminDonation />} />
                <Route path="prayer-requests" element={<AdminPrayerRequests />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="files" element={<AdminFiles />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <div className="fixed right-4 bottom-4 z-50 rounded-full bg-background/90 p-1 shadow-xl border border-border backdrop-blur-xl">
          <ThemeToggle />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
