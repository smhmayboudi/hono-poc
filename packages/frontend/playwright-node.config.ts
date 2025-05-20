import { defineConfig, devices } from "@playwright/test";

const isCI = (process.env["CI"] ?? "false") === "true";
const port = 3010;

export default defineConfig({
  forbidOnly: !!isCI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      retries: 2,
      timeout: 5000,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  outputDir: "./coverage/e2e-result/",
  reporter: [
    ["html", { open: "never", outputFolder: "./coverage/e2e-html/" }],
    ["json", { outputFile: "./coverage/e2e-json.json" }],
    [
      "junit",
      {
        outputFile: "./coverage/e2e-junit.xml",
        stripANSIControlSequences: false,
      },
    ],
    ["list"],
  ],
  retries: isCI ? 2 : 0,
  testMatch: "*.spec.{js,ts}",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  webServer: {
    command: "npm exec tsx ./server/app.node.ts",
    port,
    reuseExistingServer: !isCI,
  },
  workers: isCI ? 1 : undefined,
});
