import { expect, test } from "@playwright/test";
import { isolateThirdPartyRequests, openHome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

test("layout não cria rolagem horizontal", async ({ page }) => {
  await openHome(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("navegação se adapta ao desktop e ao menu móvel", async ({ page }, testInfo) => {
  await openHome(page);
  const isDesktop = testInfo.project.name === "desktop-1440x900";

  if (isDesktop) {
    await page.getByRole("link", { name: "Solução" }).click();
    await expect(page).toHaveURL(/#qualidade$/);
    await expect(page.locator("#qualidade")).toBeInViewport();
    return;
  }

  const menuButton = page.getByRole("button", { name: "Abrir menu" });
  await menuButton.click();
  const menu = page.getByRole("dialog", { name: "Menu de navegação" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Solução" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await menu.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/#faq$/);
  await expect(menu).toBeHidden();
  await expect(page.locator("#faq")).toBeInViewport();
});

test("tema escolhido permanece depois de recarregar", async ({ page }) => {
  await openHome(page);
  const darkThemeButton = page.getByRole("button", { name: "Ativar tema escuro" });
  await darkThemeButton.click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Ativar tema claro" })).toBeVisible();
});

test("atalho de teclado pula para o conteúdo principal", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Fluxo único de teclado.");
  await openHome(page);

  await page.reload();
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#conteudo-principal")).toBeFocused();
});

test("preferência por movimento reduzido remove a flutuação do hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Validação única da preferência do sistema.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);

  await expect(page.getByAltText("Infográfico 3D da Anatomia do Sistema Solar").locator("..")).not.toHaveClass(
    /animate-hero-float/,
  );
});

test("taxímetro explica a referência e conduz ao simulador", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Fluxo validado uma vez no desktop.");
  await openHome(page);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));

  const taximeter = page.getByRole("region", {
    name: "A conta de energia continua correndo.",
  });
  await taximeter.scrollIntoViewIfNeeded();

  await expect(taximeter).toContainText(/176\.628 GWh/);
  await expect(taximeter).toContainText(/R\$ 122,3 bilhões por ano/);
  await expect(taximeter).toContainText(
    "O valor não representa desperdício nem economia garantida com energia solar.",
  );

  await taximeter.getByRole("link", { name: "Simular com a minha conta" }).click();
  await expect(page).toHaveURL(/#simulador$/);
  await expect(page.locator("#simulador")).toBeInViewport();
});
