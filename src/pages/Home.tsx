import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  FileText,
  Gauge,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { AnalyzeForm } from "@/components/AnalyzeForm";

const heroImages = [
  "/hero-1.png",
  "/hero-2.png",
  "/hero-3.png",
];

const features = [
  {
    icon: Gauge,
    title: "Profile Score 0–100",
    desc: "Transparent scoring across popularity, activity, breadth, and quality.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    desc: "Gemini-powered summary, strengths, weaknesses, and action steps.",
  },
  {
    icon: Users,
    title: "Recruiter View",
    desc: "See exactly how recruiters perceive your profile at a glance.",
  },
  {
    icon: BarChart3,
    title: "Repo Quality Classifier",
    desc: "Each repo tagged Good, Improve, or Archive with reasoning.",
  },
  {
    icon: Award,
    title: "Gamified Badges",
    desc: "Earn achievements like Polyglot, Top Repo Builder, Elite Profile.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    desc: "Download a polished report card or share a public link.",
  },
];

const Home = () => {
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full"
            >
              <img 
                src={heroImages[imgIndex]} 
                alt="Background" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 grid-pattern opacity-30" />
        
        <div className="container relative z-20 flex h-full items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <img src="/favicon.png" alt="Logo" className="h-4 w-4 object-contain" />
              <span>AI-powered • Gemini + Groq</span>
            </div>
            <h1 className="hover-pop font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Score your <span className="text-brand">GitHub</span>
              <br />
              like a recruiter would.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-foreground/90 drop-shadow-sm">
              Get a profile score, AI feedback, repo-level analysis, and a clear improvement plan in under 2 minutes.
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <AnalyzeForm large />
              <div className="mt-4 flex justify-center gap-1.5">
                {heroImages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${i === imgIndex ? "w-8 bg-brand" : "w-2 bg-white/30"}`}
                  />
                ))}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Try{" "}
                {["KGFCH2", "DebasmitaBose0"].map((u, i) => (
                  <span key={u}>
                    {i > 0 && " · "}
                    <a href={`/result/${u}`} className="font-mono text-foreground/80 hover:text-brand-1">
                      @{u}
                    </a>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand">Why GitInsight</div>
          <h2 className="hover-pop mt-2 font-display text-3xl font-bold sm:text-4xl">Everything you need to level up</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group rounded-2xl border border-border bg-card-grad p-6 transition-all hover:-translate-y-1 hover:border-brand-1/60 hover:shadow-glow"
            >
              <div className="icon-pop mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-12">
        <div className="overflow-hidden rounded-3xl border border-border bg-card-grad p-10 text-center shadow-elev sm:p-16">
          <Target className="icon-pop mx-auto mb-4 h-10 w-10 text-brand-1" />
          <h2 className="hover-pop font-display text-3xl font-bold sm:text-4xl">
            Ready to see your score?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Free, instant, no signup required. Just your GitHub username.
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <AnalyzeForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
