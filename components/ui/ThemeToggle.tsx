"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(() => false);
  const { resolvedTheme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Retrasa para a stack de microtask e evita cascading sync call
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return <div aria-hidden="true" className="h-11 w-11" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/5 transition-colors hover:bg-black/10 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-navy-900/50 dark:hover:bg-white/5 dark:focus-visible:ring-offset-navy-950"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun size={20} weight="fill" className="text-yellow-400" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -180,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon size={20} weight="fill" className="text-blue-100" />
      </motion.div>
    </button>
  );
}
