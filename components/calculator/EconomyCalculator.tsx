"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "@/components/calculator/LeadForm";
import { OdometerValue } from "@/components/ui/OdometerValue";
import MagneticButton from "@/components/ui/MagneticButton";
import { Lightning, TrendUp, Clock, CaretRight } from "@phosphor-icons/react";

export default function EconomyCalculator() {
  const [billValue, setBillValue] = useState(600);
  const [showForm, setShowForm] = useState(false);
  const formWasToggledRef = useRef(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!formWasToggledRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      if (showForm) {
        document.getElementById("lead-step-1-title")?.focus();
      } else {
        continueButtonRef.current?.focus();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [showForm]);

  const handleShowForm = () => {
    formWasToggledRef.current = true;
    setShowForm(true);
  };

  const handleHideForm = () => {
    formWasToggledRef.current = true;
    setShowForm(false);
  };

  /* ── Cálculos de Engenharia Solar (Plano Mestre) ── */
  const monthlySavings = billValue * 0.95;
  const yearlySavings = monthlySavings * 12;
  const savings25Years = yearlySavings * 25;

  // Payback estimado simples com base no tamanho estimado do sistema
  const paybackYears = (3.1 + (billValue / 5000) * 0.4).toFixed(1);

  const min = 150;
  const max = 5000;
  const percentage = ((billValue - min) / (max - min)) * 100;

  return (
    <div className="relative overflow-hidden bg-white/90 dark:bg-navy-950/80 backdrop-blur-2xl border border-navy-900/10 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10 transition-all duration-500">

      {/* Glow de fundo solar */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Cabeçalho do Configurador ── */}
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-2xl sm:text-4xl font-display font-bold text-navy-950 dark:text-white tracking-tight">
          Simule o Retorno da Sua <span className="text-gold-500 dark:text-gold-400">Energia Própria</span>
        </h2>
        <p className="text-sm sm:text-base text-navy-600 dark:text-text-secondary max-w-lg mx-auto mt-2">
          Ajuste o valor médio da sua conta de luz para visualizar uma estimativa inicial de economia.
        </p>
      </div>

      {/* ── Control Slider Input ── */}
      <div className="mb-8 relative z-10 bg-slate-50 dark:bg-navy-900/50 p-6 rounded-2xl border border-navy-900/5 dark:border-white/5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <label htmlFor="bill-slider" className="text-sm font-semibold text-navy-800 dark:text-text-secondary">
            Valor atual da sua conta de luz:
          </label>
          <OdometerValue
            value={billValue}
            prefix="R$ "
            className="text-3xl font-mono font-extrabold text-gold-500 dark:text-gold-400 tabular-nums"
            stiffness={600}
            damping={35}
          />
        </div>

        {/* Custom Range Slider */}
        <div className="relative h-4 my-6 group cursor-pointer flex items-center">
          <div className="absolute w-full h-3 bg-navy-900/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-white to-gray-200 dark:from-navy-800 dark:to-navy-950 rounded-full shadow-[0_0_25px_rgba(242,205,66,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-gold-400 flex items-center justify-center transition-transform duration-300 group-hover:scale-125 z-10 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gold-500/20 before:blur-md"
            style={{ left: `${percentage}%`, pointerEvents: 'none' }}
          >
            <div className="w-2h-2 rounded-full bg-gold-400 shadow-[0_0_10px_2px_rgba(242,205,66,0.8)]" />
          </div>

          <input
            id="bill-slider"
            name="billValue"
            type="range"
            min={min}
            max={max}
            step={50}
            value={billValue}
            onChange={(e) => setBillValue(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 z-20"
            aria-label="Valor da conta de luz mensal"
            aria-valuetext={`R$ ${billValue.toLocaleString("pt-BR")} por mês`}
            aria-describedby="bill-slider-description"
          />
        </div>

        <div className="flex justify-between text-xs font-mono text-navy-500 dark:text-text-muted">
          <span>R$ 150/mês</span>
          <span>R$ 5.000+/mês</span>
        </div>
      </div>

      {/* ── Dashboard de 3 Métricas Financeiras ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">

        {/* Métrica 1: Economia Mensal */}
        <div className="bg-slate-50 dark:bg-navy-900/40 p-6 rounded-2xl border border-navy-950/5 dark:border-white/5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-500 uppercase tracking-wider mb-2">
            <Lightning weight="fill" className="w-4 h-4" /> Economia Mensal
          </div>
          <OdometerValue
            value={monthlySavings}
            prefix="R$ "
            className="text-xl sm:text-2xl font-mono font-bold text-navy-950 dark:text-white tabular-nums tracking-tight"
          />
          <p className="text-[11px] text-navy-500 dark:text-text-muted mt-2">Cenário máximo de referência usado pelo simulador.</p>
        </div>

        {/* Métrica 2: Retorno 25 Anos */}
        <div className="bg-gradient-to-br from-gold-500/15 via-gold-500/5 to-transparent p-6 rounded-2xl border border-gold-500/30 flex flex-col justify-between relative overflow-hidden shadow-[inset_0_1px_rgba(255,255,255,0.15)] group hover:border-gold-400/60 transition-all duration-300">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-gold-500 dark:text-gold-400 uppercase tracking-wider mb-2">
            <TrendUp weight="bold" className="w-4 h-4" /> Projeção em 25 Anos
          </div>
          <OdometerValue
            value={savings25Years}
            prefix="R$ "
            className="text-2xl sm:text-3xl font-mono font-bold text-gold-500 dark:text-gold-400 tabular-nums tracking-tight tracking-tighter"
          />
          <p className="text-[11px] text-gold-600 dark:text-gold-300 font-medium mt-2">Soma ilustrativa sem substituir análise financeira.</p>
        </div>

        {/* Métrica 3: Payback Estimado */}
        <div className="bg-slate-50 dark:bg-navy-900/40 p-6 rounded-2xl border border-navy-950/5 dark:border-white/5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-2">
            <Clock weight="bold" className="w-4 h-4" /> Retorno do Investimento
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-navy-950 dark:text-white lowercase">
            ~{paybackYears} <span className="text-sm font-normal text-navy-500 dark:text-text-muted">anos</span>
          </div>
          <p className="text-[11px] text-navy-500 dark:text-text-muted mt-2">Prazo aproximado calculado para este cenário.</p>
        </div>

      </div>

      <p id="bill-slider-description" className="relative z-10 -mt-3 mb-8 text-center text-xs leading-5 text-navy-500 dark:text-text-muted">
        Estimativa ilustrativa baseada em premissas simplificadas, incluindo redução de até 95%. O resultado real depende da análise técnica, da tarifa, do consumo, da geração, dos equipamentos e da forma de pagamento; não constitui proposta ou garantia.
      </p>

      {/* ── CTA & Alternância do Formulário ── */}
      {!showForm ? (
        <MagneticButton className="w-full relative z-10">
          <button
            ref={continueButtonRef}
            type="button"
            onClick={handleShowForm}
            className="w-full py-4 px-6 rounded-2xl font-bold text-navy-950 text-base sm:text-lg bg-gradient-to-b from-[#f2cd42] to-[#c9a016] hover:from-[#fbe275] hover:to-[#dfaf18] shadow-[0_10px_30px_rgba(242,205,66,0.3),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-400/50 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continuar para a Análise Inicial</span>
            <CaretRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </MagneticButton>
      ) : (
        <div className="animate-fade-in-up relative z-10 pt-4 border-t border-navy-900/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-navy-950 dark:text-white">
              Preencha para conversar sobre o cenário de <span className="text-gold-500 font-mono">R$ {billValue.toLocaleString("pt-BR")}/mês</span>:
            </p>
            <button
              type="button"
              onClick={handleHideForm}
              className="text-sm font-medium text-navy-600 dark:text-text-secondary hover:text-gold-500 dark:hover:text-gold-400 underline underline-offset-2 cursor-pointer transition-colors whitespace-nowrap ml-4"
            >
              ← Voltar ao cálculo
            </button>
          </div>
          <LeadForm billValue={billValue} />
        </div>
      )}
    </div>
  );
}
