import { expect, test } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests, openHome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

test("Analytics permanece desligado até o aceite e após a recusa", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Consentimento independe do viewport.");
  await page.goto("/");

  const analyticsScript = page.locator('script[src*="googletagmanager.com"]');
  await expect(analyticsScript).toHaveCount(0);
  const dialog = page.getByRole("dialog", { name: /dados de navegação/i });
  await dialog.getByRole("button", { name: "Recusar" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("wlima.analytics-consent"))).toBe("denied");

  await page.reload();
  await expect(dialog).toBeHidden();
  await expect(analyticsScript).toHaveCount(0);

  const preferences = page.getByRole("button", { name: "Preferências de cookies" });
  await preferences.scrollIntoViewIfNeeded();
  await preferences.click();
  await dialog.getByRole("button", { name: "Aceitar analíticos" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("wlima.analytics-consent"))).toBe("granted");
  await expect(analyticsScript).toHaveCount(1);
});

test("mapa renderiza as sete cidades sem consultar tiles reais", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Conteúdo do mapa independe do viewport.");
  await openHome(page);

  const mapHeading = page.getByRole("heading", { name: /Energia solar ativa em várias cidades/i });
  await mapHeading.scrollIntoViewIfNeeded();
  await expect(mapHeading).toBeVisible();
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(7, { timeout: 15_000 });
});

test("mapa explica falha dos tiles e permite tentar novamente", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Estado de falha independe do viewport.");
  let tileRequests = 0;
  await page.route("https://tile.openstreetmap.org/**", async (route) => {
    tileRequests += 1;
    await route.abort("failed");
  });

  await openHome(page);
  const mapHeading = page.getByRole("heading", { name: /Energia solar ativa em várias cidades/i });
  await mapHeading.scrollIntoViewIfNeeded();

  const mapStatus = page.getByRole("status");
  await expect(mapStatus).toContainText("Mapa base indisponível", { timeout: 15_000 });
  await expect(mapStatus).toContainText("Os pontos continuam indicando o centro aproximado");
  await expect(page.locator(".leaflet-marker-icon")).toHaveCount(7);

  const requestsBeforeRetry = tileRequests;
  await mapStatus.getByRole("button", { name: "Tentar novamente" }).click();
  await expect.poll(() => tileRequests).toBeGreaterThan(requestsBeforeRetry);
});

test("galeria abre pelo teclado, fecha com Escape e devolve o foco", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Fluxo completo de teclado coberto uma vez.");
  await openHome(page);

  const galleryPlaceholder = page.getByRole("region", { name: "Carregando galeria" });
  await galleryPlaceholder.scrollIntoViewIfNeeded();
  const galleryHeading = page.getByRole("heading", { name: /Projetos e bastidores da W\. Lima/i });
  await expect(galleryHeading).toBeVisible();

  const firstMedia = page.getByRole("button", { name: /Abrir mídia:/ }).first();
  await firstMedia.focus();
  await page.keyboard.press("Enter");
  const mediaDialog = page.getByRole("dialog", { name: /Visualizar:/ });
  await expect(mediaDialog).toBeVisible();
  await expect(mediaDialog.getByRole("button", { name: "Fechar mídia" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(mediaDialog).toBeHidden();
  await expect(firstMedia).toBeFocused();
});

test("preferências continuam acessíveis em tela intermediária", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "tablet-768x1024", "Cobertura complementar do controle persistente.");
  await page.addInitScript(() => localStorage.setItem("wlima.analytics-consent", "denied"));
  await page.goto("/");
  await dismissCookieBanner(page);

  const preferences = page.getByRole("button", { name: "Preferências de cookies" });
  await preferences.scrollIntoViewIfNeeded();
  await preferences.click();
  await expect(page.getByRole("dialog", { name: /dados de navegação/i })).toBeVisible();
});
