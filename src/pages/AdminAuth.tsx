import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signupAdmin, loginAdmin, getActiveAdmin } from "@/lib/api";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
   useEffect(() => {
     if (getActiveAdmin()) {
       navigate("/admin/dashboard");
     }
   }, [navigate]);

  const [formData, setFormData] = useState({
    username: "",
    usermail: "",
    userpassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await loginAdmin(formData.usermail, formData.userpassword);
        toast.success("Welcome back, Commander!");
      } else {
        if (!formData.username || !formData.usermail || !formData.userpassword) {
          throw new Error("Please fill all fields");
        }
        await signupAdmin(formData);
        toast.success("Admin Profile Created Successfully");
      }
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-1/10 text-brand-1 mb-4 shadow-glow">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-black italic tracking-tight text-gradient mb-2">
            ADMIN TERMINAL
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin ? "Sign in to manage your ambassadors" : "Create your administrative credentials"}
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-border shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 h-40 w-40 bg-brand-1/5 rounded-full blur-3xl group-hover:bg-brand-1/10 transition-colors" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-black uppercase text-muted-foreground ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Admin_Alpha_1"
                      className="pl-10 h-12 rounded-xl"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@gitinsight.ai"
                  className="pl-10 h-12 rounded-xl"
                  value={formData.usermail}
                  onChange={(e) => setFormData({ ...formData, usermail: e.target.value.toLowerCase() })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 rounded-xl"
                  value={formData.userpassword}
                  onChange={(e) => setFormData({ ...formData, userpassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full h-12 rounded-xl bg-brand text-white font-black italic uppercase tracking-wider shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "System Access" : "Initialize Admin"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-brand-1 hover:underline flex items-center gap-2 mx-auto"
          >
            {isLogin ? (
              <>
                <Sparkles className="h-4 w-4" /> Need a new admin profile? Create one
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" /> Already have credentials? Sign In
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
