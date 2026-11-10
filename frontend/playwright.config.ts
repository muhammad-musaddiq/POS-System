import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const database = process.env.E2E_DATABASE_URL;
const password = process.env.E2E_ADMIN_PASSWORD;
if (!database || !password)
  throw new Error(
    "Set E2E_DATABASE_URL to a dedicated disposable database and E2E_ADMIN_PASSWORD before running browser tests.",
  );
process.env.DATABASE_URL = database;
process.env.ADMIN_EMAIL =
  process.env.E2E_ADMIN_EMAIL || "browser-admin@example.com";
process.env.ADMIN_PASSWORD = password;
const backendPort = Number(process.env.E2E_BACKEND_PORT || 8001);
const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 5174);
const serverEnv = {
  DATABASE_URL: database,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: password,
  UPLOAD_DIR: path.join(root, ".verification/e2e-uploads"),
};
export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    [
      "html",
      { outputFolder: path.join(root, "playwright-report"), open: "never" },
    ],
  ],
  outputDir: path.join(root, "test-results/e2e"),
  use: {
    baseURL: `http://127.0.0.1:${frontendPort}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port ${backendPort}`,
      cwd: root,
      url: `http://127.0.0.1:${backendPort}/api/v1/health`,
      env: serverEnv,
      reuseExistingServer: false,
    },
    {
      command: `npm --prefix frontend run dev -- --host 127.0.0.1 --port ${frontendPort} --strictPort`,
      cwd: root,
      url: `http://127.0.0.1:${frontendPort}`,
      env: { VITE_API_PROXY_TARGET: `http://127.0.0.1:${backendPort}` },
      reuseExistingServer: false,
    },
  ],
  projects: [
    { name: "smoke", use: { ...devices["Desktop Chrome"] } },
    { name: "regression", use: { ...devices["Desktop Chrome"] } },
    { name: "debug", use: { ...devices["Desktop Chrome"], headless: false } },
    {
      name: "demo",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        launchOptions: { slowMo: 300 },
        video: "on",
      },
    },
    { name: "training", use: { ...devices["Desktop Chrome"] } },
  ],
});
