import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Cross, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useAdminSession } from "@/admin/stores/adminAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const { isAuthenticated, login } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const ok = login(username, password);
    setSubmitting(false);
    if (ok) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-primary mb-4">
            <Cross className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Minevam Kigobe Admin</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage your website</p>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Administrator login</CardTitle>
            <CardDescription className="text-white/60">
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/80">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    autoComplete="username"
                    required
                    className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign in
              </Button>
            </form>

            <p className="text-xs text-white/40 mt-5 text-center">
              Default credentials: <span className="text-white/70">admin / kigobe2024</span>
              <br />
              Change them from Settings after signing in.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-white/40 text-xs mt-6">
          Minevam Kigobe Church · Administration
        </p>
      </div>
    </div>
  );
}
