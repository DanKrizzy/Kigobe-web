import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminSession } from "@/admin/stores/adminAuthStore";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAdminSession();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
