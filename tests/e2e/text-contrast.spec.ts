import { expect, test, type Locator } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { dismissCookieBanner, isolateThirdPartyRequests, openAnalysisForm } from "./helpers";

// Canvas resolves modern CSS colors; alpha is composed over the actual surface.
// These targets have flat backgrounds (the legal main/form card are opaque).
async function readContrast(locator: Locator, options: { surface?: string; placeholder?: boolean } = {}) {
  return locator.evaluate((element, { surface, placeholder }) => {
    type RGBA = [number, number, number, number];
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const rgba = (color: string): RGBA => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const data = context.getImageData(0, 0, 1, 1).data;
      return [data[0], data[1], data[2], data[3] / 255];
    };
    const over = (front: RGBA, back: RGBA): RGBA => [
      front[0] * front[3] + back[0] * (1 - front[3]),
      front[1] * front[3] + back[1] * (1 - front[3]),
      front[2] * front[3] + back[2] * (1 - front[3]),
      1,
    ];
    const ancestors: Element[] = [];
    let current: Element | null = surface ? document.querySelector(surface) : element;
    if (!current) throw new Error(`Surface not found: ${surface}`);
    while (current) {
      ancestors.unshift(current);
      current = current.parentElement;
    }
    let background: RGBA = [255, 255, 255, 1];
    for (const ancestor of ancestors) {
      const style = getComputedStyle(ancestor);
      if (style.backgroundImage !== "none" || Number(style.opacity) !== 1) {
        throw new Error("Contrast helper only supports flat, fully opaque element chains");
      }
      background = over(rgba(style.backgroundColor), background);
    }
    const style = getComputedStyle(element, placeholder ? "::placeholder" : null);
    const foreground = rgba(style.color);
    foreground[3] *= Number(style.opacity);
    const visibleForeground = over(foreground, background);
    const luminance = (color: RGBA) => color.slice(0, 3).reduce((total, channel, index) => {
      const value = channel / 255;
      const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      return total + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
    const fg = luminance(visibleForeground);
    const bg = luminance(background);
    return { ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05), color: style.color, background };
  }, options);
}

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

for (const theme of ["light", "dark"] as const) {
  test(`textos auxiliares, exemplos dos campos e links legais têm contraste AA (${theme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: theme });
    await openAnalysisForm(page);
    const measurements: Record<string, Awaited<ReturnType<typeof readContrast>>> = {};
    const check = async (name: string, locator: Locator, options?: Parameters<typeof readContrast>[1]) => {
      const reading = await readContrast(locator, options);
      measurements[name] = reading;
      expect(reading.ratio, `${name}: ${JSON.stringify(reading)}`).toBeGreaterThanOrEqual(4.5);
    };
    await check("optional", page.locator('label[for="lead-monthly-consumption"] span'));
    await check("currency", page.getByText("R$", { exact: true }), { surface: "#lead-monthly-bill" });
    for (const input of await page.locator("form input[placeholder]").all()) {
      await check(`placeholder-${await input.getAttribute("id")}`, input, { placeholder: true });
    }
    await page.locator('label[for="lead-monthly-consumption"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath(`form-contrast-${theme}.png`) });

    for (const path of ["/privacidade", "/termos"]) {
      await page.goto(path);
      await dismissCookieBanner(page);
      const main = page.locator("main");
      const links = main.getByRole("link");
      for (const [index, link] of (await links.all()).entries()) {
        const key = `${path}-link-${index}`;
        await check(`${key}-normal`, link);
        if (await page.evaluate(() => matchMedia("(hover: hover)").matches)) {
          await link.hover();
          await expect(link).toHaveCSS("text-decoration-line", "underline");
          await check(`${key}-hover`, link);
          await page.mouse.move(0, 0);
        }
        await page.keyboard.press("Tab");
        await link.focus();
        expect(await link.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
        await expect(link).toHaveCSS("outline-style", "solid");
        await check(`${key}-focus`, link);
      }
      if (path === "/privacidade") {
        await check("privacy-update-date", main.getByText("Última atualização:", { exact: false }));
      }
      await main.evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
      await page.screenshot({ path: testInfo.outputPath(`${path.slice(1)}-contrast-${theme}.png`) });
      await main.getByRole("link", { name: /Voltar para/ }).click();
      await expect(page).toHaveURL(/\/$/);
    }
    const metricsPath = testInfo.outputPath(`contrast-${theme}.json`);
    await writeFile(metricsPath, JSON.stringify(measurements, null, 2));
    await testInfo.attach(`contrast-${theme}`, { path: metricsPath, contentType: "application/json" });
  });
}
