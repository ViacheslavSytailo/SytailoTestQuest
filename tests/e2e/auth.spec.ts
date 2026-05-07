import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERNAMES, PASSWORDS, AUTH_MESSAGES, invalidLoginScenarios } from '../../data/auth.data';

test.describe('E2E: Authentication', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate('/login');
    });

    test('Successful login with valid credentials', async () => {
        await loginPage.loginAs(USERNAMES.valid, PASSWORDS.valid);
        await expect(loginPage.flashMessage).toContainText(AUTH_MESSAGES.success);
        await loginPage.expectUrl(/secure/);
    });

    for (const { label, username, password, error } of invalidLoginScenarios) {
        test(`Failed login — ${label}`, async () => {
            await loginPage.loginAs(username, password);
            await expect(loginPage.flashMessage).toBeVisible();
            await expect(loginPage.flashMessage).toContainText(error);
        });
    }
});