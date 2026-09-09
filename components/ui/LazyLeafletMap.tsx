"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LeafletMapRender = dynamic(
  () => import("@/components/ui/LeafletMapRender"),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        className="flex h-full w-full items-center justify-center bg-[#0a0f1c] px-6 text-center font-mono text-xs font-bold uppercase tracking-widest text-emerald-400/70"
      >
        Carregando mapa de projetos ativos…
      </div>
    ),
  },
);

export function LazyLeafletMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldLoad) return;

    const supportsIntersectionObserver = typeof IntersectionObserver !== "undefined";
    if (!supportsIntersectionObserver) {
      const fallbackFrame = window.requestAnimationFrame(() => setShouldLoad(true));
      return () => window.cancelAnimationFrame(fallbackFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 bg-slate-100 dark:bg-[#0a0f1c]"
      aria-label="Mapa das cidades com energia solar ativa"
    >
      {shouldLoad ? (
        <LeafletMapRender />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center font-mono text-xs font-bold uppercase tracking-widest text-success-copy">
          Mapa disponível ao se aproximar desta seção
        </div>
      )}
    </div>
  );
}
