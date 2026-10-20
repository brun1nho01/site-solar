"use client";

import { ArrowDown, X, Lightning, Sun } from "@phosphor-icons/react";
import { useState, useRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { handleSectionLinkClick } from "@/lib/section-navigation";

const HOTSPOTS = [
  {
    id: 1,
    top: "28.5%",
    left: "43.3%",
    Icon: Sun,
    title: "Captação (Painéis)",
    description: "Placas com tecnologia N-Type captando energia solar com máxima eficiência no telhado."
  },
  {
    id: 2,
    top: "53.5%",
    left: "75.3%",
    Icon: Lightning,
    title: "Conversão (Inversor)",
    description: "O 'cérebro' do sistema transforma a energia solar em eletricidade pronta para uso na sua casa."
  }
];

export default function HeroSection() {
  const shouldReduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const scrollToAnalysis = () => {
    const el = document.getElementById("analise");
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  };

  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const activeSpot = HOTSPOTS.find((spot) => spot.id === activeHotspot);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeHotspot = () => {
    setActiveHotspot(null);
    activeTriggerRef.current?.focus({ preventScroll: true });
  };

  return (
    <section
      id="hero"
      className="hero-section relative flex items-center justify-center overflow-hidden"
    >
      <div className="hero-container safe-inline relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="hero-grid grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Coluna esquerda: Copy ── */}
          <div className="hero-copy z-20 text-center lg:text-left">
            <div className="hero-kicker text-accent-copy font-bold tracking-widest uppercase text-sm mb-6">
              Alta Tecnologia Solar
            </div>

            <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight text-balance mb-6 text-navy-950 dark:text-white">
              Não alugue sua energia.{" "}
              <span className="text-accent-copy">
                Seja dono dela.
              </span>
            </h1>

            <p className="hero-description text-lg sm:text-xl text-navy-700 dark:text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10">
              Descubra o potencial de economia do seu imóvel com um projeto solar dimensionado para o seu consumo e para as condições do local.
            </p>

            <div className="hero-actions flex flex-wrap items-center justify-center gap-x-4 gap-y-2 lg:justify-start">
              <button
                onClick={scrollToAnalysis}
                className="hero-primary-action solar-cta group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-full px-8 py-4 font-bold text-navy-950 shadow-[0_10px_30px_rgba(242,205,66,0.3),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-400/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-950"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10">Solicitar Análise</span>
                <ArrowDown size={20} weight="bold" className="relative z-10 group-hover:translate-y-1 transition-transform" />
              </button>
              <a
                href="#projetos"
                onClick={handleSectionLinkClick}
                className="inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-navy-700 underline decoration-navy-400/50 underline-offset-4 transition-colors hover:text-navy-950 dark:text-text-secondary dark:decoration-navy-500 dark:hover:text-white"
              >
                Ver instalações
              </a>
            </div>
          </div>

          {/* ── Coluna direita: Imagem Premium com Interatividade ── */}
          <div className="hero-visual group relative flex h-[400px] w-full items-center justify-center overflow-visible lg:h-[600px]">
            {/* Glow effect atrás da imagem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div
              className={`hero-scene relative aspect-square w-full max-w-[400px] drop-shadow-xl lg:max-w-[600px] ${shouldReduceMotion ? "" : "animate-hero-float"}`}
              onKeyDown={(event) => {
                if (event.key === "Escape" && activeSpot) {
                  event.preventDefault();
                  closeHotspot();
                }
              }}
            >
              <Image
                src="/images/house_solar.png"
                alt="Infográfico 3D da Anatomia do Sistema Solar"
                width={1254}
                height={1254}
                preload
                sizes="(max-width: 431px) calc(100vw - 2rem), (max-width: 1023px) 400px, (max-width: 1279px) calc(50vw - 3rem), 600px"
                className="hero-image pointer-events-none block h-auto w-full select-none object-contain"
              />


              {/* A imagem e os pontos compartilham o mesmo quadro quadrado. */}
              <div className="pointer-events-none absolute inset-0">
                {HOTSPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    className={`absolute pointer-events-auto ${activeHotspot === spot.id ? "z-50" : "z-30"}`}
                    style={{ top: spot.top, left: spot.left, transform: "translate(-50%, -50%)" }}
                  >
                    <button
                      type="button"
                      aria-label={spot.title}
                      aria-expanded={activeHotspot === spot.id}
                      aria-controls={`hero-hotspot-${spot.id}`}
                      onClick={(event) => {
                        activeTriggerRef.current = event.currentTarget;
                        setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                      }}
                      className={`relative flex h-11 w-11 items-center justify-center rounded-full border bg-white/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 ${activeHotspot === spot.id
                          ? 'border-gold-400 bg-gold-400/20'
                          : 'border-white/30 hover:border-white/60'
                        }`}
                    >
                      <span className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </button>
                  </div>
                ))}
              </div>
              {activeSpot && (
                <div
                  ref={(element) => {
                    element?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
                  }}
                  id={`hero-hotspot-${activeSpot.id}`}
                  role="region"
                  aria-label={activeSpot.title}
                  className="hero-hotspot-panel absolute inset-x-2 bottom-2 z-50 mx-auto max-h-[calc(100%-1rem)] w-[280px] max-w-[calc(100%-1rem)] scroll-mt-28 scroll-mb-6 overflow-y-auto overscroll-contain rounded-2xl border border-gold-500/30 bg-[#0a0f1c]/95 p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
                >
                  <button
                    type="button"
                    aria-label={`Fechar informações sobre ${activeSpot.title}`}
                    onClick={closeHotspot}
                    className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-gold-400"
                  >
                    <X size={18} />
                  </button>
                  <div className="mb-3 flex items-center gap-3 pr-7">
                    <div className="rounded-lg border border-gold-500/20 bg-gold-500/10 p-2 shadow-inner">
                      <activeSpot.Icon size={20} weight="duotone" className="text-gold-400" />
                    </div>
                    <h4 className="text-base font-bold tracking-wide text-white">{activeSpot.title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">
                    {activeSpot.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
