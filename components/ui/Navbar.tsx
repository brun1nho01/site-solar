"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { List as Menu, X, CaretRight as ChevronRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "Solução", href: "#qualidade" },
  { name: "Por que nós", href: "#autoridade" },
  { name: "Processo", href: "#processo" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Barra de progresso do scroll da página
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSimularClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("simulador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Barra de Progresso de Leitura no Topo */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400 z-[100] pointer-events-none"
      />

      {/* Desktop & Mobile Header - Floating Pill Architecture */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500 ease-out flex justify-center px-4",
          isScrolled ? "top-3 sm:top-4" : "top-0"
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-500 ease-out",
            isScrolled
              ? "max-w-5xl rounded-full bg-white/80 dark:bg-navy-950/85 backdrop-blur-xl border border-navy-900/10 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.15)] px-6 py-2.5"
              : "max-w-7xl bg-white/60 dark:bg-navy-950/60 backdrop-blur-md border-b border-navy-950/5 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5"
          )}
        >
          <div className="flex items-center justify-between">

            {/* Logo */}
            <button type="button" aria-label="Voltar ao topo" className="flex-shrink-0 cursor-pointer bg-transparent border-none p-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-xl sm:text-2xl font-display font-bold text-navy-950 dark:text-white tracking-tight flex items-center gap-1">
                W<span className="text-gold-500 dark:text-gold-400">Lima</span> Soluções
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-navy-600 dark:text-text-secondary hover:text-navy-950 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <ThemeToggle />

              <MagneticButton strength={10}>
                <a
                  href="#simulador"
                  onClick={handleSimularClick}
                  className="relative inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-navy-950 bg-gradient-to-b from-[#f2cd42] to-[#c9a016] hover:from-[#fbe275] hover:to-[#dfaf18] rounded-full overflow-hidden group transition-all duration-300 shadow-[0_4px_14px_rgba(242,205,66,0.25),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-500/50"
                >
                  <span className="relative flex items-center gap-1.5">
                    Simular Economia
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              </MagneticButton>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <button
                className="relative z-[60] p-2 text-navy-950 dark:text-white rounded-full bg-navy-900/5 dark:bg-white/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Fullscreen Reveal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Menu principal mobile"
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl"
          >
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

            <nav className="flex flex-col items-center space-y-8 relative z-10 w-full px-6">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                  className="text-3xl font-display font-bold text-navy-950 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.a
                href="#simulador"
                onClick={handleSimularClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + NAV_LINKS.length * 0.08, duration: 0.4 }}
                className="mt-6 flex items-center justify-center w-full max-w-xs px-8 py-3.5 text-base font-bold text-navy-950 bg-gradient-to-b from-[#f2cd42] to-[#c9a016] hover:from-[#fbe275] hover:to-[#dfaf18] rounded-full shadow-[0_4px_14px_rgba(242,205,66,0.25),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-500/50"
              >
                Simular Economia
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
