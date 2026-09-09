"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { createWhatsAppUrl } from "@/lib/site-config";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

export function FloatingWhatsApp() {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const isCompactTouchViewport = useMediaQuery(
    "(max-width: 639px), (pointer: coarse) and (max-height: 600px)",
  );

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      const frame = window.requestAnimationFrame(() => setIsHeroVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const isSuppressed = isCompactTouchViewport && isHeroVisible;

  return (
    <a
      href={createWhatsAppUrl("Olá, gostaria de simular meu projeto solar!")}
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-whatsapp group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp-action text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-110 hover:bg-whatsapp-action-hover active:scale-90 ${isHeroVisible ? "floating-whatsapp--hero" : ""}`}
      aria-label="Falar no WhatsApp"
      aria-hidden={isSuppressed}
      tabIndex={isSuppressed ? -1 : undefined}
    >
      <WhatsappLogo size={32} weight="fill" />
      
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-75 duration-1000"></span>
    </a>
  );
}
