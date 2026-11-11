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
  await expect(page).toHaveTitle(/Energia Solar em Cambuci e Região, RJ \| W\. Lima Soluções/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://wlimasolucoes.com.br");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /energia solar em Cambuci/i);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /og-image\.jpg$/);
  await expect(page.locator('link[rel="icon"][href*="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"][type="image/png"]')).toHaveAttribute("sizes", "192x192");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("sizes", "180x180");

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsedSchemas = schemas.map((schema) => JSON.parse(schema));
  const localBusiness = parsedSchemas.find((schema) => schema["@type"] === "LocalBusiness");
  const videoObject = parsedSchemas.find((schema) => schema["@type"] === "VideoObject");

  expect(localBusiness).toMatchObject({
    name: "W. Lima Soluções",
    additionalType: "https://schema.org/Electrician",
    taxID: "59.652.464/0001-25",
    url: "https://wlimasolucoes.com.br",
    hasMap: "https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7",
    priceRange: "$$",
    address: {
      streetAddress: "Rua Virgilio Franklin, 915",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -21.5762274,
      longitude: -41.912293,
    },
  });
  expect(videoObject).toMatchObject({
    "@type": "VideoObject",
    contentUrl: "https://wlimasolucoes.com.br/images/instalacao-w-lima.mp4",
    thumbnailUrl: "https://wlimasolucoes.com.br/images/instalacao-w-lima-poster-v2.jpg",
    duration: "PT14S",
  });
  await expect(page.locator("#footer")).toContainText("Rua Virgilio Franklin, 915");
  await expect(page.locator('#footer a[href="tel:+5522999618883"]')).toHaveText("(22) 99961-8883");
  await expect(page.locator('#footer a[href="https://maps.app.goo.gl/JbvTH7mcU1W2RpPz7"]')).toHaveText("Ver localização no Google Maps");
  await expect(page.locator("#hero")).toContainText(/Cambuci e no RJ/i);
  await expect(page.locator("#qualidade")).toContainText(/telhado ou solo/i);
  await expect(page.locator("#faq")).toContainText(/propriedades rurais/i);
  await expect(page.locator("#faq")).toContainText(/homologação do sistema junto à concessionária/i);
  expect(localBusiness.areaServed).toHaveLength(7);
  expect(localBusiness.areaServed.map((area: { name: string }) => area.name)).toContain("Cambuci, RJ");

  const headers = response?.headers() ?? {};
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toBe("max-age=63072000; includeSubDomains; preload");
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
    if (legalPage.path === "/privacidade") {
      await expect(page.locator("main")).toContainText("Rua Virgilio Franklin, 915, Centro, Cambuci/RJ");
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThanOrEqual(120);
    }
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
