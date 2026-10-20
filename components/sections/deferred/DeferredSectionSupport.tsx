"use client";

import { useEffect, useRef, useState } from "react";

export type DeferredSectionKind = "contact" | "process" | "instagram";

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
  if (kind === "contact") {
    return (
      <section ref={placeholderRef} data-deferred-section={kind} aria-label="Carregando formulário de atendimento" className="min-h-[760px] rounded-2xl bg-white/60 p-6 dark:bg-white/[0.03] sm:p-10">
        <SkeletonBar className="mx-auto mb-5 h-9 w-4/5" />
        <SkeletonBar className="mx-auto mb-10 h-4 w-3/5" />
        <div aria-hidden="true" className="h-48 animate-pulse rounded-2xl bg-navy-900/5 dark:bg-white/5" />
      </section>
    );
  }

  const config = {
    process: {
      id: undefined,
      label: "Carregando etapas do projeto",
      className: "min-h-[900px] bg-navy-50 dark:bg-navy-950 lg:min-h-[300vh] motion-reduce:!min-h-[900px]",
    },
    instagram: {
      id: undefined,
      label: "Carregando galeria",
      className: "min-h-[760px]",
    },
  }[kind];

  return <section ref={placeholderRef} data-deferred-section={kind} id={config.id} aria-label={config.label} className={config.className} />;
}
