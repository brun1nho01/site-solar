"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HouseLine, Buildings, Plant, CheckCircle } from "@phosphor-icons/react";

const CATEGORIES = [
  { id: "all", label: "Todos os Perfis", icon: CheckCircle },
  { id: "Residencial", label: "Residencial", icon: HouseLine },
  { id: "Comercial", label: "Comercial", icon: Buildings },
  { id: "Agronegócio", label: "Agronegócio", icon: Plant },
];

const REFERENCE_SCENARIOS = [
  {
    id: 1,
    category: "Residencial",
    location: "Referência residencial",
    systemSize: "8.4 kWp",
    monthlySavings: "R$ 780,00 / mês",
    yearlySavings: "R$ 9.360,00 / ano",
    returnTime: "3,1 anos",
    highlight: "Exemplo de como consumo e potência podem ser organizados em uma análise residencial."
  },
  {
    id: 2,
    category: "Comercial",
    location: "Referência comercial",
    systemSize: "24.6 kWp",
    monthlySavings: "R$ 2.450,00 / mês",
    yearlySavings: "R$ 29.400,00 / ano",
    returnTime: "2,8 anos",
    highlight: "Exemplo de cenário para uma empresa com consumo mensal mais elevado."
  },
  {
    id: 3,
    category: "Agronegócio",
    location: "Referência rural",
    systemSize: "45.0 kWp",
    monthlySavings: "R$ 4.800,00 / mês",
    yearlySavings: "R$ 57.600,00 / ano",
    returnTime: "2,6 anos",
    highlight: "Exemplo de dimensionamento inicial para cargas típicas de uma propriedade rural."
  }
];

export default function SocialProofSection() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = activeCategory === "all"
    ? REFERENCE_SCENARIOS
    : REFERENCE_SCENARIOS.filter(p => p.category === activeCategory);

  return (
    <section id="autoridade" className="relative py-20 lg:py-28 overflow-hidden bg-slate-50 dark:bg-navy-950">
      <div className="safe-inline max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Título e Filtros (Layout Assimétrico) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold text-accent-copy uppercase tracking-widest block mb-3">
              Cenários Ilustrativos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-balance text-navy-950 dark:text-white">
              Referências para <span className="text-accent-copy">Diferentes Perfis</span>
            </h2>
            <p className="text-navy-600 dark:text-text-secondary text-base sm:text-lg">
              Exemplos de simulação para ajudar a visualizar diferenças entre projetos residenciais, comerciais e rurais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button type="button"
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`relative flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs font-bold transition-all duration-300 ${isActive
                      ? "text-navy-950 bg-gradient-to-r from-gold-400 to-amber-400 shadow-[0_0_20px_rgba(242,205,66,0.3)]"
                      : "text-subtle-copy bg-white/60 dark:bg-navy-900/50 hover:bg-white dark:hover:bg-navy-900 border border-navy-900/10 dark:border-white/10"
                    }`}
                >
                  <Icon weight="bold" className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Grid Dinâmico de Cases com Framer Motion Layout ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                key={project.id}
                className={`glass rounded-3xl p-8 flex flex-col justify-between border border-navy-900/10 dark:border-white/10 hover:border-gold-500/30 transition-all duration-300 group hover:-translate-y-1 relative bg-white/60 dark:bg-transparent ${filteredProjects.length === 1
                    ? "md:col-span-12"
                    : filteredProjects.length === 2
                      ? "md:col-span-6"
                      : index === 0 ? "md:col-span-12 lg:col-span-6" : "md:col-span-6 lg:col-span-3"
                  }`}
              >
                <div>
                  <div className="mb-5 flex min-h-14 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
                    <span className="px-3 py-1 rounded-full bg-gold-500/10 text-accent-copy text-xs font-mono font-bold border border-gold-500/20">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-subtle-copy sm:text-right lg:text-left xl:text-right">{project.location}</span>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-subtle-copy font-mono uppercase mb-1">Potência do Sistema</p>
                    <p className="font-mono font-bold text-3xl text-navy-950 dark:text-white">{project.systemSize}</p>
                  </div>

                  <p className="text-sm text-navy-600 dark:text-text-secondary leading-relaxed mb-6">
                    {project.highlight}
                  </p>
                </div>

                <div className="pt-6 border-t border-navy-900/10 dark:border-white/10 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-subtle-copy">Economia Mensal:</span>
                    <span className="font-bold text-success-copy">{project.monthlySavings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtle-copy">Economia Anual:</span>
                    <span className="font-bold text-accent-copy">{project.yearlySavings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-subtle-copy">Retorno (Payback):</span>
                    <span className="font-bold text-navy-950 dark:text-white">{project.returnTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-subtle-copy">
          Valores meramente ilustrativos. Potência, investimento, economia e prazo de retorno dependem da tarifa, do consumo, da irradiação, do local, dos equipamentos e da forma de pagamento.
        </p>

      </div>
    </section>
  );
}
