"use client";

import { ArrowDown, X, Lightning, Sun } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const HOTSPOTS = [
  {
    id: 1,
    top: "18%",
    left: "40%",
    Icon: Sun,
    title: "Captação (Painéis)",
    description: "Placas com tecnologia N-Type captando energia solar com máxima eficiência no telhado."
  },
  {
    id: 2,
    top: "55%",
    left: "88%",
    Icon: Lightning,
    title: "Conversão (Inversor)",
    description: "O 'cérebro' do sistema transforma a energia solar em eletricidade pronta para uso na sua casa."
  }
];

export default function HeroSection() {
  const shouldReduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const scrollToSimulador = () => {
    const el = document.getElementById("simulador");
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  // Lógica dos Hotspots
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* ── Coluna esquerda: Copy ── */}
          <div className="z-20 text-center lg:text-left">
            <div className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-6">
              Alta Tecnologia Solar
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight text-balance mb-6 text-navy-950 dark:text-white">
              Não alugue sua energia.{" "}
              <span className="text-gold-500 dark:text-gold-400">
                Seja dono dela.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-navy-700 dark:text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10">
              Descubra o potencial de economia do seu imóvel com um projeto solar dimensionado para o seu consumo e para as condições do local.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToSimulador}
                className="group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-b from-[#f2cd42] to-[#c9a016] px-8 py-4 font-bold text-navy-950 shadow-[0_10px_30px_rgba(242,205,66,0.3),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-400/50 transition-all duration-300 hover:from-[#fbe275] hover:to-[#dfaf18] focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-950"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10">Simular Economia</span>
                <ArrowDown size={20} weight="bold" className="relative z-10 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* ── Coluna direita: Imagem Premium com Interatividade ── */}
          <div className="group relative flex h-[400px] w-full items-center justify-center overflow-visible lg:h-[600px] lg:translate-x-6 xl:translate-x-12">
            {/* Glow effect atrás da imagem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className={`relative flex h-full w-full items-center justify-center drop-shadow-xl ${shouldReduceMotion ? "" : "animate-hero-float"}`}>
              <Image
                src="/images/house_solar.png"
                alt="Infográfico 3D da Anatomia do Sistema Solar"
                width={800}
                height={600}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-full object-contain object-center scale-110 lg:scale-125 xl:scale-150 select-none pointer-events-none"
              />

              
              {/* HOTSPOTS */}
              {HOTSPOTS.map((spot) => (
                <div
                  key={spot.id}
                  className={`absolute ${activeHotspot === spot.id ? "z-50" : "z-30"}`}
                  style={{ top: spot.top, left: spot.left, transform: "translate(-50%, -50%)" }}
                >
                  <button
                    type="button"
                    aria-label={spot.title}
                    aria-expanded={activeHotspot === spot.id}
                    aria-controls={`hero-hotspot-${spot.id}`}
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border bg-white/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 ${
                      activeHotspot === spot.id 
                      ? 'border-gold-400 bg-gold-400/20' 
                      : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <span className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </button>

                  {activeHotspot === spot.id && (
                      <div
                        id={`hero-hotspot-${spot.id}`}
                        role="region"
                        aria-label={spot.title}
                        className={`absolute top-14 z-50 w-[260px] max-w-[calc(100vw-2rem)] animate-fade-in rounded-2xl border border-gold-500/30 bg-[#0a0f1c]/95 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] sm:w-[280px] ${spot.id === 2 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                      >
                        <button 
                          type="button"
                          aria-label={`Fechar informações sobre ${spot.title}`}
                          onClick={() => setActiveHotspot(null)}
                          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-400"
                        >
                          <X size={18} />
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20 shadow-inner">
                            <spot.Icon size={20} weight="duotone" className="text-gold-400" />
                          </div>
                          <h4 className="text-base font-bold text-white tracking-wide">{spot.title}</h4>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {spot.description}
                        </p>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
