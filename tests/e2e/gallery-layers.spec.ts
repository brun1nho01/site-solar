import { expect, test } from "@playwright/test";
import { isolateThirdPartyRequests, openHome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

for (const theme of ["light", "dark"] as const) {
  test(`modal cobre o WhatsApp e preserva teclado, fechamento e contato externo (${theme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme });
    await openHome(page);
    await page.getByRole("link", { name: "Ver instalações", exact: true }).click();
    const trigger = page.getByRole("button", { name: /Abrir mídia:/ }).first();
    await trigger.scrollIntoViewIfNeeded();
    const whatsapp = page.locator(".floating-whatsapp");
    await expect(whatsapp).toBeInViewport({ ratio: 1 });
    const whatsappPoint = await whatsapp.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    });
    let externalNavigation = false;
    page.on("popup", () => { externalNavigation = true; });
    page.on("request", (request) => {
      if (/wa\.me|whatsapp\.com/.test(request.url())) externalNavigation = true;
    });

    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: /Visualizar:/ });
    const overlay = page.locator(".media-overlay");
    const close = dialog.getByRole("button", { name: "Fechar mídia", exact: true });
    await expect(overlay).toHaveCSS("opacity", "1");
    await expect(dialog).toHaveCSS("opacity", "1");
    await expect(dialog).toHaveCSS("transform", "none");
    await expect(close).toBeFocused();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    expect(await overlay.evaluate((element) => element.parentElement === document.body)).toBe(true);
    expect(await page.evaluate(({ x, y }) => {
      const hit = document.elementFromPoint(x, y);
      return Boolean(hit?.closest(".media-overlay")) && !hit?.closest(".floating-whatsapp");
    }, whatsappPoint)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`gallery-overlay-${theme}.png`) });

    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("link", { name: "Ver publicação" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    await trigger.click();
    await close.click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await trigger.click();
    await expect(overlay).toHaveCSS("opacity", "1");
    // Click the backdrop where the floating contact sits: never open WhatsApp.
    await page.mouse.click(whatsappPoint.x, whatsappPoint.y);
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(externalNavigation).toBe(false);
    expect(await whatsapp.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    })).toBe(true);
    await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(whatsapp).not.toHaveAttribute("aria-hidden", "true");
  });
}

test("portal do modal respeita movimento reduzido e devolve o foco", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await page.getByRole("link", { name: "Ver instalações", exact: true }).click();
  const trigger = page.getByRole("button", { name: /Abrir mídia:/ }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: /Visualizar:/ });
  await expect(dialog.getByRole("button", { name: "Fechar mídia" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
