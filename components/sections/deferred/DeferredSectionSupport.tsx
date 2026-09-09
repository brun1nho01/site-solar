"use client";

import { useEffect, useRef, useState } from "react";

export type DeferredSectionKind = "taximeter" | "calculator" | "process" | "social" | "instagram";

export function useNearViewport(rootMargin: string, minimumRatio = 0) {
  const placeholderRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = placeholderRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setIsNearViewport(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > minimumRatio) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: minimumRatio > 0 ? minimumRatio : 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [minimumRatio, rootMargin]);

  return { placeholderRef, isNearViewport };
}

function SkeletonBar({ className }: { className: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-full bg-navy-900/5 dark:bg-white/5 ${className}`} />;
}

export function DeferredSectionPlaceholder({
  kind,
  placeholderRef,
}: {
  kind: DeferredSectionKind;
  placeholderRef?: React.Ref<HTMLElement>;
}) {
  if (kind === "taximeter") {
    return (
      <section
        ref={placeholderRef}
        className="relative z-10 min-h-[560px] overflow-hidden px-4 py-20 sm:py-24 lg:min-h-[540px]"
      >
        <div className="mx-auto max-w-5xl text-center">
          <SkeletonBar className="mx-auto h-9 w-full max-w-xl" />
          <SkeletonBar className="mx-auto mt-5 h-4 w-full max-w-lg" />
          <div className="mx-auto mt-10 min-h-64 max-w-4xl rounded-2xl bg-navy-950 p-8 text-left">
            <SkeletonBar className="h-4 w-48 bg-white/10" />
            <SkeletonBar className="mt-8 h-14 w-72 max-w-full bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (kind === "calculator") {
    return (
      <section ref={placeholderRef} aria-label="Carregando simulador" className="min-h-[720px] rounded-3xl border border-navy-900/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/[0.03] sm:p-10">
        <SkeletonBar className="mx-auto mb-5 h-9 w-4/5" />
        <SkeletonBar className="mx-auto mb-10 h-4 w-3/5" />
        <div aria-hidden="true" className="h-48 animate-pulse rounded-2xl bg-navy-900/5 dark:bg-white/5" />
      </section>
    );
  }

  const config = {
    process: {
      id: "processo",
      label: "Carregando etapas do projeto",
      className: "min-h-[900px] bg-navy-50 dark:bg-navy-950 lg:min-h-[350vh]",
    },
    social: {
      id: "autoridade",
      label: "Carregando cenários ilustrativos",
      className: "min-h-[700px] bg-slate-50 dark:bg-navy-950",
    },
    instagram: {
      id: undefined,
      label: "Carregando galeria",
      className: "min-h-[760px]",
    },
  }[kind];

  return <section ref={placeholderRef} id={config.id} aria-label={config.label} className={config.className} />;
}
