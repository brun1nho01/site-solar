import { expect, test, type Page } from "@playwright/test";
import {
  installBlockedPopupStub,
  isolateThirdPartyRequests,
  openAnalysisForm,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

async function completeRequiredFields(page: Page) {
  await page.getByLabel("Nome completo").fill("Cliente de Teste");
  await page.getByLabel("Conta média de energia").fill("500,00");
  await page.getByLabel(/Consumo em kWh/).fill("420");
  await page.getByLabel("CEP da instalação").fill("28430586");
  await page.getByLabel("Local dos painéis").selectOption("telhado");
  await page.getByLabel("Tipo de telhado").selectOption("ceramico");
  await page.locator('label[for="lead-property-residencial"]').click();
  await page.locator('label[for="lead-financing-nao"]').click();
  await page.locator('label[for="lead-consent"]').click();
}

test("site solicita análise sem expor resultados comerciais", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Conteúdo idêntico nos três viewports.");
  await openAnalysisForm(page);

  await expect(page.getByText("Investimento estimado", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Retorno à vista", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(page.getByText(/você revisa a mensagem antes de enviar/i)).toBeVisible();
});

test("painel de apresentação acompanha os temas claro e escuro", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Tema validado em um viewport.");
  await openAnalysisForm(page);

  const introPanel = page.getByTestId("analysis-intro-panel");
  await expect(introPanel).toHaveCSS("background-color", "rgb(242, 246, 251)");

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await expect(introPanel).toHaveCSS("background-color", "rgb(6, 11, 20)");
});

test("formulário revela o tipo de telhado somente quando necessário", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Interação condicional validada uma vez.");
  await openAnalysisForm(page);

  const installLocation = page.getByLabel("Local dos painéis");
  await expect(page.getByLabel("Tipo de telhado")).toHaveCount(0);
  await installLocation.selectOption("telhado");
  await expect(page.getByLabel("Tipo de telhado")).toBeVisible();
  await installLocation.selectOption("solo");
  await expect(page.getByLabel("Tipo de telhado")).toHaveCount(0);
});

test("erro no local dos painéis direciona o foco e permite corrigir sem perder dados", async ({ page }, testInfo) => {
  await installBlockedPopupStub(page);
  await openAnalysisForm(page);
  await completeRequiredFields(page);

  const installLocation = page.getByLabel("Local dos painéis");
  const submitButton = page.getByRole("button", { name: "Solicitar análise pelo WhatsApp" });
  await installLocation.selectOption("");
  await submitButton.click();

  await expect(installLocation).toBeFocused();
  await expect(installLocation).toBeInViewport({ ratio: 1 });
  await expect(page.locator("#lead-install-error")).toBeInViewport({ ratio: 1 });
  await expect(installLocation).toHaveAttribute("aria-invalid", "true");
  await expect(installLocation).toHaveAccessibleDescription("Selecione o local da instalação.");
  await expect(page.locator("form [aria-live='polite']")).toHaveText(
    "Há um campo para corrigir. Selecione o local da instalação.",
  );
  await expect(page.getByLabel("Nome completo")).toHaveValue("Cliente de Teste");
  await expect(page.getByLabel("Conta média de energia")).toHaveValue("500,00");
  await expect(page.getByLabel(/Consumo em kWh/)).toHaveValue("420");
  await expect(page.getByLabel("CEP da instalação")).toHaveValue("28430-586");
  await expect(page.locator("#lead-property-residencial")).toBeChecked();
  await expect(page.locator("#lead-financing-nao")).toBeChecked();
  await expect(page.locator("#lead-consent")).toBeChecked();
  expect(await page.evaluate(() => window.sessionStorage.getItem("e2e:last-popup-url"))).toBeNull();

  await page.screenshot({ path: testInfo.outputPath("install-location-error.png") });

  await installLocation.selectOption("solo");
  await expect(installLocation).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator("#lead-install-error")).toHaveCount(0);
  await expect(page.getByLabel("Tipo de telhado")).toHaveCount(0);
  await submitButton.click();

  const fallback = page.getByRole("alert").filter({ hasText: "O navegador bloqueou a nova aba." });
  await expect(fallback).toBeVisible();
  const openedUrl = await page.evaluate(() => window.sessionStorage.getItem("e2e:last-popup-url"));
  const message = new URL(openedUrl!).searchParams.get("text") ?? "";
  expect(message).toContain("Cliente de Teste");
  expect(message).toContain("Local pretendido: solo");
  expect(message).not.toContain("Tipo de telhado:");
});

test("formulário valida o primeiro campo e prepara a mensagem sem estimativas", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375x812", "Fluxo completo coberto no viewport móvel.");
  await installBlockedPopupStub(page);
  await openAnalysisForm(page);

  const submitButton = page.getByRole("button", { name: "Solicitar análise pelo WhatsApp" });
  await submitButton.click();
  await expect(page.getByLabel("Nome completo")).toBeFocused();

  await completeRequiredFields(page);
  await submitButton.click();

  const fallback = page.getByRole("alert").filter({ hasText: "O navegador bloqueou a nova aba." });
  await expect(fallback).toContainText("O navegador bloqueou a nova aba.");
  await expect(fallback).toContainText("Nenhuma mensagem foi enviada.");

  const openedUrl = await page.evaluate(() => window.sessionStorage.getItem("e2e:last-popup-url"));
  expect(openedUrl).toBeTruthy();
  const whatsappUrl = new URL(openedUrl!);
  const message = whatsappUrl.searchParams.get("text") ?? "";

  expect(`${whatsappUrl.origin}${whatsappUrl.pathname}`).toBe("https://wa.me/5522999618883");
  expect(message).toContain("Cliente de Teste");
  expect(message).toContain("R$ 500,00");
  expect(message).toContain("28430-586");
  expect(message).not.toMatch(/investimento|economia estimada|retorno simples|geração de referência/i);
});

test("não mostra falso bloqueio quando o WhatsApp abre", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Sucesso validado em um viewport.");
  await openAnalysisForm(page);
  await completeRequiredFields(page);

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Solicitar análise pelo WhatsApp" }).click();
  const whatsappPopup = await popupPromise;

  await expect(page.getByRole("alert").filter({ hasText: "O navegador bloqueou a nova aba." })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("Conversa preparada. Revise a mensagem no WhatsApp antes de enviar.");
  await whatsappPopup.close();
});
