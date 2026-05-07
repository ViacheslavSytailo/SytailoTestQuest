import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly heading: Locator;
    readonly loginLink: Locator;
    readonly checkboxesLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.locator('h1');
        this.loginLink = page.locator('a[href="/login"]');
        this.checkboxesLink = page.locator('a[href="/checkboxes"]');
    }

    async goToLogin() {
        await this.loginLink.click();
    }

    async goToCheckboxes() {
        await this.checkboxesLink.click();
    }
}
