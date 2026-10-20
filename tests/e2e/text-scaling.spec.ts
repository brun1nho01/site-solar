import { expect, test } from "@playwright/test";
import { isolateThirdPartyRequests, openAnalysisForm } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

test("preferência real de fonte maior reorganiza formulário e mantém o menu acessível", async ({ page, context, browserName }, testInfo) => {
  test.skip(browserName !== "chromium", "Preferência de fonte configurada pelo protocolo do Chromium, não por CSS.");
  const session = await context.newCDPSession(page);
  await session.send("Page.enable");
  await session.send("Page.setFontSizes", { fontSizes: { standard: 32 } });
  await openAnalysisForm(page);
  await expect(page.locator("html")).toHaveCSS("font-size", "32px");
  expect(await page.locator("html").evaluate((element) => element.style.fontSize)).toBe("");

  const properties = page.getByRole("group", { name: "Tipo de imóvel", exact: true });
  await properties.scrollIntoViewIfNeeded();
  const geometry = await properties.evaluate((fieldset) => {
    return Array.from(fieldset.querySelectorAll("label")).map((label) => {
      const box = label.getBoundingClientRect();
      const text = label.querySelector("span")!.getBoundingClientRect();
      return { left: text.left - box.left, right: box.right - text.right, width: box.width };
    });
  });
  for (const item of geometry) {
    expect(item.left).toBeGreaterThanOrEqual(-1);
    expect(item.right).toBeGreaterThanOrEqual(-1);
  }
  await page.locator('label[for="lead-property-agronegocio"]').click();
  await expect(page.locator("#lead-property-agronegocio")).toBeChecked();
  await expect(page.getByLabel("Nome completo")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("font-32-property-options.png") });

  const theme = page.locator("header").getByRole("button", { name: /Ativar tema/ });
  await expect(theme).toBeInViewport({ ratio: 1 });
  await theme.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const menuButton = page.getByRole("button", { name: "Abrir menu", exact: true });
  if (await menuButton.isVisible()) {
    await expect(menuButton).toBeInViewport({ ratio: 1 });
    await menuButton.click();
    const menu = page.getByRole("dialog", { name: "Menu de navegação" });
    await expect(menu).toHaveCSS("opacity", "1");
    const first = menu.getByRole("link", { name: "Por que nós", exact: true });
    await expect(first).toBeFocused();
    await expect(first).toBeInViewport({ ratio: 1 });
    const clearsHeader = await first.evaluate((element) => element.getBoundingClientRect().top >= document.querySelector("header")!.getBoundingClientRect().bottom);
    expect(clearsHeader).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("font-32-menu.png") });
    for (let index = 0; index < 3; index += 1) await page.keyboard.press("Tab");
    await expect(menu.getByRole("link", { name: "Solicitar Análise", exact: true })).toBeFocused();
    await expect(menu.getByRole("link", { name: "Solicitar Análise", exact: true })).toBeInViewport({ ratio: 1 });
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(menuButton).toBeFocused();
  }
});

test("fonte padrão mantém três opções no celular de referência e reflow em telas estreitas", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375x812", "Uma sessão para a matriz de reflow normal.");
  await openAnalysisForm(page);
  const options = page.getByRole("group", { name: "Tipo de imóvel", exact: true }).locator("label");
  const tops = await options.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
  expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 320, height: 568 });
  for (const label of await options.all()) {
    const fits = await label.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const text = element.querySelector("span")!.getBoundingClientRect();
      return text.left >= box.left - 1 && text.right <= box.right + 1;
    });
    expect(fits).toBe(true);
  }
});
