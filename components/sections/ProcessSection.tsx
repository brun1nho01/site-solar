"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Calculator, MapPin, FileText, Wrench, Lightning } from "@phosphor-icons/react";
import { useRef } from "react";

const STEPS = [
  {
    title: "Estudo & Parecer de Acesso",
    description: "Engenharia de precisão com análise da sua fatura e viabilidade estrutural do telhado/solo conforme normas da ANEEL e concessionária (Enel/Light/Energisa/CEMIG).",
    icon: <Calculator weight="duotone" className="w-12 h-12 text-gold-500" />
  },
  {
    title: "Projeto Executivo (CREA)",
    description: "Emissão de ART assinada por engenheiro eletricista responsável e homologação burocrática integral na sua concessionária de energia sem você sair de casa.",
    icon: <FileText weight="duotone" className="w-12 h-12 text-gold-500" />
  },
  {
    title: "Instalação Certificada (NR-10/35)",
    description: "Equipe técnica própria habilitada para trabalho em altura e alta tensão executando a montagem com infraestrutura eletrodutada invisível em até 48h.",
    icon: <Wrench weight="duotone" className="w-12 h-12 text-gold-500" />
  },
  {
    title: "Vistoria & Relógio Bidirecional",
    description: "Acompanhamento no dia da vistoria da concessionária para verificação obrigatória de segurança e ativação oficial do novo medidor de créditos.",
    icon: <MapPin weight="duotone" className="w-12 h-12 text-gold-500" />
  },
  {
    title: "Usinagem da Conta 95% Off",
    description: "Usina ativa! O sistema injeta energia na rede, gira o relógio ao contrário e derruba até 95% do seu boleto de energia já no primeiro ciclo da fatura.",
    icon: <Lightning weight="duotone" className="w-12 h-12 text-gold-500" />
  }
];

function StepText({
  step,
  index,
  scrollYProgress,
}: {
  step: typeof STEPS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index * 0.2;
  const end = start + 0.2;
  const fadeInEnd = start + 0.05;
  const fadeOutStart = start + 0.15;

  let rangeX: number[];
  let opacityRange: number[];
  let yRange: number[];

  // Definindo todos os pontos de [0 a 1] para eliminar qualquer bug de interpolação do framer-motion
  if (index === 0) {
    rangeX = [0, fadeOutStart, end, 1];
    opacityRange = [1, 1, 0, 0];
    yRange = [0, 0, -30, -30];
  } else if (index === STEPS.length - 1) {
    rangeX = [0, start, fadeInEnd, 1];
    opacityRange = [0, 0, 1, 1];
    yRange = [30, 30, 0, 0];
  } else {
    rangeX = [0, start, fadeInEnd, fadeOutStart, end, 1];
    opacityRange = [0, 0, 1, 1, 0, 0];
    yRange = [30, 30, 0, 0, -30, -30];
  }

  const opacity = useTransform(scrollYProgress, rangeX, opacityRange);
  const y = useTransform(scrollYProgress, rangeX, yRange);

  return (
    <motion.div
      style={{ opacity, y, zIndex: 10 - index }}
      className="absolute inset-0 flex flex-col pointer-events-none"
    >
      <div className="flex items-center gap-3 mb-2 sm:mb-4">
        <span className="font-mono font-extrabold text-gold-500 text-xl sm:text-2xl">0{index + 1}.</span>
        <h3 className="text-2xl sm:text-4xl font-display font-bold text-navy-950 dark:text-white">
          {step.title}
        </h3>
      </div>
      <p className="text-navy-700 dark:text-navy-300 text-base sm:text-xl leading-relaxed max-w-lg">
        {step.description}
      </p>
    </motion.div>
  );
}

function StepIcon({
  step,
  index,
  scrollYProgress,
}: {
  step: typeof STEPS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index * 0.2;
  const end = start + 0.2;
  const fadeInEnd = start + 0.05;
  const fadeOutStart = start + 0.15;

  let rangeX: number[];
  let opacityRange: number[];
  let scaleRange: number[];

  if (index === 0) {
    rangeX = [0, fadeOutStart, end, 1];
    opacityRange = [1, 1, 0, 0];
    scaleRange = [1, 1, 1.1, 1.1];
  } else if (index === STEPS.length - 1) {
    rangeX = [0, start, fadeInEnd, 1];
    opacityRange = [0, 0, 1, 1];
    scaleRange = [0.9, 0.9, 1, 1];
  } else {
    rangeX = [0, start, fadeInEnd, fadeOutStart, end, 1];
    opacityRange = [0, 0, 1, 1, 0, 0];
    scaleRange = [0.9, 0.9, 1, 1, 1.1, 1.1];
  }

  const opacity = useTransform(scrollYProgress, rangeX, opacityRange);
  const scale = useTransform(scrollYProgress, rangeX, scaleRange);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-navy-900/10 dark:border-white/10 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_0_50px_rgba(242,205,66,0.15)]">
        {step.icon}
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} id="processo" className="relative h-[350vh] bg-navy-50 dark:bg-navy-950 transition-colors duration-500">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Background adaptativo */}
        <div className="absolute inset-0 bg-navy-50 dark:bg-navy-950 pointer-events-none transition-colors duration-500" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/8 dark:bg-gold-500/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-6 sm:gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-6 text-navy-950 dark:text-white leading-tight">
              Do Projeto à <br className="sm:hidden" /><span className="text-gold-500 dark:text-gold-400">Economia</span>
            </h2>
            
            {/* Linha de conexão / Progresso */}
            <div className="w-full h-1 bg-navy-900/10 dark:bg-white/10 rounded-full mb-6 sm:mb-10 overflow-hidden">
              <motion.div 
                className="h-full bg-gold-500 rounded-full"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>

            <div className="relative h-[160px] sm:h-[200px] w-full">
              {STEPS.map((step, index) => (
                <StepText key={`text-${index}`} step={step} index={index} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center items-center h-[200px] sm:h-[300px] lg:h-[400px]">
             <div className="relative w-full h-full max-w-[200px] sm:max-w-md">
               {STEPS.map((step, index) => (
                 <StepIcon key={`icon-${index}`} step={step} index={index} scrollYProgress={scrollYProgress} />
               ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
