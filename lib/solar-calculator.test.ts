import { describe, expect, it } from "vitest";
import {
  calculateSolarEstimate,
  estimateMonthlyBillFromConsumption,
  estimateInvestmentForGeneration,
  formatCurrencyBRL,
} from "./solar-calculator";

describe("calculateSolarEstimate", () => {
  it("reproduz o cenário de referência para uma conta de R$ 500", () => {
    const result = calculateSolarEstimate({ monthlyBill: 500 });

    expect(result.consumption).toEqual({
      source: "estimated",
      minimumKwh: 390,
      maximumKwh: 490,
    });
    expect(result.targetGenerationKwh).toBe(600);
    expect(result.investment).toEqual({
      status: "available",
      minimum: 11_000,
      maximum: 12_000,
    });
    expect(result.residualBill).toEqual({ minimum: 50, maximum: 100 });
    expect(result.monthlySavings).toEqual({ minimum: 400, maximum: 450 });
    expect(result.annualSavingsFirstYear).toEqual({ minimum: 4_800, maximum: 5_400 });
    expect(result.payback.status).toBe("available");

    if (result.payback.status === "available") {
      expect(result.payback.minimumYears).toBeCloseTo(2.04, 2);
      expect(result.payback.maximumYears).toBeCloseTo(2.51, 2);
    }
  });

  it("prioriza o consumo informado pelo visitante", () => {
    const monthlyBill = estimateMonthlyBillFromConsumption(500);
    const result = calculateSolarEstimate({
      monthlyBill,
      monthlyConsumptionKwh: 500,
    });

    expect(monthlyBill).toBeCloseTo(568.18, 2);
    expect(result.consumption).toEqual({
      source: "informed",
      minimumKwh: 500,
      maximumKwh: 500,
    });
    expect(result.targetGenerationKwh).toBe(600);
    expect(result.monthlySavings).toEqual({
      minimum: 468.18,
      maximum: 518.18,
    });
  });

  it("mantém a referência de R$ 500 para o ponto médio de 440 kWh", () => {
    expect(estimateMonthlyBillFromConsumption(440)).toBe(500);
  });

  it("aplica a degradação a partir do segundo ano", () => {
    const result = calculateSolarEstimate({ monthlyBill: 500 });

    expect(result.projection).toHaveLength(26);
    expect(result.projection[1].annualSavingsMinimum).toBe(4_800);
    expect(result.projection[2].annualSavingsMinimum).toBe(4_776);
    expect(result.projection[0].balanceMinimum).toBe(-12_000);
    expect(result.projection[0].balanceMaximum).toBe(-11_000);
  });

  it("mantém a economia energética, mas não calcula payback financiado", () => {
    const result = calculateSolarEstimate({
      monthlyBill: 500,
      paymentMethod: "financing",
    });

    expect(result.monthlySavings).toEqual({ minimum: 400, maximum: 450 });
    expect(result.payback.status).toBe("financing-proposal");
    expect(result.projection.every((point) => point.balanceMidpoint === null)).toBe(true);
  });

  it("pede orçamento fora da faixa de preços conhecida", () => {
    const belowRange = calculateSolarEstimate({
      monthlyBill: 150,
      monthlyConsumptionKwh: 200,
    });
    const aboveRange = calculateSolarEstimate({
      monthlyBill: 1_000,
      monthlyConsumptionKwh: 1_000,
    });

    expect(belowRange.investment).toMatchObject({
      status: "quote-required",
      reason: "below-priced-range",
    });
    expect(aboveRange.investment).toMatchObject({
      status: "quote-required",
      reason: "above-priced-range",
    });
    expect(belowRange.payback.status).toBe("quote-required");
    expect(aboveRange.payback.status).toBe("quote-required");
  });

  it("marca o retorno que não ocorre dentro do horizonte", () => {
    const result = calculateSolarEstimate({
      monthlyBill: 150,
      monthlyConsumptionKwh: 500,
      assumptions: {
        priceAnchors: [
          {
            generationKwhPerMonth: 600,
            minimumInvestment: 1_000_000,
            maximumInvestment: 1_100_000,
          },
          {
            generationKwhPerMonth: 1_000,
            minimumInvestment: 1_500_000,
            maximumInvestment: 1_600_000,
          },
        ],
      },
    });

    expect(result.payback.status).toBe("outside-horizon");
  });

  it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejeita conta inválida: %s",
    (monthlyBill) => {
      expect(() => calculateSolarEstimate({ monthlyBill })).toThrow(RangeError);
    },
  );

  it("produz o mesmo resultado para a mesma entrada", () => {
    const input = { monthlyBill: 500, monthlyConsumptionKwh: 450 };

    expect(calculateSolarEstimate(input)).toEqual(calculateSolarEstimate(input));
  });
});

describe("estimateInvestmentForGeneration", () => {
  it("usa os dois preços informados pela empresa", () => {
    expect(estimateInvestmentForGeneration(600)).toEqual({
      status: "available",
      minimum: 11_000,
      maximum: 12_000,
    });
    expect(estimateInvestmentForGeneration(1_000)).toEqual({
      status: "available",
      minimum: 15_500,
      maximum: 15_500,
    });
  });

  it("interpola sem criar quedas entre 600 e 1.000 kWh", () => {
    const estimates = [600, 700, 800, 900, 1_000].map((generation) =>
      estimateInvestmentForGeneration(generation),
    );
    const minimumValues = estimates.map((estimate) =>
      estimate.status === "available" ? estimate.minimum : 0,
    );
    const maximumValues = estimates.map((estimate) =>
      estimate.status === "available" ? estimate.maximum : 0,
    );

    expect(estimateInvestmentForGeneration(800)).toEqual({
      status: "available",
      minimum: 13_250,
      maximum: 13_750,
    });
    expect(minimumValues).toEqual([...minimumValues].sort((a, b) => a - b));
    expect(maximumValues).toEqual([...maximumValues].sort((a, b) => a - b));
  });
});

describe("formatCurrencyBRL", () => {
  it("formata valores em reais", () => {
    expect(formatCurrencyBRL(11_500).replace(/\s/g, " ")).toBe("R$ 11.500");
  });
});
