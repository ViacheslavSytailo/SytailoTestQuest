import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {}

    async navigate(path: string) {
        await this.page.goto(path);
    }

    async waitForLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async goBack() {
        await this.page.goBack();
    }

    async goForward() {
        await this.page.goForward();
    }

    async expectUrl(urlPattern: string | RegExp) {
        await expect(this.page).toHaveURL(urlPattern);
    }

    getUrl(): string {
        return this.page.url();
    }
}