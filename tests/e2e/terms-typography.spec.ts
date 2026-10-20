import { expect, test } from "@playwright/test";
import { dismissCookieBanner, isolateThirdPartyRequests } from "./helpers";

const headings = [
  "Formulário, análise e proposta",
  "Propriedade Intelectual e Uso do Site",
  "Isenção de Responsabilidade e Limitações",
  "Precisão dos Materiais",
  "Links de Terceiros",
  "Modificações",
  "Lei Aplicável e Foro",
];

test.beforeEach(async ({ page }) => {
  await isolateThirdPartyRequests(page);
});

for (const theme of ["light", "dark"] as const) {
  for (const fontSize of [16, 32]) {
    test(`Termos têm hierarquia e reflow com fonte padrão ${fontSize}px (${theme})`, async ({ page, context }, testInfo) => {
      await page.emulateMedia({ colorScheme: theme });
      if (fontSize === 32) {
        const session = await context.newCDPSession(page);
        await session.send("Page.enable");
        await session.send("Page.setFontSizes", { fontSizes: { standard: fontSize } });
      }
      await page.goto("/termos");
      await dismissCookieBanner(page);
      await expect(page.locator("html")).toHaveCSS("font-size", `${fontSize}px`);
      const article = page.getByRole("article");
      await expect(article.getByRole("heading", { level: 1 })).toHaveText("Termos de Uso");
      await expect(article.getByRole("heading", { level: 2 })).toHaveText(headings);
      await expect(article.locator("p")).toHaveCount(9);
      await expect(article.getByRole("listitem")).toHaveCount(4);
      await expect(article.getByText("Última atualização: Agosto de 2026", { exact: true })).toBeVisible();

      const metrics = await article.evaluate((element) => {
        const read = (node: Element) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return {
            font: parseFloat(style.fontSize),
            weight: Number(style.fontWeight),
            margin: parseFloat(style.marginTop),
            line: parseFloat(style.lineHeight),
            top: rect.top,
            bottom: rect.bottom,
          };
        };
        const titleText = element.querySelector("h1")!.firstChild!;
        const firstWord = document.createRange();
        firstWord.setStart(titleText, 0);
        firstWord.setEnd(titleText, "Termos".length);
        return {
          titleFirstWordLines: firstWord.getClientRects().length,
          title: read(element.querySelector("h1")!),
          sections: [...element.querySelectorAll("h2")].map(read),
          paragraphs: [...element.querySelectorAll("p")].slice(1).map(read),
          order: [...element.querySelectorAll("h1,h2,p,ul")].map(read),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          contentOverflow: element.scrollWidth - element.clientWidth,
        };
      });
      const scale = fontSize / 16;
      expect(metrics.titleFirstWordLines).toBe(1);
      for (const section of metrics.sections) {
        expect(section.font).toBe(20 * scale);
        expect(section.weight).toBe(700);
        expect(section.margin).toBe(32 * scale);
        expect(metrics.title.font).toBeGreaterThan(section.font);
      }
      for (const paragraph of metrics.paragraphs) {
        expect(paragraph.font).toBe(16 * scale);
        expect(paragraph.line).toBe(28 * scale);
        expect(paragraph.margin).toBe(12 * scale);
      }
      for (let index = 1; index < metrics.order.length; index += 1) {
        expect(metrics.order[index].top - metrics.order[index - 1].bottom).toBeGreaterThanOrEqual(12 * scale - 1);
      }
      expect(metrics.overflow).toBeLessThanOrEqual(1);
      expect(metrics.contentOverflow).toBeLessThanOrEqual(1);
      await testInfo.attach("terms-typography", { body: JSON.stringify(metrics, null, 2), contentType: "application/json" });
      // A full-page viewport resize can reset Chromium's font preference during capture.
      await page.screenshot({ path: testInfo.outputPath(`terms-${theme}-font-${fontSize}.png`), fullPage: fontSize === 16 });
      await expect(page.locator("html")).toHaveCSS("font-size", `${fontSize}px`);

      const returnLink = article.getByRole("link", { name: "Voltar para a Home", exact: true });
      await returnLink.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Não alugue sua energia. Seja dono dela.");
    });
  }
}
