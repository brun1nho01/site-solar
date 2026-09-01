"use client";

import { motion, useMotionValue, useTransform, AnimatePresence, useScroll, useSpring } from "framer-motion";
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
  const scrollToSimulador = () => {
    const el = document.getElementById("simulador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Lógica dos Hotspots
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Parallax Effect — desativado em mobile para evitar overlaps
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const parallaxText = useTransform(scrollY, [0, 1000], [0, isDesktop ? 200 : 0]);
  const parallaxImage = useTransform(scrollY, [0, 1000], [0, isDesktop ? -150 : 0]);

  // Magnetic Button Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const magneticX = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { stiffness: 150, damping: 15 });
  const magneticY = useSpring(useTransform(mouseY, [-100, 100], [-15, 15]), { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* ── Coluna esquerda: Copy ── */}
          <motion.div 
            initial="hidden"
            animate="visible"
            style={{ y: parallaxText }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="text-center lg:text-left z-20 lg:-ml-8 xl:-ml-16"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-6"
            >
              Alta Tecnologia Solar
            </motion.div>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight text-balance mb-6 text-navy-950 dark:text-white"
            >
              Não alugue sua energia.{" "}
              <span className="bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-500 dark:to-gold-200 bg-clip-text text-transparent">
                Seja dono dela.
              </span>
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-lg sm:text-xl text-navy-700 dark:text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10"
            >
              Descubra o potencial de economia do seu imóvel com um projeto solar dimensionado para o seu consumo e para as condições do local.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.button
                onClick={scrollToSimulador}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ x: magneticX, y: magneticY }}
                className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-b from-[#f2cd42] to-[#c9a016] hover:from-[#fbe275] hover:to-[#dfaf18] text-navy-950 font-bold rounded-full overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(242,205,66,0.3),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-400/50"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10">Simular Economia</span>
                <ArrowDown size={20} weight="bold" className="relative z-10 group-hover:translate-y-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Coluna direita: Imagem Premium com Interatividade ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ y: parallaxImage }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center group lg:translate-x-12 xl:translate-x-24 overflow-visible"
          >
            {/* Glow effect atrás da imagem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] lg:w-[400px] h-[250px] lg:h-[400px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center drop-shadow-xl will-change-transform"
            >
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
                    aria-label={spot.title}
                    onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                      activeHotspot === spot.id 
                      ? 'border-gold-400 bg-gold-400/20' 
                      : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <span className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  </button>

                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 left-1/2 -translate-x-1/2 w-[260px] sm:w-[280px] max-w-[calc(100vw-2rem)] p-5 rounded-2xl bg-[#0a0f1c]/95 backdrop-blur-2xl border border-gold-500/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-50"
                      >
                        <button 
                          onClick={() => setActiveHotspot(null)}
                          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
