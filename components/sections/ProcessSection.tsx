"use client";

import { useRef } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { Calculator, FileText, Lightning, MapPin, Wrench } from "@phosphor-icons/react";

const STEPS = [
  {
    title: "Análise de Viabilidade",
    description: "Levantamento da fatura, do perfil de consumo e das condições do telhado ou do solo para orientar o dimensionamento inicial.",
    icon: Calculator,
  },
  {
    title: "Projeto e Homologação",
    description: "Definição técnica do sistema e condução das etapas aplicáveis junto à concessionária, conforme o escopo formal da proposta.",
    icon: FileText,
  },
  {
    title: "Instalação Conforme o Projeto",
    description: "Montagem dos equipamentos e da infraestrutura conforme as condições verificadas no local e o cronograma definido para cada obra.",
    icon: Wrench,
  },
  {
    title: "Vistoria e Conexão",
    description: "Acompanhamento das etapas de vistoria, troca ou configuração do medidor e liberação, nos prazos e procedimentos da concessionária.",
    icon: MapPin,
  },
  {
    title: "Geração e Compensação",
    description: "Depois da liberação, o sistema começa a gerar energia. Créditos, economia e cobranças remanescentes variam conforme geração, consumo e regras da concessionária.",
    icon: Lightning,
  },
];

type ProcessStep = (typeof STEPS)[number];

function StepText({
  step,
  index,
  scrollYProgress,
}: {
  step: ProcessStep;
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
      className="pointer-events-none absolute inset-0 flex flex-col"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-2xl font-extrabold text-gold-500">0{index + 1}.</span>
        <h3 className="font-display text-4xl font-bold text-navy-950 dark:text-white">
          {step.title}
        </h3>
      </div>
      <p className="max-w-lg text-xl leading-relaxed text-navy-700 dark:text-navy-300">
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
  step: ProcessStep;
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
  const Icon = step.icon;

  return (
    <motion.div
      style={{ opacity, scale }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="flex h-48 w-48 items-center justify-center rounded-full border border-navy-900/10 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_0_50px_rgba(242,205,66,0.15)]">
        <Icon aria-hidden="true" weight="duotone" className="h-12 w-12 text-gold-500" />
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="processo" className="relative bg-navy-50 transition-colors duration-500 dark:bg-navy-950">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:hidden motion-reduce:!block">
        <h2 className="mb-12 font-display text-3xl font-bold leading-tight text-navy-950 dark:text-white sm:text-4xl">
          Do Projeto à <span className="text-gold-500 dark:text-gold-400">Economia</span>
        </h2>

        <ol aria-label="Etapas do projeto de energia solar" className="space-y-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <li key={step.title} className="group relative grid grid-cols-[2.75rem_1fr] gap-4 pb-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute left-[1.35rem] top-11 h-[calc(100%-2.75rem)] w-px bg-navy-900/15 group-last:hidden dark:bg-white/15"
                />
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-600 dark:text-gold-400">
                  <Icon aria-hidden="true" weight="duotone" className="h-5 w-5" />
                </div>
                <div className="pt-0.5">
                  <p className="font-mono text-xs font-bold text-gold-600 dark:text-gold-400">
                    Etapa {index + 1} de {STEPS.length}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-navy-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-navy-700 dark:text-navy-300">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div ref={containerRef} className="relative hidden h-[350vh] lg:block motion-reduce:!hidden">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy-50 transition-colors duration-500 dark:bg-navy-950" />
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gold-500/8 blur-[120px] dark:bg-gold-500/3" />

          <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-20 px-8">
            <div className="w-1/2">
              <h2 className="mb-6 font-display text-5xl font-bold leading-tight text-navy-950 dark:text-white">
                Do Projeto à <span className="text-gold-500 dark:text-gold-400">Economia</span>
              </h2>

              <div aria-hidden="true" className="mb-10 h-1 w-full overflow-hidden rounded-full bg-navy-900/10 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gold-500"
                  style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                />
              </div>

              <div className="relative h-[200px] w-full">
                {STEPS.map((step, index) => (
                  <StepText key={step.title} step={step} index={index} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>

            <div className="flex h-[400px] w-1/2 items-center justify-center">
              <div className="relative h-full w-full max-w-md">
                {STEPS.map((step, index) => (
                  <StepIcon key={step.title} step={step} index={index} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
