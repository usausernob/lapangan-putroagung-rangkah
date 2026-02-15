import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already logged in as admin, redirect
  if (user && isAdmin) {
    navigate("/admin", { replace: true });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Login gagal",
        description: "Email atau password salah.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // After sign in, we need to wait a moment for auth state + role check
    setTimeout(() => {
      // Re-check will happen via useAuth, but we navigate optimistically
      // The AdminDashboard page itself will redirect if not admin
      navigate("/admin", { replace: true });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/20 border border-secondary/30 mb-4">
            <Shield className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-3xl font-heading tracking-wider text-secondary">
            ADMIN PANEL
          </h1>
          <p className="text-primary-foreground/60 mt-1 text-sm">
            GOR Persebaya — Akses Khusus Administrator
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/10 backdrop-blur-xl border border-secondary/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground/80 text-sm font-medium">
                Email Admin
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gorpersebaya.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-secondary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary-foreground/80 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full gradient-gold text-secondary-foreground font-heading tracking-wider text-lg py-6 hover:opacity-90 transition-opacity"
            >
              {submitting ? "Memverifikasi..." : "MASUK"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-primary-foreground/10 text-center">
            <p className="text-primary-foreground/40 text-xs">
              Hanya akun dengan role admin yang dapat mengakses panel ini.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
