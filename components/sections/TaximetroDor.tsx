"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Warning, CurrencyDollar } from "@phosphor-icons/react";

export default function TaximetroDor() {
  const [mounted, setMounted] = useState(false);

  // Usaremos uma estimativa conservadora/média de R$ 250 Bilhões por ano (entre 94.2 e 471 bi)
  const gastosPorAno = 250000000000;
  const gastosPorMilissegundo = gastosPorAno / (365 * 24 * 60 * 60 * 1000);

  const taximetroValue = useSpring(0, {
    stiffness: 15,
    damping: 15,
    mass: 0.5
  });

  const displayValue = useTransform(taximetroValue, (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    const getValorExato = () => {
      const inicioDoAno = new Date(new Date().getFullYear(), 0, 1).getTime();
      return (new Date().getTime() - inicioDoAno) * gastosPorMilissegundo;
    };

    taximetroValue.set(getValorExato());
    const interval = setInterval(() => {
      taximetroValue.set(getValorExato());
    }, 300);
    return () => {
      clearInterval(interval);
      clearTimeout(t);
    };
  }, [taximetroValue, gastosPorMilissegundo]);

  if (!mounted) return (
    <section className="relative z-10 py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <div className="relative">
          <p className="relative z-10 text-red-600 dark:text-red-400 font-bold tracking-widest uppercase text-sm mb-4">
            O Custo da Inércia
          </p>
          <h2 className="relative z-10 text-2xl md:text-4xl font-display font-bold text-navy-950 dark:text-white mb-8">
            Apenas este ano, os brasileiros sem energia solar já gastaram:
          </h2>
          <div className="relative z-10 flex flex-col justify-center items-center py-10 px-6 sm:px-10 bg-white dark:bg-[#080d1a] rounded-3xl border border-red-500/10 dark:border-red-500/20 shadow-2xl shadow-red-950/20 max-w-4xl mx-auto w-full">
            <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
            <div className="mt-6 h-12 sm:h-16 w-80 sm:w-96 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section className="relative z-10 py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <div className="relative">
          
          <p className="relative z-10 text-red-600 dark:text-red-400 font-bold tracking-widest uppercase text-sm mb-4">
            O Custo da Inércia
          </p>
          
          <h2 className="relative z-10 text-2xl md:text-4xl font-display font-bold text-navy-950 dark:text-white mb-8">
            Apenas este ano, os brasileiros sem energia solar já gastaram:
          </h2>
          
          <div className="relative z-10 flex flex-col justify-center items-center py-10 px-6 sm:px-10 bg-white dark:bg-[#080d1a] rounded-3xl shadow-xl dark:shadow-[0_0_40px_rgba(239,68,68,0.15)] border border-red-500/20 shadow-2xl shadow-red-950/20 max-w-4xl mx-auto w-full group">
            <div className="absolute inset-0 bg-red-500/10 rounded-3xl blur-lg group-hover:bg-red-500/15 transition-all pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between w-full mb-6 pb-4 border-b border-white/10 text-xs font-mono">
              <span className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Medidor Nacional de Desperdício Elétrico
              </span>
              <span className="text-text-muted hidden sm:inline">Taxa: R$ 7.927,44 / seg</span>
            </div>

            <motion.div role="timer" aria-live="off" aria-label="Acumulado da fatura média em tempo real" className="font-mono text-xl min-[380px]:text-2xl sm:text-4xl md:text-5xl font-extrabold text-red-500 tracking-tight drop-shadow-[0_0_20px_rgba(239,68,68,0.35)] whitespace-nowrap tabular-nums">
              {displayValue}
            </motion.div>

            <p className="text-[11px] text-text-muted mt-6 font-mono text-center">
              * Estimativa acumulada baseada no volume de consumo elétrico residencial (Fontes: ANEEL & EPE - Empresa de Pesquisa Energética).
            </p>
          </div>
          
          <div className="relative z-10 mt-10 max-w-3xl mx-auto text-left bg-white/80 dark:bg-black/20 glass p-8 rounded-2xl border border-navy-900/10 dark:border-white/5">
            <h3 className="text-navy-900 dark:text-white font-display font-bold mb-4 text-lg md:text-xl">A dura realidade da energia no Brasil:</h3>
            <ul className="text-navy-800 dark:text-text-secondary space-y-4 text-sm md:text-base">
              <li className="flex gap-3 items-start">
                <Warning weight="duotone" className="w-6 h-6 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>As famílias brasileiras chegam a comprometer <strong>11,8% de seus gastos totais</strong> com energia — a maior proporção entre as grandes economias do mundo.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CurrencyDollar weight="duotone" className="w-6 h-6 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Uma residência comum chega a gastar até <strong>R$ 2.400 todos os anos</strong> apenas pagando contas de luz.</span>
              </li>
            </ul>
            <p className="mt-6 pt-5 border-t border-navy-100 dark:border-white/5 text-navy-950 dark:text-white font-semibold text-center text-balance">
              Em bandeiras vermelhas, impostos e reajustes absurdos. Cada segundo que você espera, seu dinheiro continua indo embora pelo ralo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
