/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './playwright-tests',
  testMatch: '**/*.js',
  timeout: 30000,
  retries: 1,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        launchOptions: {
          args: ['--enable-unsafe-swiftshader']
        }
      },
    },
  ],
};

module.exports = config;
