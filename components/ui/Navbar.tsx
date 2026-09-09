"use client";

import { useEffect, useRef, useState } from "react";
import { List as Menu, X, CaretRight as ChevronRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const NAV_LINKS = [
  { name: "Solução", href: "#qualidade" },
  { name: "Por que nós", href: "#autoridade" },
  { name: "Processo", href: "#processo" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pendingMobileTargetRef = useRef<string | null>(null);
  const shouldReduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    let scrollFrame: number | null = null;

    const handleScroll = () => {
      if (scrollFrame !== null) return;
      scrollFrame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        }
        scrollFrame = null;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame !== null) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false);
    };

    desktopQuery.addEventListener("change", handleDesktopChange);
    return () => desktopQuery.removeEventListener("change", handleDesktopChange);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.getElementById(href.replace(/^#/, ""));
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  const handleSimularClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isMobileMenuOpen) {
      pendingMobileTargetRef.current = "#simulador";
      setIsMobileMenuOpen(false);
      return;
    }

    scrollToSection("#simulador");
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    pendingMobileTargetRef.current = href;
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen || !pendingMobileTargetRef.current) return;

    const target = pendingMobileTargetRef.current;
    pendingMobileTargetRef.current = null;
    let layoutObserver: ResizeObserver | null = null;
    let observerTimeout: number | undefined;
    const frame = window.requestAnimationFrame(() => {
      window.history.pushState(null, "", target);
      const element = document.getElementById(target.replace(/^#/, ""));
      if (!element) return;

      const keepTargetAligned = () => element.scrollIntoView({ behavior: "auto" });
      keepTargetAligned();

      layoutObserver = new ResizeObserver(keepTargetAligned);
      layoutObserver.observe(document.body);
      observerTimeout = window.setTimeout(() => layoutObserver?.disconnect(), 1_500);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      layoutObserver?.disconnect();
      if (observerTimeout) window.clearTimeout(observerTimeout);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    const mainContent = document.getElementById("conteudo-principal");
    const menuButton = menuButtonRef.current;
    const originalAriaHidden = mainContent?.getAttribute("aria-hidden");
    const originalInert = mainContent?.inert ?? false;

    document.body.style.overflow = "hidden";
    if (mainContent) {
      mainContent.inert = true;
      mainContent.setAttribute("aria-hidden", "true");
    }

    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const menuLinks = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [],
      );
      const focusableElements = [menuButton, ...menuLinks].filter(
        (element): element is HTMLElement => Boolean(element),
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;

      if (mainContent) {
        mainContent.inert = originalInert;
        if (originalAriaHidden == null) {
          mainContent.removeAttribute("aria-hidden");
        } else {
          mainContent.setAttribute("aria-hidden", originalAriaHidden);
        }
      }

      window.requestAnimationFrame(() => menuButton?.focus());
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Barra de Progresso de Leitura no Topo */}
      <div
        ref={progressBarRef}
        style={{ transform: "scaleX(0)", transformOrigin: "0%" }}
        className="reading-progress pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2.5px] bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400 motion-reduce:hidden"
      />

      {/* Desktop & Mobile Header - Floating Pill Architecture */}
      <header
        className={cn(
          "site-header fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-out",
          isScrolled ? "site-header--scrolled" : ""
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
            <button type="button" aria-label="W Lima Soluções — voltar ao topo" className="flex min-h-11 flex-shrink-0 cursor-pointer items-center rounded-lg bg-transparent p-1" onClick={() => window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" })}>
              <span className="text-xl sm:text-2xl font-display font-bold text-navy-950 dark:text-white tracking-tight flex items-center gap-1">
                W<span className="text-accent-copy">Lima</span> Soluções
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-1 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-950 dark:text-text-secondary dark:hover:text-white"
                >
                  {link.name}
                </a>
              ))}

              <ThemeToggle />

              <a
                href="#simulador"
                onClick={handleSimularClick}
                className="solar-cta group relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-5 py-2 text-sm font-bold text-navy-950 shadow-[0_4px_14px_rgba(242,205,66,0.25),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-500/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative flex items-center gap-1.5">
                  Simular Economia
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                ref={menuButtonRef}
                type="button"
                className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-950 dark:bg-white/5 dark:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X aria-hidden="true" className="w-5 h-5" />
                ) : (
                  <Menu aria-hidden="true" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Reveal */}
      {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="mobile-menu fixed inset-0 z-40 flex animate-fade-in items-center justify-center overflow-y-auto bg-white/95 backdrop-blur-xl dark:bg-navy-950/95"
          >
            <div aria-hidden="true" className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gold-500/10 blur-[100px]" />
            <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />

            <nav aria-label="Navegação principal" className="mobile-menu-nav relative z-10 flex w-full flex-col items-center gap-8 px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(event) => handleMobileNavClick(event, link.href)}
                  className="mobile-menu-link inline-flex min-h-11 items-center rounded-lg px-3 text-3xl font-display font-bold text-navy-950 transition-colors hover:text-accent-copy dark:text-white"
                >
                  {link.name}
                </a>
              ))}

              <a
                href="#simulador"
                onClick={handleSimularClick}
                className="mobile-menu-cta solar-cta mt-6 flex min-h-11 w-full max-w-xs items-center justify-center rounded-full px-8 py-3.5 text-base font-bold text-navy-950 shadow-[0_4px_14px_rgba(242,205,66,0.25),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-500/50"
              >
                Simular Economia
              </a>
            </nav>
          </div>
        )}
    </>
  );
}
