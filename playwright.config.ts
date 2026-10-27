import { defineConfig, devices } from "@playwright/test";
import { platform } from "node:os";

const isCI = Boolean(process.env.CI);
const browserLaunchOptions = platform() === "win32" ? { channel: "msedge" as const } : {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    ...devices["Desktop Chrome"],
    launchOptions: browserLaunchOptions,
    trace: "retain-on-failure",
    baseURL: "http://127.0.0.1:3100",
  },
  projects: [
    {
      name: "web",
      testMatch: "**/*.web.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3100", launchOptions: browserLaunchOptions },
    },
    {
      name: "admin",
      testMatch: "**/*.admin.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3102", launchOptions: browserLaunchOptions },
    },
  ],
  webServer: [
    {
      command: "node e2e/mock-product-api.cjs",
      url: "http://127.0.0.1:3101/health",
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
      timeout: 180_000,
      env: {
        NEXT_TELEMETRY_DISABLED: "1",
        API_SERVER_URL: "http://127.0.0.1:3101/v1",
        NEXT_PUBLIC_API_BASE: "/v1",
      },
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 3102",
      url: "http://127.0.0.1:3102",
      cwd: "../admin",
      reuseExistingServer: false,
      timeout: 90_000,
      env: { VITE_API_BASE: "/v1" },
    },
  ],
});
