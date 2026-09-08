import { defineConfig } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : 3,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: isCi
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    colorScheme: "light",
    locale: "pt-BR",
    serviceWorkers: "block",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER
    ? undefined
    : {
        command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100",
        url: "http://127.0.0.1:3100",
        reuseExistingServer: !isCi,
        timeout: 120_000,
        env: {
          NEXT_PUBLIC_GA_ID: "G-TEST123",
          NEXT_TELEMETRY_DISABLED: "1",
        },
      },
  projects: [
    {
      name: "mobile-375x812",
      use: {
        viewport: { width: 375, height: 812 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "tablet-768x1024",
      use: {
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "desktop-1440x900",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
