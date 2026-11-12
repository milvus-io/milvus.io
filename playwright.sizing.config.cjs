const { defineConfig } = require('@playwright/test');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:8000';

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['sizing-controls.test.js', 'sizing-issue-2521.test.js', 'sizing-v300.test.js'],
  outputDir: '/tmp/milvus-sizing-test-results',
  timeout: 60_000,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'pnpm exec next dev --hostname 127.0.0.1 --port 8000',
    url: `${baseURL}/tools/sizing-v300`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_TELEMETRY_DISABLED: '1' },
  },
});
