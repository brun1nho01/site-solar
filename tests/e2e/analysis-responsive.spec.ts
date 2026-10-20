import { expect, test, type Page } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests, openAnalysisForm, openHome } from "./helpers";

const privacyText = "O site não armazena este formulário em banco de dados próprio.";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

async function expectFirstFieldInView(page: Page) {
  const name = page.getByLabel("Nome completo");
  const label = page.locator('label[for="lead-name"]');
  await expect(name).toBeInViewport({ ratio: 1 });
  await expect(label).toBeInViewport({ ratio: 1 });
  await expect(name).not.toBeFocused();
  await expect.poll(async () => {
    const fieldBox = await label.boundingBox();
    const headerBox = await page.locator("header").boundingBox();
    return Boolean(fieldBox && headerBox && fieldBox.y >= headerBox.y + headerBox.height);
  }).toBe(true);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`apresentação do formulário se adapta sem esconder o primeiro campo (${colorScheme})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme });
    await openAnalysisForm(page);
    await expectFirstFieldInView(page);

    const isDesktop = testInfo.project.name === "desktop-1440x900";
    const panel = page.getByTestId("analysis-intro-panel");
    const compactTitle = page.getByRole("heading", { name: "Solicite sua análise solar", exact: true });
    const form = page.locator("form");

    if (isDesktop) {
      await expect(panel).toBeVisible();
      await expect(compactTitle).toBeHidden();
      await expect(form.getByRole("heading", { name: "Conte um pouco sobre o projeto" })).toBeVisible();
      await expect(panel.getByText(privacyText, { exact: true })).toBeVisible();
      await expect(form.getByText(privacyText, { exact: true })).toBeHidden();
    } else {
      await expect(panel).toBeHidden();
      await expect(compactTitle).toBeVisible();
      await expect(form.getByRole("heading")).toHaveCount(1);
      await expect(form.getByText("Preencha os dados do imóvel e revise a mensagem no WhatsApp antes de enviar.")).toBeVisible();
      await expect(form.getByText(/Leva cerca de um minuto/)).toBeHidden();
      const privacy = form.getByText(privacyText, { exact: true });
      await expect(privacy).toBeVisible();
      const beforeConsent = await privacy.evaluate((element) => {
        const consent = document.getElementById("lead-consent");
        return Boolean(consent && element.compareDocumentPosition(consent) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      expect(beforeConsent).toBe(true);
    }

    const layout = await page.evaluate(() => {
      const input = document.getElementById("lead-name")!;
      const card = input.closest("form")!.parentElement!.parentElement!;
      const heading = [...card.querySelectorAll("h2")].find((element) => element.getBoundingClientRect().height > 0)!;
      const rect = input.getBoundingClientRect();
      return {
        viewport: { width: innerWidth, height: innerHeight },
        firstField: { top: rect.top, bottom: rect.bottom },
        distanceFromCardTop: rect.top - card.getBoundingClientRect().top,
        heading: heading.textContent?.trim(),
        inputFontSize: getComputedStyle(input).fontSize,
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(layout.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(Number.parseFloat(layout.inputFontSize)).toBeGreaterThanOrEqual(16);
    await testInfo.attach("form-layout", { body: JSON.stringify(layout, null, 2), contentType: "application/json" });
    await page.screenshot({ path: testInfo.outputPath(`analysis-${colorScheme}.png`) });
  });
}

test("CTA do menu também chega ao primeiro campo sem abrir o teclado", async ({ page }, testInfo) => {
  await openHome(page);
  if (testInfo.project.name === "desktop-1440x900") {
    await page.locator("header").getByRole("link", { name: "Solicitar Análise" }).click();
  } else {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu de navegação" });
    await menu.getByRole("link", { name: "Solicitar Análise" }).click();
    await expect(menu).toBeHidden();
  }
  await expectFirstFieldInView(page);
});

test("rolagem natural encontra o formulário mesmo com o módulo atrasado", async ({ page }) => {
  let releaseModule: () => void = () => {};
  const moduleReleased = new Promise<void>((resolve) => { releaseModule = resolve; });
  let moduleRequested = false;

  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("lead-install-location") && body.includes("lead-consent")) {
      moduleRequested = true;
      await moduleReleased;
    }
    await route.fulfill({ response, body });
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissCookieBanner(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.mouse.wheel(0, 900);
    await expect.poll(() => moduleRequested).toBe(true);
    await expect(page.getByRole("region", { name: "Carregando formulário de atendimento" })).toBeVisible();
    await expect(page.getByLabel("Nome completo")).toHaveCount(0);

    releaseModule();
    await expectFirstFieldInView(page);
  } finally {
    releaseModule();
  }
});

test("apresentação respeita a fronteira de layout e telas estreitas sem perder dados", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Variações de largura verificadas em uma única sessão.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openAnalysisForm(page);
  await page.getByLabel("Nome completo").fill("Pessoa de Teste");

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 812, height: 375 },
    { width: 1023, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const compact = viewport.width < 1024;
    await expect(page.getByTestId("analysis-intro-panel")).toBeVisible({ visible: !compact });
    await expect(page.getByRole("heading", { name: "Solicite sua análise solar" })).toBeVisible({ visible: compact });
    await expect(page.getByLabel("Nome completo")).toHaveValue("Pessoa de Teste");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.locator("#analise").evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
    await page.screenshot({ path: testInfo.outputPath(`analysis-${viewport.width}x${viewport.height}.png`) });
  }
});
