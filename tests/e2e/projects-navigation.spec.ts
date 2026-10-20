import { expect, test, type Page } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests, openAnalysisForm, openHome } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

async function expectProjectsInView(page: Page) {
  const heading = page.getByRole("heading", { name: /Projetos e bastidores da W\. Lima/ });
  await expect(heading).toBeInViewport({ ratio: 1 });
  await expect.poll(async () => {
    const headingBox = await heading.boundingBox();
    const headerBox = await page.locator("header").boundingBox();
    return Boolean(headingBox && headerBox && headingBox.y >= headerBox.y + headerBox.height);
  }).toBe(true);
  await expect.poll(() => page.locator("#projetos").evaluate((element) => {
    const offset = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    return Math.abs(element.getBoundingClientRect().top - offset);
  })).toBeLessThanOrEqual(2);
}

test("âncora dos projetos já existe no HTML sem carregar a galeria", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "HTML de servidor igual nos três viewports.");
  const response = await request.get("/");
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('id="projetos"');
  expect(html).toContain('href="#projetos"');
  expect(html).not.toContain("instalacao-w-lima.mp4");
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`instalações abrem na primeira visita com módulos atrasados e sem baixar vídeo (${colorScheme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    let releaseGallery: () => void = () => {};
    let releaseForm: () => void = () => {};
    const galleryReleased = new Promise<void>((resolve) => { releaseGallery = resolve; });
    const formReleased = new Promise<void>((resolve) => { releaseForm = resolve; });
    let galleryRequested = false;
    let formRequested = false;
    const mediaRequests: string[] = [];
    let posterRequests = 0;

    page.on("request", (request) => {
      if (request.url().includes(".mp4")) mediaRequests.push(request.url());
      if (decodeURIComponent(request.url()).includes("instalacao-w-lima-poster")) posterRequests += 1;
    });
    await page.route("**/_next/static/chunks/*.js", async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      if (body.includes("instalacao-w-lima.mp4")) {
        galleryRequested = true;
        await galleryReleased;
      }
      if (body.includes("lead-install-location") && body.includes("lead-consent")) {
        formRequested = true;
        await formReleased;
      }
      await route.fulfill({ response, body });
    });

    try {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissCookieBanner(page);
      const mainAction = page.getByRole("button", { name: "Solicitar Análise", exact: true });
      const projectsLink = page.getByRole("link", { name: "Ver instalações", exact: true });
      await expect(mainAction).toBeInViewport({ ratio: 1 });
      await expect(projectsLink).toBeInViewport({ ratio: 1 });
      await expect(page.locator("#projetos")).toHaveCount(1);
      expect(galleryRequested).toBe(false);
      expect(posterRequests).toBe(0);
      expect(mediaRequests).toHaveLength(0);
      const order = await page.evaluate(() => {
        const analysis = document.getElementById("analise")!;
        const projects = document.getElementById("projetos")!;
        return Boolean(analysis.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      expect(order).toBe(true);
      await page.screenshot({ path: testInfo.outputPath(`hero-${colorScheme}.png`) });

      await projectsLink.click();
      await expect(page).toHaveURL(/#projetos$/);
      await expect(page.locator("#projetos")).toBeFocused();
      await expect.poll(() => galleryRequested).toBe(true);
      await expect(page.getByRole("region", { name: "Carregando galeria" })).toBeVisible();
      releaseGallery();
      await expectProjectsInView(page);

      releaseForm();
      if (formRequested) await expect(page.getByLabel("Nome completo")).toBeVisible();
      await expectProjectsInView(page);
      const video = page.locator("#projetos video");
      await expect(video).toHaveAttribute("preload", "none");
      expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
      expect(mediaRequests).toHaveLength(0);
      await page.screenshot({ path: testInfo.outputPath(`projects-${colorScheme}.png`) });
    } finally {
      releaseGallery();
      releaseForm();
    }
  });
}

test("entrada direta pelo hash e navegação por teclado funcionam com movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#projetos");
  await dismissCookieBanner(page);
  await expectProjectsInView(page);

  await page.goto("/");
  await dismissCookieBanner(page);
  const link = page.getByRole("link", { name: "Ver instalações", exact: true });
  await link.focus();
  await page.keyboard.press("Enter");
  await expectProjectsInView(page);
  await expect(page.locator("#projetos")).toBeFocused();
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(beforeScroll + 100);
});

test("voltar dos projetos à análise mantém os dados e o primeiro campo acessível", async ({ page }) => {
  await openAnalysisForm(page);
  await page.getByLabel("Nome completo").fill("Pessoa de Teste");
  await page.getByLabel("Conta média de energia").fill("600,00");
  await page.getByRole("link", { name: "Ver instalações", exact: true }).click();
  await expectProjectsInView(page);
  await page.locator("#projetos").getByRole("link", { name: "Solicitar análise", exact: true }).click();
  await expect(page).toHaveURL(/#analise$/);
  await expect(page.locator("#analise")).toBeFocused();
  const name = page.getByLabel("Nome completo");
  await expect(name).toHaveValue("Pessoa de Teste");
  await expect(page.getByLabel("Conta média de energia")).toHaveValue("600,00");
  await expect(name).toBeInViewport({ ratio: 1 });
  await expect(name).not.toBeFocused();
});

test("MP4 só é requisitado depois de clicar em reproduzir", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Política de carregamento verificada uma vez.");
  const mediaRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) mediaRequests.push(request.url());
  });
  await openHome(page);
  await page.getByRole("link", { name: "Ver instalações", exact: true }).click();
  await expectProjectsInView(page);
  expect(mediaRequests).toHaveLength(0);
  const requested = page.waitForRequest((request) => request.url().includes("instalacao-w-lima.mp4"));
  await page.getByRole("button", { name: "Reproduzir vídeo da instalação", exact: true }).click();
  await requested;
});

test("rolagem do usuário cancela o alinhamento mesmo com conteúdo anterior pendente", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Cancelamento verificado com módulo de formulário pendente.");
  let releaseForm: () => void = () => {};
  const formReleased = new Promise<void>((resolve) => { releaseForm = resolve; });
  let formRequested = false;
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("lead-install-location") && body.includes("lead-consent")) {
      formRequested = true;
      await formReleased;
    }
    await route.fulfill({ response, body });
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await expect.poll(() => formRequested).toBe(true);
    await page.getByRole("link", { name: "Ver instalações", exact: true }).click();
    await expectProjectsInView(page);
    await page.mouse.wheel(0, 1000);
    const targetTop = () => page.locator("#projetos").evaluate((element) => element.getBoundingClientRect().top);
    await expect.poll(targetTop).toBeLessThan(-200);
    releaseForm();
    await expect(page.getByLabel("Nome completo")).toBeVisible();
    await expect.poll(targetTop).toBeLessThan(-100);
  } finally {
    releaseForm();
  }
});
