import { expect, test, type Page } from "@playwright/test";
import { isolateThirdPartyRequests, openHome } from "./helpers";

const hotspots = [
  { name: "Captação (Painéis)", x: 0.433, y: 0.285 },
  { name: "Conversão (Inversor)", x: 0.753, y: 0.535 },
] as const;

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

async function expectSceneInsideHero(page: Page) {
  const geometry = await page.locator("#hero").evaluate((hero) => {
    const image = hero.querySelector<HTMLImageElement>(".hero-image")!;
    const scene = hero.querySelector<HTMLElement>(".hero-scene")!;
    const imageBox = image.getBoundingClientRect();
    const heroBox = hero.getBoundingClientRect();
    const sceneBox = scene.getBoundingClientRect();
    return {
      left: imageBox.left - Math.max(0, heroBox.left),
      right: Math.min(innerWidth, heroBox.right) - imageBox.right,
      top: imageBox.top - heroBox.top,
      bottom: heroBox.bottom - imageBox.bottom,
      squareDifference: Math.abs(imageBox.width - imageBox.height),
      sceneWidthDifference: Math.abs(imageBox.width - sceneBox.width),
      sceneHeightDifference: Math.abs(imageBox.height - sceneBox.height),
      imageRatio: image.naturalWidth / image.naturalHeight,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(geometry.left).toBeGreaterThanOrEqual(-1);
  expect(geometry.right).toBeGreaterThanOrEqual(-1);
  expect(geometry.top).toBeGreaterThanOrEqual(-1);
  expect(geometry.bottom).toBeGreaterThanOrEqual(-1);
  expect(geometry.squareDifference).toBeLessThanOrEqual(1);
  expect(geometry.sceneWidthDifference).toBeLessThanOrEqual(1);
  expect(geometry.sceneHeightDifference).toBeLessThanOrEqual(1);
  expect(geometry.imageRatio).toBe(1);
  expect(geometry.horizontalOverflow).toBeLessThanOrEqual(1);

  for (const spot of hotspots) {
    const position = await page.getByRole("button", { name: spot.name, exact: true }).evaluate((button) => {
      const image = button.closest(".hero-scene")!.querySelector("img")!.getBoundingClientRect();
      const trigger = button.getBoundingClientRect();
      return {
        x: (trigger.left + trigger.width / 2 - image.left) / image.width,
        y: (trigger.top + trigger.height / 2 - image.top) / image.height,
        width: trigger.width,
        height: trigger.height,
      };
    });
    expect(position.x).toBeCloseTo(spot.x, 2);
    expect(position.y).toBeCloseTo(spot.y, 2);
    // A translated box can report 43.999969px for a 44px CSS target.
    expect(Math.round(position.width * 1000) / 1000).toBeGreaterThanOrEqual(44);
    expect(Math.round(position.height * 1000) / 1000).toBeGreaterThanOrEqual(44);
  }
}

async function expectPanelInsideFrame(page: Page, name: string) {
  const panel = page.getByRole("region", { name, exact: true });
  await expect(panel).toBeInViewport({ ratio: 1 });
  const box = await panel.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const scene = element.closest(".hero-scene")!.getBoundingClientRect();
    const header = document.querySelector("header")!.getBoundingClientRect();
    return {
      left: bounds.left - scene.left,
      right: scene.right - bounds.right,
      top: bounds.top - scene.top,
      bottom: scene.bottom - bounds.bottom,
      clearsHeader: bounds.top >= header.bottom,
    };
  });
  expect(box.left).toBeGreaterThanOrEqual(-1);
  expect(box.right).toBeGreaterThanOrEqual(-1);
  expect(box.top).toBeGreaterThanOrEqual(-1);
  expect(box.bottom).toBeGreaterThanOrEqual(-1);
  expect(box.clearsHeader).toBe(true);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`ilustração inteira e pontos alinhados, com balões acessíveis (${colorScheme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await openHome(page);
    const image = page.getByAltText("Infográfico 3D da Anatomia do Sistema Solar");
    await image.evaluate((element: HTMLImageElement) => element.decode());
    await expect(image).toHaveAttribute("width", "1254");
    await expect(image).toHaveAttribute("height", "1254");
    await expect(image).toHaveCSS("transform", "none");
    await expectSceneInsideHero(page);
    await expect(page.getByRole("button", { name: "Solicitar Análise", exact: true })).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("link", { name: "Ver instalações", exact: true })).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath(`scene-${colorScheme}.png`) });

    for (const [index, spot] of hotspots.entries()) {
      const trigger = page.getByRole("button", { name: spot.name, exact: true });
      if (index === 0) {
        await trigger.focus();
        await page.keyboard.press("Enter");
      } else {
        await trigger.click();
      }
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectPanelInsideFrame(page, spot.name);
      await page.screenshot({ path: testInfo.outputPath(`hotspot-${index + 1}-${colorScheme}.png`) });
      if (index === 0) {
        await page.keyboard.press("Escape");
      } else {
        await page.getByRole("button", { name: `Fechar informações sobre ${spot.name}`, exact: true }).click();
      }
      await expect(page.getByRole("region", { name: spot.name, exact: true })).toHaveCount(0);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toBeFocused();
    }
  });
}

test("quadro e balões respeitam larguras limite e orientação paisagem", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Matriz extra de tamanhos verificada em uma sessão.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await page.getByAltText("Infográfico 3D da Anatomia do Sistema Solar").evaluate((image: HTMLImageElement) => image.decode());

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 812, height: 375 },
    { width: 1023, height: 568 },
    { width: 1024, height: 900 },
    { width: 1279, height: 900 },
    { width: 1280, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await expectSceneInsideHero(page);
    for (const [index, spot] of hotspots.entries()) {
      await page.getByRole("button", { name: spot.name, exact: true }).click();
      await expectPanelInsideFrame(page, spot.name);
      if (index === 1) {
        await page.screenshot({ path: testInfo.outputPath(`scene-${viewport.width}x${viewport.height}.png`) });
      }
      await page.keyboard.press("Escape");
    }
  }
});
