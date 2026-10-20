import { expect, test, type Page } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests, openHome } from "./helpers";

const steps = [
  { title: "Análise de Viabilidade", description: "Levantamento da fatura, do perfil de consumo e das condições do telhado ou do solo para orientar o dimensionamento inicial." },
  { title: "Projeto e Homologação", description: "Definição técnica do sistema e condução das etapas aplicáveis junto à concessionária, conforme o escopo formal da proposta." },
  { title: "Instalação Conforme o Projeto", description: "Montagem dos equipamentos e da infraestrutura conforme as condições verificadas no local e o cronograma definido para cada obra." },
  { title: "Vistoria e Conexão", description: "Acompanhamento das etapas de vistoria, troca ou configuração do medidor e liberação, nos prazos e procedimentos da concessionária." },
  { title: "Geração e Compensação", description: "Depois da liberação, o sistema começa a gerar energia. Créditos, economia e cobranças remanescentes variam conforme geração, consumo e regras da concessionária." },
] as const;

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

async function navigateToProcess(page: Page, isDesktop: boolean) {
  if (!isDesktop) await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("link", { name: "Processo", exact: true }).click();
  await expect(page.locator("#processo [data-process-animation]")).toHaveCount(1);
}

async function scrollToProgress(page: Page, progress: number) {
  await page.locator("[data-process-animation]").evaluate((element, value) => {
    const bounds = element.getBoundingClientRect();
    window.scrollTo({
      top: bounds.top + window.scrollY + (bounds.height - window.innerHeight) * value,
      behavior: "instant",
    });
  }, progress);
}

async function expectStepReadable(page: Page, index: number) {
  const step = page.locator(`[data-process-step="${index + 1}"]`);
  await expect(step).toHaveCSS("opacity", "1");
  await expect(page.locator(`[data-process-icon="${index + 1}"]`)).toHaveCSS("opacity", "1");
  await expect(step.getByRole("heading", { name: steps[index].title, exact: true })).toBeInViewport({ ratio: 1 });
  await expect(step.locator("p")).toHaveText(steps[index].description);
  await expect(step.locator("p")).toBeInViewport({ ratio: 1 });
  const clearsHeader = await step.evaluate((element) => {
    const heading = element.querySelector("h3")!.getBoundingClientRect();
    return heading.top >= document.querySelector("header")!.getBoundingClientRect().bottom;
  });
  expect(clearsHeader).toBe(true);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`processo mantém cinco etapas e fica mais curto sem perder a animação (${colorScheme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await openHome(page);
    const isDesktop = testInfo.project.name === "desktop-1440x900";
    await navigateToProcess(page, isDesktop);
    const animated = page.locator("[data-process-animation]");
    const linear = page.getByRole("list", { name: "Etapas do projeto de energia solar" });

    if (!isDesktop) {
      await expect(animated).toBeHidden();
      await expect(linear).toBeVisible();
      await expect(linear.getByRole("listitem")).toHaveCount(5);
      for (const [index, step] of steps.entries()) {
        const item = linear.getByRole("listitem").nth(index);
        await expect(item.getByRole("heading")).toHaveText(step.title);
        await expect(item.locator("p").last()).toHaveText(step.description);
      }
      await expect(linear.getByRole("heading").first()).toBeInViewport({ ratio: 1 });
      await page.screenshot({ path: testInfo.outputPath(`process-linear-${colorScheme}.png`) });
      return;
    }

    await expect(linear).toBeHidden();
    await expect(animated).toBeVisible();
    const dimensions = await animated.evaluate((element) => ({ height: element.getBoundingClientRect().height, viewport: innerHeight }));
    expect(dimensions.height).toBeCloseTo(dimensions.viewport * 3, 0);

    for (let index = 0; index < steps.length; index += 1) {
      // The fully readable range is wider than the original 0.05–0.15 window.
      for (const fraction of [0.04, 0.16]) {
        await scrollToProgress(page, index / steps.length + fraction);
        await expectStepReadable(page, index);
      }
      if (index === 0 || index === 2 || index === 4) {
        await page.screenshot({ path: testInfo.outputPath(`process-step-${index + 1}-${colorScheme}.png`) });
      }
    }

    // Also verify that scrolling backwards restores the same readable step.
    await scrollToProgress(page, 0.3);
    await expectStepReadable(page, 1);
  });
}

test("movimento reduzido preserva as cinco etapas na lista linear, inclusive no desktop", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openHome(page);
  await navigateToProcess(page, testInfo.project.name === "desktop-1440x900");
  await expect(page.locator("[data-process-animation]")).toBeHidden();
  const list = page.getByRole("list", { name: "Etapas do projeto de energia solar" });
  await expect(list.getByRole("listitem")).toHaveCount(5);
  for (const step of steps) await expect(list.getByRole("heading", { name: step.title, exact: true })).toBeVisible();
});

test("placeholder acompanha o percurso experimental e o módulo continua sob demanda", async ({ page }, testInfo) => {
  let releaseProcess: () => void = () => {};
  const processReleased = new Promise<void>((resolve) => { releaseProcess = resolve; });
  let requested = false;
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch({ maxRetries: 1 });
    const body = await response.text();
    if (body.includes("Análise de Viabilidade") && body.includes("Geração e Compensação")) {
      requested = true;
      await processReleased;
    }
    await route.fulfill({ response, body });
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(requested).toBe(false);
    const isDesktop = testInfo.project.name === "desktop-1440x900";
    if (!isDesktop) await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("link", { name: "Processo", exact: true }).click();
    await expect.poll(() => requested).toBe(true);
    await expect(page.locator("#processo")).toHaveCount(1);
    const anchor = await page.locator("#processo").elementHandle();
    const placeholder = page.locator('[data-deferred-section="process"]');
    const height = await placeholder.evaluate((element) => element.getBoundingClientRect().height);
    expect(height).toBe(isDesktop ? 2700 : 900);

    if (isDesktop) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(placeholder).toHaveCSS("min-height", "900px");
      await page.emulateMedia({ reducedMotion: "no-preference" });
    }
    releaseProcess();
    await expect(page.locator("[data-process-animation]")).toHaveCount(1);
    await expect(placeholder).toHaveCount(0);
    await expect(page.locator("#processo")).toHaveCount(1);
    expect(await anchor!.evaluate((element) => document.getElementById("processo") === element)).toBe(true);
  } finally {
    releaseProcess();
  }
});

test("etapas animadas continuam legíveis em larguras desktop menores", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Matriz desktop executada em uma sessão.");
  await openHome(page);
  await navigateToProcess(page, true);
  for (const viewport of [{ width: 1024, height: 768 }, { width: 1280, height: 720 }]) {
    await page.setViewportSize(viewport);
    for (let index = 0; index < steps.length; index += 1) {
      await scrollToProgress(page, (index + 0.5) / steps.length);
      await expectStepReadable(page, index);
    }
    await page.screenshot({ path: testInfo.outputPath(`process-${viewport.width}x${viewport.height}.png`) });
  }
});
