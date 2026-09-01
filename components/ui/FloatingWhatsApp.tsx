"use client";

import { motion } from "framer-motion";
import { WhatsappLogo } from "@phosphor-icons/react";
import { createWhatsAppUrl } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={createWhatsAppUrl("Olá, gostaria de simular meu projeto solar!")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Falar no WhatsApp"
    >
      <WhatsappLogo size={32} weight="fill" />
      
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-75 duration-1000"></span>
    </motion.a>
  );
}
