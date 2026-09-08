import { expect, test } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests } from "./helpers";

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

test("home publica metadados, dados estruturados e cabeçalhos de segurança", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Validação única, independente do viewport.");

  const response = await page.goto("/");
  await dismissCookieBanner(page);

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Energia Solar para Residências e Empresas/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://wlimasolucoes.com.br");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /projetos de energia solar/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.jpg$/);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const localBusiness = schemas.map((schema) => JSON.parse(schema)).find((schema) => schema["@type"] === "LocalBusiness");

  expect(localBusiness).toMatchObject({
    name: "W. Lima Soluções",
    taxID: "59.652.464/0001-25",
    url: "https://wlimasolucoes.com.br",
  });
  expect(localBusiness.areaServed).toHaveLength(7);
  expect(localBusiness.areaServed.map((area: { name: string }) => area.name)).toContain("Cambuci, RJ");

  const headers = response?.headers() ?? {};
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy-report-only"]).toContain("frame-ancestors 'none'");
});

test("páginas legais respondem com canonical e título próprios", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Validação única, independente do viewport.");

  const legalPages = [
    { path: "/privacidade", heading: "Política de Privacidade" },
    { path: "/termos", heading: "Termos de Uso" },
  ];

  for (const legalPage of legalPages) {
    const response = await page.goto(legalPage.path);
    await dismissCookieBanner(page);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: legalPage.heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://wlimasolucoes.com.br${legalPage.path}`,
    );
  }
});

test("robots e sitemap anunciam apenas as rotas públicas", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "Validação única, independente do viewport.");

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBeTruthy();
  const robots = await robotsResponse.text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain("Sitemap: https://wlimasolucoes.com.br/sitemap.xml");

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();
  const sitemap = await sitemapResponse.text();
  expect(sitemap).toContain("https://wlimasolucoes.com.br");
  expect(sitemap).toContain("https://wlimasolucoes.com.br/privacidade");
  expect(sitemap).toContain("https://wlimasolucoes.com.br/termos");
});
