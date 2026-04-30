import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Users, 
  Search, 
  RefreshCw, 
  TrendingUp, 
  Star, 
  Flame, 
  Award,
  Settings,
  LogOut,
  Camera,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Crown,
  History as HistoryIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "../components/Card";
import { toast } from "sonner";
import { 
  getAmbassadors, 
  getActiveAdmin, 
  logoutAdmin, 
  updateAdminProfile,
  analyzeProfile,
  getHistory
} from "@/lib/api";

const AdminDashboard = () => {
  const [ambassadors, setAmbassadors] = useState<any[]>([]);
  const [admin, setAdmin] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const active = getActiveAdmin();
    if (!active) {
      navigate("/admin");
      return;
    }
    setAdmin(active);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setAmbassadors(getAmbassadors());
    setHistory(getHistory());
  };

  const handleFullRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In a real app, we'd fetch all again. 
      // Here we'll just simulate a refresh of the existing list to get most updated XP from localStorage
      refreshData();
      toast.success("Ambassador data synchronized");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin");
    toast.info("Logged out from terminal");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (Max 2MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadstart = () => setIsRefreshing(true);
      reader.onloadend = () => {
        setIsRefreshing(false);
        const b64 = reader.result as string;
        try {
          const updated = updateAdminProfile({ profileImage: b64 });
          if (updated) {
            setAdmin(updated);
            toast.success("Profile image updated successfully");
          }
        } catch (err) {
          toast.error("Failed to save image. It might be too large for storage.");
        }
      };
      reader.onerror = () => {
        setIsRefreshing(false);
        toast.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredAmbassadors = ambassadors
    .sort((a, b) => b.xp - a.xp)
    .filter(a => 
      a.login.toLowerCase().includes(search.toLowerCase()) || 
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Admin Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-3xl border border-border shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-brand-1/5 to-transparent pointer-events-none" />
        
        <div className="relative group">
          <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-brand-1/50 shadow-glow bg-muted flex items-center justify-center">
            {admin?.profileImage ? (
              <img src={admin.profileImage} alt="Admin" className="h-full w-full object-cover" />
            ) : (
              <ShieldCheck className="h-10 w-10 text-brand-1" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 p-2 bg-brand text-white rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform z-20"
            title="Upload Profile Image"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-3xl font-display font-black text-gradient tracking-normal">
              {admin?.username}
            </h2>
            <div className="px-2 py-0.5 rounded bg-brand/10 text-[10px] font-black text-brand-1 uppercase border border-brand/20">
              Commander-in-Chief
            </div>
          </div>
          <p className="text-muted-foreground font-mono text-xs">{admin?.usermail}</p>
          <div className="mt-2 flex items-center justify-center md:justify-start gap-4">
             <div className="flex items-center gap-1 text-xs">
               <Users className="h-3.5 w-3.5 text-brand-1" />
               <span className="font-bold">{ambassadors.length} Ambassadors</span>
             </div>
             <div className="flex items-center gap-1 text-xs">
               <TrendingUp className="h-3.5 w-3.5 text-success" />
               <span className="font-bold">Registry Active</span>
             </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-black dark:hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ambassador Progress List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-black italic flex items-center gap-2">
                <Trophy className="h-5 w-5 text-brand-1" /> AMBASSADOR PROGRESS
              </h3>
              <p className="text-xs text-muted-foreground">Track and rank contributors by XP and activity.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ambassadors..." 
                  className="pl-9 h-10 w-full md:w-64 rounded-xl glass-card border-border/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleFullRefresh} 
                disabled={isRefreshing}
                size="icon" 
                className="h-10 w-10 rounded-xl bg-brand text-white dark:text-black shadow-glow"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAmbassadors.length > 0 ? (
                filteredAmbassadors.map((a, i) => (
                  <motion.div
                    layout
                    key={a.login}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-4 rounded-2xl border border-border group hover:border-brand-1 transition-all hover:shadow-glow flex items-center gap-4"
                  >
                    <div className="flex flex-col items-center justify-center w-8">
                      <span className={`text-xl font-display font-black italic ${i < 3 ? "text-gradient" : "text-muted-foreground/30"}`}>
                        #{i + 1}
                      </span>
                      {i === 0 && <Crown className="h-3 w-3 text-warning -mt-1" />}
                      {i === 1 && <Trophy className="h-3 w-3 text-brand-1 -mt-1" />}
                      {i === 2 && <Award className="h-3 w-3 text-accent -mt-1" />}
                    </div>
                    
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-brand-1/20 group-hover:border-brand-1/50 transition-colors">
                      <img src={a.avatar} alt={a.login} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold group-hover:text-brand-1 transition-colors">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">@{a.login}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-brand-1">
                          <Sparkles className="h-3 w-3" /> {a.xp} XP
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-success">
                          <Flame className="h-3 w-3" /> {a.streak} Streak
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-warning">
                          <Award className="h-3 w-3" /> {a.badges} Badges
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate(`/result/${a.login}`)}
                      className="rounded-lg hover:bg-brand-1 hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-muted/5">
                   <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="text-muted-foreground text-sm font-medium">No ambassadors found in registry.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: Stats & Stored Searches */}
        <div className="space-y-8">
           <Card title="System Intelligence" icon={TrendingUp}>
             <div className="space-y-4 pt-2">
                <div className="p-3 rounded-xl bg-brand/5 border border-brand/10">
                   <div className="text-[10px] font-black text-brand-1 uppercase mb-1">Total Community Impact</div>
                   <div className="text-2xl font-display font-black italic">
                     {ambassadors.reduce((acc, a) => acc + a.xp, 0).toLocaleString()} <span className="text-xs italic text-muted-foreground">TOTAL XP</span>
                   </div>
                </div>
                <div className="p-3 rounded-xl bg-success/5 border border-success/10">
                   <div className="text-[10px] font-black text-success uppercase mb-1">Avg Profile Score</div>
                   <div className="text-2xl font-display font-black italic">
                     {ambassadors.length ? Math.round(ambassadors.reduce((acc, a) => acc + a.score, 0) / ambassadors.length) : 0} <span className="text-xs italic text-muted-foreground">/ 100</span>
                   </div>
                </div>
             </div>
           </Card>

           <Card 
             title="Previous Operations" 
             icon={Search}
             className="group/card"
           >
              <div className="space-y-2 mt-2">
                {history.length > 0 ? (
                  <>
                    {history.slice(0, 5).map((h, i) => (
                      <button
                        key={h.login}
                        onClick={() => navigate(`/result/${h.login}`)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                      >
                        <img src={h.avatar} className="h-8 w-8 rounded-lg" alt="" />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-xs font-bold truncate">@{h.login}</div>
                          <div className="text-[10px] text-muted-foreground italic">Score: {h.score}</div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-1" />
                      </button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/history")}
                      className="w-full mt-2 text-[10px] font-black uppercase italic tracking-wider text-brand-1 hover:bg-brand-1/10 hover:text-black dark:hover:text-white"
                    >
                      <HistoryIcon className="h-3 w-3 mr-1.5" /> Full History Console
                    </Button>
                  </>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic text-center py-4">No recent operations stored.</p>
                )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
