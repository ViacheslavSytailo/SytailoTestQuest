import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SecureAreaPage extends BasePage {
    readonly heading: Locator;
    readonly flashMessage: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.locator('h2');
        this.flashMessage = page.locator('#flash');
        this.logoutButton = page.locator('a[href="/logout"]');
    }
}
