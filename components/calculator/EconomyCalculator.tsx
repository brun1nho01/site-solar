"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { CaretRight, Clock, Lightning, TrendUp } from "@phosphor-icons/react";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  calculateSolarEstimate,
  formatCurrencyBRL,
  formatDecimalPTBR,
} from "@/lib/solar-calculator";

const LeadForm = dynamic(() => import("@/components/calculator/LeadForm"), {
  loading: () => (
    <div
      role="status"
      className="rounded-xl border border-navy-900/10 bg-navy-900/[0.03] px-4 py-5 text-center text-sm text-navy-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-text-secondary"
    >
      Preparando a análise…
    </div>
  ),
});

function formatCurrencyRange(minimum: number, maximum: number) {
  if (minimum === maximum) return `cerca de ${formatCurrencyBRL(minimum)}`;
  return `${formatCurrencyBRL(minimum)} a ${formatCurrencyBRL(maximum)}`;
}

function parseCurrencyInput(value: string) {
  const normalized = value.trim().replace(/\s|R\$/gi, "");
  if (!normalized) return null;

  const decimalValue = normalized.includes(",")
    ? normalized.replace(/\./g, "").replace(",", ".")
    : /^\d{1,3}(\.\d{3})+$/.test(normalized)
      ? normalized.replace(/\./g, "")
      : normalized;
  const parsed = Number(decimalValue);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrencyInput(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function EconomyCalculator() {
  const [billValue, setBillValue] = useState(500);
  const [billInput, setBillInput] = useState("500,00");
  const [showConsumption, setShowConsumption] = useState(false);
  const [consumptionInput, setConsumptionInput] = useState("");
  const [consumptionValue, setConsumptionValue] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const formWasToggledRef = useRef(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  const estimate = useMemo(
    () =>
      calculateSolarEstimate({
        monthlyBill: billValue,
        monthlyConsumptionKwh: consumptionValue,
      }),
    [billValue, consumptionValue],
  );

  useEffect(() => {
    if (!formWasToggledRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      if (!showForm) {
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

  const handleBillInputChange = (value: string) => {
    const sanitized = value.replace(/[^\d.,]/g, "").slice(0, 10);
    setBillInput(sanitized);

    const parsed = parseCurrencyInput(sanitized);
    if (parsed !== null && parsed >= 150 && parsed <= 3_000) {
      setBillValue(parsed);
    }
  };

  const handleBillInputBlur = () => {
    const parsed = parseCurrencyInput(billInput);
    const normalized = parsed === null ? billValue : Math.min(3_000, Math.max(150, parsed));

    setBillValue(normalized);
    setBillInput(formatCurrencyInput(normalized));
  };

  const handleSliderChange = (value: number) => {
    setBillValue(value);
    setBillInput(formatCurrencyInput(value));
  };

  const handleHideConsumption = () => {
    setShowConsumption(false);
    setConsumptionInput("");
    setConsumptionValue(null);
  };

  const handleConsumptionChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 5);
    setConsumptionInput(digits);

    const nextConsumption = Number(digits);
    setConsumptionValue(nextConsumption > 0 ? nextConsumption : null);
  };

  const min = 150;
  const max = 3000;
  const percentage = ((billValue - min) / (max - min)) * 100;
  const investmentLabel =
    estimate.investment.status === "available"
      ? formatCurrencyRange(estimate.investment.minimum, estimate.investment.maximum)
      : "Sob consulta";
  const paybackLabel =
    estimate.payback.status === "available"
      ? `${formatDecimalPTBR(estimate.payback.minimumYears)} a ${formatDecimalPTBR(estimate.payback.maximumYears)} anos`
      : estimate.payback.status === "partial"
        ? `a partir de ${formatDecimalPTBR(estimate.payback.minimumYears)} anos`
        : "A confirmar";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-navy-900/10 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-navy-950/80 sm:p-10">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-gold-500/5 blur-[80px]" />

      <div className="relative z-10 mb-7 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-navy-950 dark:text-white sm:text-4xl">
          Simule o Retorno da Sua{" "}
          <span className="text-accent-copy">Energia Própria</span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-navy-600 dark:text-text-secondary sm:text-base">
          Ajuste o valor médio da sua conta para ver uma estimativa inicial.
        </p>
      </div>

      <div className="relative z-10 rounded-2xl border border-navy-900/5 bg-slate-50 p-5 dark:border-white/5 dark:bg-navy-900/50 sm:p-7">
        <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <label htmlFor="bill-value" className="text-sm font-semibold text-navy-800 dark:text-text-secondary">
            Valor médio da conta de luz
          </label>
          <div className="flex items-baseline gap-1 border-b-2 border-gold-400 pb-1 text-accent-copy">
            <span className="font-mono text-lg font-bold" aria-hidden="true">R$</span>
            <input
              id="bill-value"
              name="billValueExact"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={billInput}
              onChange={(event) => handleBillInputChange(event.target.value)}
              onBlur={handleBillInputBlur}
              className="min-h-11 w-32 bg-transparent text-right font-mono text-3xl font-bold tabular-nums outline-none sm:w-40"
              aria-describedby="bill-slider-description"
            />
          </div>
        </div>

        <div className="group relative my-3 flex h-11 cursor-pointer items-center">
          <div className="absolute top-1/2 h-3 w-full -translate-y-1/2 overflow-hidden rounded-full bg-navy-900/10 dark:bg-white/10">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-emerald-400"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div
            className="absolute top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold-400 bg-gradient-to-br from-white to-gray-200 shadow-[0_0_25px_rgba(242,205,66,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] transition-transform duration-300 before:absolute before:inset-0 before:rounded-full before:bg-gold-500/20 before:blur-md group-hover:scale-125 dark:from-navy-800 dark:to-navy-950"
            style={{ left: `${percentage}%`, pointerEvents: "none" }}
          >
            <div className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_2px_rgba(242,205,66,0.8)]" />
          </div>

          <input
            id="bill-slider"
            name="billValue"
            type="range"
            min={min}
            max={max}
            step={0.01}
            value={billValue}
            onChange={(event) => handleSliderChange(Number(event.target.value))}
            className="absolute inset-0 z-20 m-0 h-full w-full cursor-pointer opacity-0 focus-visible:opacity-100 focus-visible:[accent-color:#f2cd42]"
            aria-label="Ajustar valor da conta de luz"
            aria-valuetext={`${formatCurrencyBRL(billValue, 2)} por mês`}
            aria-describedby="bill-slider-description"
          />
        </div>

        <div className="flex justify-between font-mono text-xs text-subtle-copy">
          <span>R$ 150/mês</span>
          <span>R$ 3.000/mês</span>
        </div>

        {!showConsumption ? (
            <button
              type="button"
              onClick={() => setShowConsumption(true)}
              aria-expanded="false"
              aria-controls="optional-consumption"
              className="mx-auto mt-4 flex min-h-11 items-center justify-center rounded-full px-3 text-xs font-semibold text-subtle-copy underline decoration-navy-400/50 underline-offset-4 transition-colors hover:text-accent-copy focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              Tenho o consumo em kWh
            </button>
        ) : (
          <div id="optional-consumption" className="mt-5 border-t border-navy-900/5 pt-5 dark:border-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label htmlFor="monthly-consumption" className="text-sm font-semibold text-navy-800 dark:text-text-secondary">
                  Consumo médio mensal
                </label>
                <p className="mt-1 text-xs text-subtle-copy">
                  Este dado melhora a precisão da estimativa.
                </p>
              </div>

              <div className="flex items-baseline justify-end gap-2 border-b-2 border-gold-400 pb-1">
                <input
                  id="monthly-consumption"
                  name="monthlyConsumptionKwh"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={consumptionInput}
                  onChange={(event) => handleConsumptionChange(event.target.value)}
                  className="min-h-11 w-28 bg-transparent text-right font-mono text-3xl font-bold tabular-nums text-accent-copy outline-none sm:w-36"
                  aria-describedby="consumption-help"
                />
                <span className="whitespace-nowrap font-mono text-xs font-bold text-subtle-copy">
                  kWh/mês
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleHideConsumption}
                aria-expanded="true"
                aria-controls="optional-consumption"
                className="min-h-11 rounded-full px-3 font-semibold text-subtle-copy underline decoration-navy-400/50 underline-offset-4 transition-colors hover:text-accent-copy focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                Usar apenas o valor da conta
              </button>
            </div>
            <p id="consumption-help" className="sr-only">
              Informe o consumo médio em quilowatt-hora mostrado na fatura.
            </p>
          </div>
        )}
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="relative z-10 mt-5 grid overflow-hidden rounded-2xl border border-navy-900/10 bg-navy-950 text-white shadow-lg dark:border-white/10 md:grid-cols-3"
      >
        <article className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
            <Lightning aria-hidden="true" weight="fill" className="h-4 w-4" />
            Economia mensal
          </div>
          <p className="font-mono text-xl font-bold tracking-tight text-white">
            {formatCurrencyRange(estimate.monthlySavings.minimum, estimate.monthlySavings.maximum)}
          </p>
        </article>

        <article className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300">
            <TrendUp aria-hidden="true" weight="bold" className="h-4 w-4" />
            Investimento estimado
          </div>
          <p className="font-mono text-xl font-bold tracking-tight text-white">
            {investmentLabel}
          </p>
        </article>

        <article className="p-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300">
            <Clock aria-hidden="true" weight="bold" className="h-4 w-4" />
            Retorno à vista
          </div>
          <p className="font-mono text-xl font-bold tracking-tight text-white">
            {paybackLabel}
          </p>
        </article>
      </div>

      <p id="bill-slider-description" className="relative z-10 mb-7 mt-4 text-center text-xs leading-5 text-subtle-copy">
        {estimate.consumption.source === "informed" ? (
          <>Consumo informado: usamos {estimate.consumption.maximumKwh.toLocaleString("pt-BR")} kWh/mês no dimensionamento.</>
        ) : (
          <>Consumo aproximado. Adicione os kWh da fatura para melhorar a precisão.</>
        )}
      </p>

      {!showForm ? (
        <MagneticButton className="relative z-10 w-full">
          <button
            ref={continueButtonRef}
            type="button"
            onClick={handleShowForm}
            className="solar-cta group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-navy-950 shadow-[0_10px_30px_rgba(242,205,66,0.3),inset_0_1px_rgba(255,255,255,0.4)] ring-1 ring-gold-400/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 dark:focus-visible:ring-offset-navy-950 sm:text-lg"
          >
            <span>Continuar para a Análise Inicial</span>
            <CaretRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </MagneticButton>
      ) : (
        <div className="relative z-10 animate-fade-in-up border-t border-navy-900/10 pt-4 dark:border-white/10">
          <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4">
            <p className="text-sm font-semibold text-navy-950 dark:text-white">
              Preencha seus dados para receber a análise deste cenário.
            </p>
            <button
              type="button"
              onClick={handleHideForm}
              className="inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-subtle-copy underline underline-offset-2 transition-colors hover:text-accent-copy focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring sm:ml-4"
            >
              ← Voltar ao cálculo
            </button>
          </div>
          <LeadForm estimate={estimate} />
        </div>
      )}
    </div>
  );
}
