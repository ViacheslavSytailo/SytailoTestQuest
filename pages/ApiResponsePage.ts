import { Locator, Page, expect, Response } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object для сторінок, що відображають JSON-відповідь API.
 * Використовується в тестах перевірки відображення даних з API.
 */
export class ApiResponsePage extends BasePage {
    readonly body: Locator;

    constructor(page: Page) {
        super(page);
        this.body = page.locator('body');
    }

    async getJsonContent<T = any>(): Promise<T> {
        const text = await this.body.innerText();
        return JSON.parse(text) as T;
    }

    async expectBodyNotEmpty() {
        await expect(this.body).not.toBeEmpty();
    }

    async navigateToUrl(url: string) {
        await this.page.goto(url);
    }

    async waitForResponseAndNavigate(url: string): Promise<Response> {
        const responsePromise = this.page.waitForResponse(r => r.url() === url && r.status() === 200);
        await this.page.goto(url);
        return await responsePromise;
    }
}
