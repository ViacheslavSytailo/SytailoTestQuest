import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
    readonly heading: Locator;
    readonly checkbox1: Locator;
    readonly checkbox2: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.locator('h3');
        this.checkbox1 = page.locator('input[type="checkbox"]').first();
        this.checkbox2 = page.locator('input[type="checkbox"]').nth(1);
    }

    async checkFirstCheckbox() {
        await this.checkbox1.check();
    }

    async uncheckSecondCheckbox() {
        await this.checkbox2.uncheck();
    }

    async checkSecondCheckbox() {
        await this.checkbox2.check();
    }
}