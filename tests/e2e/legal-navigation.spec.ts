import { expect, test } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests } from "./helpers";

const destinations = [
  { label: "Por que nós", id: "qualidade" },
  { label: "Processo", id: "processo" },
  { label: "FAQ", id: "faq" },
  { label: "Solicitar Análise", id: "analise" },
] as const;

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

for (const path of ["/privacidade", "/termos"]) {
  test(`cabeçalho de ${path} leva às seções da home no desktop e no menu móvel`, async ({ page }, testInfo) => {
    const desktop = testInfo.project.name === "desktop-1440x900";
    for (const destination of destinations) {
      await page.goto(path);
      await dismissCookieBanner(page);
      await expect(page.locator(`#${destination.id}`)).toHaveCount(0);
      if (!desktop) await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
      const navigation = desktop
        ? page.locator("header")
        : page.getByRole("dialog", { name: "Menu de navegação" });
      const link = navigation.getByRole("link", { name: destination.label, exact: true });
      await expect(link).toHaveAttribute("href", `/#${destination.id}`);
      await link.click();

      await expect(page).toHaveURL(new RegExp(`/#${destination.id}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Não alugue sua energia. Seja dono dela.");
      await expect(page.getByRole("dialog", { name: "Menu de navegação" })).toHaveCount(0);
      const target = page.locator(`#${destination.id}`);
      await expect(target).toHaveCount(1);
      await expect(target).toBeFocused();
      await expect(target).toBeInViewport();
      if (destination.id === "analise") {
        await expect(page.getByLabel("Nome completo")).toBeInViewport({ ratio: 1 });
        await expect(page.getByLabel("Nome completo")).not.toBeFocused();
      }
    }
    await page.screenshot({ path: testInfo.outputPath(`legal-to-home-${path.slice(1)}.png`) });
  });
}
