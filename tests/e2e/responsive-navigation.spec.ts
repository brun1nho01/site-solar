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
    await page.getByRole("link", { name: "Por que nós" }).click();
    await expect(page).toHaveURL(/#qualidade$/);
    await expect(page.locator("#qualidade")).toBeInViewport();
    return;
  }

  const menuButton = page.getByRole("button", { name: "Abrir menu" });
  await menuButton.click();
  const menu = page.getByRole("dialog", { name: "Menu de navegação" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Por que nós" })).toBeFocused();

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

test("WhatsApp flutuante no celular só aparece após o formulário", async ({ page }, testInfo) => {
  await openHome(page);
  const whatsapp = page.locator(".floating-whatsapp");
  const isMobile = testInfo.project.name === "mobile-375x812";

  if (isMobile) {
    // No hero (topo): deve estar oculto / suprimido
    await expect(whatsapp).toHaveClass(/floating-whatsapp--suppressed/);
    await expect(whatsapp).toHaveAttribute("aria-hidden", "true");

    // No formulário (#analise): ainda deve estar oculto
    const analise = page.locator("#analise");
    await analise.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(whatsapp).toHaveClass(/floating-whatsapp--suppressed/);
    await expect(whatsapp).toHaveAttribute("aria-hidden", "true");

    // Após o formulário (ex: #qualidade): deve aparecer
    const qualidade = page.locator("#qualidade");
    await qualidade.scrollIntoViewIfNeeded();
    await expect(whatsapp).not.toHaveClass(/floating-whatsapp--suppressed/);
    await expect(whatsapp).not.toHaveAttribute("aria-hidden", "true");
  } else {
    // No desktop: sempre visível e acessível
    await expect(whatsapp).not.toHaveAttribute("aria-hidden", "true");
    await expect(whatsapp).toBeVisible();
  }
});