import { test, expect } from '@playwright/test';
import { CheckboxesPage } from '../../pages/CheckboxesPage';
import { LoginPage } from '../../pages/LoginPage';
import { USERNAMES, PASSWORDS, AUTH_MESSAGES, formValidationScenarios } from '../../data/auth.data';

test.describe('E2E: Form Validation', () => {
    test.describe('Login form', () => {
        let loginPage: LoginPage;

        test.beforeEach(async ({ page }) => {
            loginPage = new LoginPage(page);
            await loginPage.navigate('/login');
        });

        test('Positive: valid credentials → form submits successfully', async () => {
            await loginPage.loginAs(USERNAMES.valid, PASSWORDS.valid);
            await expect(loginPage.flashMessage).toContainText(AUTH_MESSAGES.success);
            await loginPage.expectUrl(/secure/);
        });

        for (const { label, username, password, error } of formValidationScenarios) {
            test(`Negative: ${label}`, async () => {
                await loginPage.loginAs(username, password);
                await expect(loginPage.flashMessage).toBeVisible();
                await expect(loginPage.flashMessage).toContainText(error);
            });
        }
    });

    test.describe('Checkboxes form', () => {
        let checkboxesPage: CheckboxesPage;

        test.beforeEach(async ({ page }) => {
            checkboxesPage = new CheckboxesPage(page);
            await checkboxesPage.navigate('/checkboxes');
        });

        test('Positive: check unchecked checkbox', async () => {
            await checkboxesPage.checkFirstCheckbox();
            await expect(checkboxesPage.checkbox1).toBeChecked();
        });

        test('Positive: uncheck checked checkbox', async () => {
            await checkboxesPage.uncheckSecondCheckbox();
            await expect(checkboxesPage.checkbox2).not.toBeChecked();
        });

        test('Negative: double-check already-checked box keeps it checked', async () => {
            await checkboxesPage.uncheckSecondCheckbox();
            await expect(checkboxesPage.checkbox2).not.toBeChecked();
            await checkboxesPage.checkSecondCheckbox();
            await checkboxesPage.checkSecondCheckbox();
            await expect(checkboxesPage.checkbox2).toBeChecked();
        });
    });
});