import { expect, test } from "@playwright/test";
import {
  installBlockedPopupStub,
  isolateThirdPartyRequests,
  mockViaCep,
  openCalculator,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

test("simulador respeita o teto de R$ 3.000", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Cálculo idêntico nos três viewports.");
  await openCalculator(page);

  const slider = page.getByRole("slider", { name: "Valor da conta de luz mensal" });
  await slider.fill("3000");
  await expect(slider).toHaveValue("3000");
  await expect(page.getByText("R$ 3.000/mês", { exact: true })).toBeVisible();
  await expect(page.getByText("Sob consulta", { exact: true })).toBeVisible();
});

test("modo em kWh usa somente o consumo informado", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Cálculo idêntico nos três viewports.");
  await openCalculator(page);

  await page.getByRole("button", { name: "Prefiro informar o consumo em kWh" }).click();
  const consumption = page.getByRole("textbox", { name: "Consumo médio mensal" });
  await consumption.fill("500");

  await expect(consumption).toHaveValue("500");
  await expect(page.getByText(/Para 500 kWh\/mês, usamos uma conta equivalente/)).toBeVisible();
  await expect(page.getByRole("slider", { name: "Valor da conta de luz mensal" })).toHaveCount(0);
});

test("falha do ViaCEP não impede a análise", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Cenário externo validado uma vez.");
  await openCalculator(page);
  await page.getByRole("button", { name: "Continuar para a Análise Inicial" }).click();

  await page.getByLabel("CEP da instalação").fill("99999999");
  await expect(page.getByText(/CEP não encontrado/)).toBeVisible();
  await page.locator('label[for="lead-property-residencial"]').click();
  await page.locator('label[for="lead-install-solo"]').click();
  await page.locator('label[for="lead-financing-nao"]').click();
  await page.getByRole("button", { name: "Gerar Simulação Inicial" }).click();

  await expect(page.getByRole("heading", { name: "Projeção Estimada" })).toBeVisible();
});

test("formulário valida foco e trata popup bloqueado sem abrir o WhatsApp", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375x812", "Fluxo completo coberto no viewport móvel.");
  await installBlockedPopupStub(page);
  await mockViaCep(page, { uf: "RJ" });
  await openCalculator(page);
  await page.getByRole("button", { name: "Continuar para a Análise Inicial" }).click();

  await page.getByRole("button", { name: "Gerar Simulação Inicial" }).click();
  await expect(page.getByLabel("CEP da instalação")).toBeFocused();

  await page.getByLabel("CEP da instalação").fill("28430586");
  await expect(page.getByText("Estado encontrado: RJ.")).toBeVisible();
  await page.locator('label[for="lead-property-residencial"]').click();
  await page.locator('label[for="lead-install-telhado"]').click();
  await page.getByLabel("Qual o tipo de telhado?").selectOption("ceramico");
  await page.locator('label[for="lead-financing-nao"]').click();
  await page.getByRole("button", { name: "Gerar Simulação Inicial" }).click();
  await expect(page.getByRole("heading", { name: "Projeção Estimada" })).toBeVisible();

  await page.getByRole("button", { name: "Abrir Conversa no WhatsApp" }).click();
  await expect(page.getByLabel("Nome completo")).toBeFocused();
  await page.getByLabel("Nome completo").fill("Cliente de Teste");
  await page.getByLabel(/E-mail/).fill("cliente@example.com");
  await page.locator('label[for="lead-consent"]').click();
  await page.getByRole("button", { name: "Abrir Conversa no WhatsApp" }).click();

  const fallback = page.getByRole("alert").filter({ hasText: "O navegador bloqueou a nova aba." });
  await expect(fallback).toContainText("O navegador bloqueou a nova aba.");
  await expect(fallback).toContainText("Nenhuma mensagem foi enviada.");

  const openedUrl = await page.evaluate(() => window.sessionStorage.getItem("e2e:last-popup-url"));
  expect(openedUrl).toBeTruthy();
  const whatsappUrl = new URL(openedUrl!);
  expect(`${whatsappUrl.origin}${whatsappUrl.pathname}`).toBe("https://wa.me/5522999618883");
  expect(whatsappUrl.searchParams.get("text")).toContain("Cliente de Teste");
  expect(whatsappUrl.searchParams.get("text")).toContain("28430-586 (RJ)");
});
