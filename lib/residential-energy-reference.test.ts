import { describe, expect, it } from "vitest";
import {
  ANNUAL_RESIDENTIAL_ENERGY_COST_BRL,
  estimateResidentialEnergyCostAt,
  estimateResidentialEnergyCostPerSecond,
} from "./residential-energy-reference";

describe("referência de custo residencial de energia", () => {
  it("calcula o custo anual a partir do consumo e da tarifa oficiais", () => {
    expect(ANNUAL_RESIDENTIAL_ENERGY_COST_BRL).toBeCloseTo(122_337_851_640, 0);
  });

  it("calcula a taxa por segundo considerando a duração do ano", () => {
    expect(estimateResidentialEnergyCostPerSecond(2026)).toBeCloseTo(3_879.31, 2);
  });

  it("mantém o acumulado entre zero e o total anual", () => {
    expect(estimateResidentialEnergyCostAt(new Date(2026, 0, 1))).toBe(0);
    expect(estimateResidentialEnergyCostAt(new Date(2027, 0, 1))).toBe(0);

    const middleOfYear = new Date(2026, 6, 2, 12);
    expect(estimateResidentialEnergyCostAt(middleOfYear)).toBeCloseTo(
      ANNUAL_RESIDENTIAL_ENERGY_COST_BRL / 2,
      -5,
    );
  });
});
