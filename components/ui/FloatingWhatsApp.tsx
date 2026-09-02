"use client";

import { WhatsappLogo } from "@phosphor-icons/react";
import { createWhatsAppUrl } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <a
      href={createWhatsAppUrl("Olá, gostaria de simular meu projeto solar!")}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-fade-in-up items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-transform hover:scale-110 hover:bg-green-600 active:scale-90 motion-reduce:animate-none"
      aria-label="Falar no WhatsApp"
    >
      <WhatsappLogo size={32} weight="fill" />
      
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-75 duration-1000"></span>
    </a>
  );
}
