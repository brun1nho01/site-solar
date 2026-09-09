export const RESIDENTIAL_ENERGY_REFERENCE = {
  year: 2024,
  annualConsumptionGwh: 176_628,
  averageTariffBrlPerMwh: 692.63,
  sources: {
    consumption: "https://dashboard.epe.gov.br/apps/anuario-livro/livro/pt/capitulo_3.html",
    tariff:
      "https://www.gov.br/mme/pt-br/assuntos/secretarias/secretaria-nacional-energia-eletrica/informativo-tarifario-do-setor-eletrico/informativo-tarifario-do-setor-eletrico-1o-semestre-2025.pdf",
  },
} as const;

export const ANNUAL_RESIDENTIAL_ENERGY_COST_BRL =
  RESIDENTIAL_ENERGY_REFERENCE.annualConsumptionGwh *
  1_000 *
  RESIDENTIAL_ENERGY_REFERENCE.averageTariffBrlPerMwh;

function getYearBounds(date: Date) {
  const year = date.getFullYear();

  return {
    start: new Date(year, 0, 1).getTime(),
    end: new Date(year + 1, 0, 1).getTime(),
  };
}

export function estimateResidentialEnergyCostAt(date: Date) {
  const { start, end } = getYearBounds(date);
  const progress = Math.min(Math.max((date.getTime() - start) / (end - start), 0), 1);

  return ANNUAL_RESIDENTIAL_ENERGY_COST_BRL * progress;
}

export function estimateResidentialEnergyCostPerSecond(year: number) {
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();

  return ANNUAL_RESIDENTIAL_ENERGY_COST_BRL / ((end - start) / 1_000);
}
