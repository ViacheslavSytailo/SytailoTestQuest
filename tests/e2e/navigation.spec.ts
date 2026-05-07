import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { CheckboxesPage } from '../../pages/CheckboxesPage';
import { SecureAreaPage } from '../../pages/SecureAreaPage';

test.describe('E2E: Navigation', () => {

    test('Navigate from home to Login page and back', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        await homePage.navigate('/');
        await homePage.expectUrl('/');

        await homePage.goToLogin();
        await loginPage.expectUrl('/login');
        await expect(loginPage.heading).toContainText('Login Page');

        await homePage.goBack();
        await homePage.expectUrl('/');
    });

    test('Navigate from home to Checkboxes page', async ({ page }) => {
        const homePage = new HomePage(page);
        const checkboxesPage = new CheckboxesPage(page);

        await homePage.navigate('/');
        await homePage.goToCheckboxes();
        await checkboxesPage.expectUrl('/checkboxes');
        await expect(checkboxesPage.heading).toContainText('Checkboxes');
    });

    test('Navigate between multiple pages sequentially', async ({ page }) => {
        const homePage = new HomePage(page);

        await homePage.navigate('/');

        await homePage.goToLogin();
        await homePage.expectUrl('/login');

        await homePage.navigate('/');
        await homePage.goToCheckboxes();
        await homePage.expectUrl('/checkboxes');

        await homePage.navigate('/');
        await expect(homePage.heading).toContainText('Welcome to the-internet');
    });

    test('Direct URL navigation lands on correct page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const checkboxesPage = new CheckboxesPage(page);
        const homePage = new HomePage(page);

        await loginPage.navigate('/login');
        await loginPage.expectUrl('/login');

        await checkboxesPage.navigate('/checkboxes');
        await checkboxesPage.expectUrl('/checkboxes');

        await homePage.navigate('/');
        await homePage.expectUrl('/');
    });

    test('Successful login redirects to /secure page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const secureAreaPage = new SecureAreaPage(page);

        await loginPage.navigate('/login');
        await loginPage.loginAs('tomsmith', 'SuperSecretPassword!');

        await secureAreaPage.expectUrl(/secure/);
        await expect(secureAreaPage.heading).toContainText('Secure Area');
    });
});
