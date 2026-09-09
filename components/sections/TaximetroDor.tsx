"use client";

import { ArrowDown } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import {
  ANNUAL_RESIDENTIAL_ENERGY_COST_BRL,
  estimateResidentialEnergyCostAt,
  estimateResidentialEnergyCostPerSecond,
  RESIDENTIAL_ENERGY_REFERENCE,
} from "@/lib/residential-energy-reference";

const fullCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const rateCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactBillionsFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const referenceAnnualCost =
  compactBillionsFormatter.format(ANNUAL_RESIDENTIAL_ENERGY_COST_BRL / 1_000_000_000) +
  " bilhões";

export default function TaximetroDor() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateTime = () => {
      if (document.visibilityState === "visible") {
        setNow(new Date());
      }
    };

    const interval = window.setInterval(updateTime, 1_000);
    document.addEventListener("visibilitychange", updateTime);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateTime);
    };
  }, []);

  const accumulatedCost = useMemo(() => estimateResidentialEnergyCostAt(now), [now]);
  const costPerSecond = useMemo(
    () => estimateResidentialEnergyCostPerSecond(now.getFullYear()),
    [now],
  );
  const fullAccumulatedCost = fullCurrencyFormatter.format(accumulatedCost);
  const compactAccumulatedCost =
    compactBillionsFormatter.format(accumulatedCost / 1_000_000_000) + " bi";

  return (
    <section
      aria-labelledby="taximetro-title"
      className="safe-inline relative z-10 overflow-hidden px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="taximetro-title"
            className="font-display text-3xl font-bold tracking-tight text-navy-950 dark:text-white sm:text-4xl"
          >
            A conta de energia continua correndo.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-navy-700 dark:text-text-secondary sm:text-lg">
            Uma estimativa do gasto residencial com energia da rede, acumulado desde o início do
            ano.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl bg-navy-950 px-6 py-8 text-white shadow-2xl shadow-navy-950/20 sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-white/70">
              Estimativa nacional em {now.getFullYear()}
            </p>
            <p className="w-fit rounded-full bg-gold-400/10 px-3 py-1.5 font-mono text-xs font-semibold text-gold-300 sm:text-sm">
              {rateCurrencyFormatter.format(costPerSecond)} por segundo
            </p>
          </div>

          <div className="relative py-9 sm:py-11">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/50">
              Gasto acumulado estimado
            </p>
            <p
              role="timer"
              aria-live="off"
              aria-label={"Gasto residencial acumulado estimado: " + fullAccumulatedCost}
              className="font-mono text-4xl font-bold tracking-tight text-gold-300 tabular-nums sm:text-5xl md:text-6xl"
            >
              <span className="sm:hidden">R$ {compactAccumulatedCost}</span>
              <span className="hidden sm:inline">{fullAccumulatedCost}</span>
            </p>
          </div>

          <div className="relative border-t border-white/10 pt-6 text-sm leading-relaxed text-white/60">
            <p>
              Referência de {RESIDENTIAL_ENERGY_REFERENCE.year}:{" "}
              {RESIDENTIAL_ENERGY_REFERENCE.annualConsumptionGwh.toLocaleString("pt-BR")} GWh ×{" "}
              {rateCurrencyFormatter.format(RESIDENTIAL_ENERGY_REFERENCE.averageTariffBrlPerMwh)}
              /MWh = R$ {referenceAnnualCost} por ano.
            </p>
            <p className="mt-2">
              Fontes:{" "}
              <a
                href={RESIDENTIAL_ENERGY_REFERENCE.sources.consumption}
                target="_blank"
                rel="noreferrer"
                className="-mx-1 inline-flex min-h-11 min-w-11 items-center justify-center px-1 align-middle font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-gold-300 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              >
                EPE
              </a>{" "}
              e{" "}
              <a
                href={RESIDENTIAL_ENERGY_REFERENCE.sources.tariff}
                target="_blank"
                rel="noreferrer"
                className="-mx-1 inline-flex min-h-11 items-center px-1 align-middle font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-gold-300 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
              >
                MME/ANEEL
              </a>
              . O valor não representa desperdício nem economia garantida com energia solar.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-navy-700 dark:text-text-secondary">
            Quer estimar o que isso representa na sua realidade?
          </p>
          <a
            href="#simulador"
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-bold text-navy-950 shadow-lg shadow-gold-500/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:focus-visible:ring-offset-navy-950"
          >
            Simular com a minha conta
            <ArrowDown aria-hidden="true" weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}
