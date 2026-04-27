import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { Loader } from "./components/Loader";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";
import Documentation from "./pages/Documentation";
import FAQs from "./pages/FAQs";
import APIReference from "./pages/APIReference";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize theme immediately
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
            >
              <Loader
                duration={2500}
                onComplete={() => setLoading(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BrowserRouter>
                <ScrollToTop />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/analyze" element={<Analyze />} />
                      <Route path="/result/:username" element={<Result />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/documentation" element={<Documentation />} />
                      <Route path="/faqs" element={<FAQs />} />
                      <Route path="/api" element={<APIReference />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </AnimatePresence>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
