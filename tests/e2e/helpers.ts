import { expect, type Page } from "@playwright/test";

const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

export async function isolateThirdPartyRequests(page: Page) {
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());

    if (["127.0.0.1", "localhost"].includes(requestUrl.hostname)) {
      await route.continue();
      return;
    }

    if (requestUrl.hostname === "viacep.com.br") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ erro: true }),
      });
      return;
    }

    if (requestUrl.hostname === "tile.openstreetmap.org") {
      await route.fulfill({ status: 200, contentType: "image/png", body: TRANSPARENT_PNG });
      return;
    }

    if (
      requestUrl.hostname.endsWith("google-analytics.com") ||
      requestUrl.hostname === "www.googletagmanager.com"
    ) {
      await route.fulfill({
        status: 200,
        contentType: requestUrl.pathname.includes("gtag") ? "application/javascript" : "text/plain",
        body: requestUrl.pathname.includes("gtag") ? "window.dataLayer = window.dataLayer || [];" : "",
      });
      return;
    }

    await route.abort("blockedbyclient");
  });
}

export async function mockViaCep(page: Page, body: { erro?: boolean; uf?: string }, status = 200) {
  await page.route("https://viacep.com.br/**", async (route) => {
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  });
}

export async function dismissCookieBanner(page: Page) {
  const dialog = page.getByRole("dialog", { name: /dados de navegação/i });

  if ((await dialog.count()) > 0 && (await dialog.isVisible())) {
    await dialog.getByRole("button", { name: "Recusar" }).click();
  }
}

export async function openHome(page: Page) {
  await page.goto("/");
  await dismissCookieBanner(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

export async function openCalculator(page: Page) {
  await openHome(page);
  await page.getByRole("button", { name: "Simular Economia" }).click();
  await expect(page.getByRole("heading", { name: /Simule o Retorno/i })).toBeVisible();
}

export async function installBlockedPopupStub(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "open", {
      configurable: true,
      value: (url?: string | URL) => {
        window.sessionStorage.setItem("e2e:last-popup-url", String(url ?? ""));
        return null;
      },
    });
  });
}
