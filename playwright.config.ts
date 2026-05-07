import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Завантаження змінних середовища залежно від ENV (dev, staging, prod)
const env = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `config/.env.${env}`) });

export default defineConfig({
    testDir: './tests',
    fullyParallel: true, // Паралелізація тестів
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 4 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]], // Налаштування репортерів

    use: {
        baseURL: process.env.BASE_UI_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        launchOptions: {
            slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
        },
        extraHTTPHeaders: {
            'x-api-key': process.env.REQRES_API_KEY || '',
        },
    },

    projects: [
        {
            name: 'chromium',
            testMatch: /.*tests[\/\\]e2e[\/\\].*\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'api',
            testMatch: /.*tests[\/\\]api[\/\\].*\.spec\.ts/,
            use: {
                baseURL: process.env.BASE_API_URL,
                extraHTTPHeaders: {
                    'x-api-key': process.env.REQRES_API_KEY || '',
                },
            },
        },
    ],
});