export type SolarPaymentMethod = "cash" | "financing";

export interface SolarPriceAnchor {
  generationKwhPerMonth: number;
  minimumInvestment: number;
  maximumInvestment: number;
}

export interface SolarEstimateAssumptions {
  minimumEffectiveTariff: number;
  maximumEffectiveTariff: number;
  sizingMarginRate: number;
  generationStepKwh: number;
  minimumResidualBill: number;
  maximumResidualBill: number;
  annualPanelDegradationRate: number;
  annualTariffAdjustmentRate: number;
  projectionYears: number;
  priceAnchors: readonly SolarPriceAnchor[];
}

export interface SolarEstimateInput {
  monthlyBill: number;
  monthlyConsumptionKwh?: number | null;
  paymentMethod?: SolarPaymentMethod;
  assumptions?: Partial<SolarEstimateAssumptions>;
}

export interface SolarProjectionPoint {
  year: number;
  annualSavingsMinimum: number;
  annualSavingsMaximum: number;
  cumulativeSavingsMinimum: number;
  cumulativeSavingsMaximum: number;
  balanceMinimum: number | null;
  balanceMaximum: number | null;
  balanceMidpoint: number | null;
}

export type SolarInvestmentEstimate =
  | {
      status: "available";
      minimum: number;
      maximum: number;
    }
  | {
      status: "quote-required";
      reason: "below-priced-range" | "above-priced-range";
      minimum: null;
      maximum: null;
    };

export type SolarPaybackEstimate =
  | {
      status: "available";
      minimumYears: number;
      maximumYears: number;
    }
  | {
      status: "partial";
      minimumYears: number;
      maximumYears: null;
    }
  | {
      status: "outside-horizon" | "quote-required" | "financing-proposal";
      minimumYears: null;
      maximumYears: null;
    };

export interface SolarEstimateResult {
  monthlyBill: number;
  paymentMethod: SolarPaymentMethod;
  consumption: {
    source: "informed" | "estimated";
    minimumKwh: number;
    maximumKwh: number;
  };
  targetGenerationKwh: number;
  investment: SolarInvestmentEstimate;
  residualBill: {
    minimum: number;
    maximum: number;
  };
  monthlySavings: {
    minimum: number;
    maximum: number;
  };
  annualSavingsFirstYear: {
    minimum: number;
    maximum: number;
  };
  grossSavingsAtHorizon: {
    minimum: number;
    maximum: number;
  };
  payback: SolarPaybackEstimate;
  projection: SolarProjectionPoint[];
  assumptions: SolarEstimateAssumptions;
}

export const DEFAULT_SOLAR_ASSUMPTIONS: SolarEstimateAssumptions = {
  // Faixa observada pela empresa: R$ 500 correspondem a 390-490 kWh/mês.
  minimumEffectiveTariff: 500 / 490,
  maximumEffectiveTariff: 500 / 390,
  sizingMarginRate: 0.15,
  generationStepKwh: 100,
  minimumResidualBill: 50,
  maximumResidualBill: 100,
  annualPanelDegradationRate: 0.005,
  annualTariffAdjustmentRate: 0,
  projectionYears: 25,
  priceAnchors: [
    {
      generationKwhPerMonth: 600,
      minimumInvestment: 11_000,
      maximumInvestment: 12_000,
    },
    {
      generationKwhPerMonth: 1_000,
      minimumInvestment: 15_500,
      maximumInvestment: 15_500,
    },
  ],
};

function assertFinitePositive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} deve ser um número maior que zero.`);
  }
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function estimateMonthlyBillFromConsumption(
  monthlyConsumptionKwh: number,
  assumptions: SolarEstimateAssumptions = DEFAULT_SOLAR_ASSUMPTIONS,
) {
  assertFinitePositive(monthlyConsumptionKwh, "O consumo mensal");
  assertFinitePositive(assumptions.minimumEffectiveTariff, "A tarifa mínima");
  assertFinitePositive(assumptions.maximumEffectiveTariff, "A tarifa máxima");

  const referenceTariff =
    2 /
    (1 / assumptions.minimumEffectiveTariff +
      1 / assumptions.maximumEffectiveTariff);

  return roundMoney(monthlyConsumptionKwh * referenceTariff);
}

function validateAssumptions(assumptions: SolarEstimateAssumptions) {
  assertFinitePositive(assumptions.minimumEffectiveTariff, "A tarifa mínima");
  assertFinitePositive(assumptions.maximumEffectiveTariff, "A tarifa máxima");
  assertFinitePositive(assumptions.generationStepKwh, "O intervalo de geração");

  if (assumptions.minimumEffectiveTariff > assumptions.maximumEffectiveTariff) {
    throw new RangeError("A tarifa mínima não pode superar a tarifa máxima.");
  }

  if (assumptions.sizingMarginRate < 0 || assumptions.sizingMarginRate > 1) {
    throw new RangeError("A margem de dimensionamento deve ficar entre 0 e 1.");
  }

  if (
    assumptions.annualPanelDegradationRate < 0 ||
    assumptions.annualPanelDegradationRate >= 1
  ) {
    throw new RangeError("A degradação anual deve ficar entre 0 e 1.");
  }

  if (assumptions.annualTariffAdjustmentRate <= -1) {
    throw new RangeError("O reajuste tarifário anual deve ser maior que -1.");
  }

  if (!Number.isInteger(assumptions.projectionYears) || assumptions.projectionYears < 1) {
    throw new RangeError("O horizonte da projeção deve ser um número inteiro positivo.");
  }

  if (assumptions.minimumResidualBill < 0 || assumptions.maximumResidualBill < 0) {
    throw new RangeError("A conta residual não pode ser negativa.");
  }

  if (assumptions.minimumResidualBill > assumptions.maximumResidualBill) {
    throw new RangeError("A conta residual mínima não pode superar a máxima.");
  }

  if (assumptions.priceAnchors.length < 2) {
    throw new RangeError("Informe ao menos dois pontos de preço.");
  }

  assumptions.priceAnchors.forEach((anchor, index) => {
    assertFinitePositive(anchor.generationKwhPerMonth, `A geração do ponto ${index + 1}`);
    assertFinitePositive(anchor.minimumInvestment, `O investimento mínimo do ponto ${index + 1}`);
    assertFinitePositive(anchor.maximumInvestment, `O investimento máximo do ponto ${index + 1}`);

    if (anchor.minimumInvestment > anchor.maximumInvestment) {
      throw new RangeError(`O investimento mínimo do ponto ${index + 1} supera o máximo.`);
    }

    const previousAnchor = assumptions.priceAnchors[index - 1];
    if (
      previousAnchor &&
      anchor.generationKwhPerMonth <= previousAnchor.generationKwhPerMonth
    ) {
      throw new RangeError("Os pontos de preço devem estar em ordem crescente de geração.");
    }
  });
}

export function estimateInvestmentForGeneration(
  generationKwhPerMonth: number,
  priceAnchors: readonly SolarPriceAnchor[] = DEFAULT_SOLAR_ASSUMPTIONS.priceAnchors,
): SolarInvestmentEstimate {
  assertFinitePositive(generationKwhPerMonth, "A geração mensal");

  const firstAnchor = priceAnchors[0];
  const lastAnchor = priceAnchors[priceAnchors.length - 1];

  if (!firstAnchor || !lastAnchor) {
    throw new RangeError("Informe pontos de preço para calcular o investimento.");
  }

  if (generationKwhPerMonth < firstAnchor.generationKwhPerMonth) {
    return {
      status: "quote-required",
      reason: "below-priced-range",
      minimum: null,
      maximum: null,
    };
  }

  if (generationKwhPerMonth > lastAnchor.generationKwhPerMonth) {
    return {
      status: "quote-required",
      reason: "above-priced-range",
      minimum: null,
      maximum: null,
    };
  }

  const rightIndex = priceAnchors.findIndex(
    (anchor) => anchor.generationKwhPerMonth >= generationKwhPerMonth,
  );
  const rightAnchor = priceAnchors[rightIndex];

  if (!rightAnchor) {
    throw new RangeError("Não foi possível localizar a faixa de preço.");
  }

  if (rightAnchor.generationKwhPerMonth === generationKwhPerMonth || rightIndex === 0) {
    return {
      status: "available",
      minimum: rightAnchor.minimumInvestment,
      maximum: rightAnchor.maximumInvestment,
    };
  }

  const leftAnchor = priceAnchors[rightIndex - 1];
  const interval = rightAnchor.generationKwhPerMonth - leftAnchor.generationKwhPerMonth;
  const position = (generationKwhPerMonth - leftAnchor.generationKwhPerMonth) / interval;

  return {
    status: "available",
    minimum: roundMoney(
      leftAnchor.minimumInvestment +
        (rightAnchor.minimumInvestment - leftAnchor.minimumInvestment) * position,
    ),
    maximum: roundMoney(
      leftAnchor.maximumInvestment +
        (rightAnchor.maximumInvestment - leftAnchor.maximumInvestment) * position,
    ),
  };
}

function calculatePaybackYears(
  investment: number,
  firstYearSavings: number,
  assumptions: SolarEstimateAssumptions,
) {
  if (firstYearSavings <= 0) return null;

  let remainingInvestment = investment;

  for (let year = 1; year <= assumptions.projectionYears; year += 1) {
    const elapsedYears = year - 1;
    const tariffFactor = Math.pow(1 + assumptions.annualTariffAdjustmentRate, elapsedYears);
    const generationFactor = Math.pow(
      1 - assumptions.annualPanelDegradationRate,
      elapsedYears,
    );
    const savingsThisYear = firstYearSavings * tariffFactor * generationFactor;

    if (remainingInvestment <= savingsThisYear) {
      return roundMoney(elapsedYears + remainingInvestment / savingsThisYear);
    }

    remainingInvestment -= savingsThisYear;
  }

  return null;
}

export function calculateSolarEstimate(input: SolarEstimateInput): SolarEstimateResult {
  assertFinitePositive(input.monthlyBill, "O valor mensal da conta");

  if (input.monthlyConsumptionKwh !== undefined && input.monthlyConsumptionKwh !== null) {
    assertFinitePositive(input.monthlyConsumptionKwh, "O consumo mensal");
  }

  const assumptions: SolarEstimateAssumptions = {
    ...DEFAULT_SOLAR_ASSUMPTIONS,
    ...input.assumptions,
  };
  validateAssumptions(assumptions);

  const informedConsumption = input.monthlyConsumptionKwh ?? null;
  const consumption = informedConsumption
    ? {
        source: "informed" as const,
        minimumKwh: Math.round(informedConsumption),
        maximumKwh: Math.round(informedConsumption),
      }
    : {
        source: "estimated" as const,
        minimumKwh: Math.round(input.monthlyBill / assumptions.maximumEffectiveTariff),
        maximumKwh: Math.round(input.monthlyBill / assumptions.minimumEffectiveTariff),
      };

  const targetGenerationKwh =
    Math.ceil(
      (consumption.maximumKwh * (1 + assumptions.sizingMarginRate)) /
        assumptions.generationStepKwh,
    ) * assumptions.generationStepKwh;
  const investment = estimateInvestmentForGeneration(
    targetGenerationKwh,
    assumptions.priceAnchors,
  );
  const paymentMethod = input.paymentMethod ?? "cash";

  const residualBill = {
    minimum: roundMoney(Math.min(input.monthlyBill, assumptions.minimumResidualBill)),
    maximum: roundMoney(Math.min(input.monthlyBill, assumptions.maximumResidualBill)),
  };
  const monthlySavings = {
    minimum: roundMoney(Math.max(0, input.monthlyBill - residualBill.maximum)),
    maximum: roundMoney(Math.max(0, input.monthlyBill - residualBill.minimum)),
  };
  const annualSavingsFirstYear = {
    minimum: roundMoney(monthlySavings.minimum * 12),
    maximum: roundMoney(monthlySavings.maximum * 12),
  };

  let cumulativeSavingsMinimum = 0;
  let cumulativeSavingsMaximum = 0;
  const canCalculateBalance = paymentMethod === "cash" && investment.status === "available";

  const projection: SolarProjectionPoint[] = Array.from(
    { length: assumptions.projectionYears + 1 },
    (_, year) => {
      if (year === 0) {
        return {
          year,
          annualSavingsMinimum: 0,
          annualSavingsMaximum: 0,
          cumulativeSavingsMinimum: 0,
          cumulativeSavingsMaximum: 0,
          balanceMinimum: canCalculateBalance ? -investment.maximum : null,
          balanceMaximum: canCalculateBalance ? -investment.minimum : null,
          balanceMidpoint: canCalculateBalance
            ? -(investment.minimum + investment.maximum) / 2
            : null,
        };
      }

      const elapsedYears = year - 1;
      const tariffFactor = Math.pow(1 + assumptions.annualTariffAdjustmentRate, elapsedYears);
      const generationFactor = Math.pow(
        1 - assumptions.annualPanelDegradationRate,
        elapsedYears,
      );
      const annualSavingsMinimum = roundMoney(
        annualSavingsFirstYear.minimum * tariffFactor * generationFactor,
      );
      const annualSavingsMaximum = roundMoney(
        annualSavingsFirstYear.maximum * tariffFactor * generationFactor,
      );

      cumulativeSavingsMinimum = roundMoney(cumulativeSavingsMinimum + annualSavingsMinimum);
      cumulativeSavingsMaximum = roundMoney(cumulativeSavingsMaximum + annualSavingsMaximum);

      const balanceMinimum = canCalculateBalance
        ? roundMoney(cumulativeSavingsMinimum - investment.maximum)
        : null;
      const balanceMaximum = canCalculateBalance
        ? roundMoney(cumulativeSavingsMaximum - investment.minimum)
        : null;

      return {
        year,
        annualSavingsMinimum,
        annualSavingsMaximum,
        cumulativeSavingsMinimum,
        cumulativeSavingsMaximum,
        balanceMinimum,
        balanceMaximum,
        balanceMidpoint:
          balanceMinimum !== null && balanceMaximum !== null
            ? roundMoney((balanceMinimum + balanceMaximum) / 2)
            : null,
      };
    },
  );

  let payback: SolarPaybackEstimate;

  if (paymentMethod === "financing") {
    payback = {
      status: "financing-proposal",
      minimumYears: null,
      maximumYears: null,
    };
  } else if (investment.status === "quote-required") {
    payback = {
      status: "quote-required",
      minimumYears: null,
      maximumYears: null,
    };
  } else {
    const minimumYears = calculatePaybackYears(
      investment.minimum,
      annualSavingsFirstYear.maximum,
      assumptions,
    );
    const maximumYears = calculatePaybackYears(
      investment.maximum,
      annualSavingsFirstYear.minimum,
      assumptions,
    );

    if (minimumYears === null) {
      payback = {
        status: "outside-horizon",
        minimumYears: null,
        maximumYears: null,
      };
    } else if (maximumYears === null) {
      payback = {
        status: "partial",
        minimumYears,
        maximumYears: null,
      };
    } else {
      payback = {
        status: "available",
        minimumYears,
        maximumYears,
      };
    }
  }

  const lastProjection = projection[projection.length - 1];

  return {
    monthlyBill: input.monthlyBill,
    paymentMethod,
    consumption,
    targetGenerationKwh,
    investment,
    residualBill,
    monthlySavings,
    annualSavingsFirstYear,
    grossSavingsAtHorizon: {
      minimum: lastProjection?.cumulativeSavingsMinimum ?? 0,
      maximum: lastProjection?.cumulativeSavingsMaximum ?? 0,
    },
    payback,
    projection,
    assumptions,
  };
}

export function formatCurrencyBRL(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatDecimalPTBR(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}
