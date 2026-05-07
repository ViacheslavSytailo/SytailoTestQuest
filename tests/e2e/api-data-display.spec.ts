import { test, expect } from '@playwright/test';
import { ApiResponsePage } from '../../pages/ApiResponsePage';
import { REQRES_BASE_URL, API_ENDPOINTS } from '../../data/api.data';

test.describe.configure({ retries: 2 });

test.describe('E2E: API Data Displayed in UI', () => {

    test('Browser-rendered user list matches direct API response', async ({ page, request }) => {
        const apiResponsePage = new ApiResponsePage(page);
        const url = `${REQRES_BASE_URL}${API_ENDPOINTS.usersPage(2)}`;

        const directResponse = await request.get(url);
        expect(directResponse.ok()).toBeTruthy();
        const directData = await directResponse.json();

        await apiResponsePage.navigateToUrl(url);
        await apiResponsePage.expectBodyNotEmpty();

        const renderedData = await apiResponsePage.getJsonContent();

        if (renderedData.page === undefined) {
            console.error('Rendered Data is missing "page" property:', renderedData);
        }

        expect(renderedData.page).toBe(directData.page);
        expect(renderedData.total).toBe(directData.total);
        expect(renderedData.data.length).toBe(directData.data.length);
        expect(renderedData.data[0].email).toBe(directData.data[0].email);
    });

    test('Browser-rendered single user matches API response', async ({ page, request }) => {
        const apiResponsePage = new ApiResponsePage(page);
        const url = `${REQRES_BASE_URL}${API_ENDPOINTS.userById(2)}`;

        const directResponse = await request.get(url);
        if (!directResponse.ok()) {
            console.error(`Direct API call failed with status: ${directResponse.status()} for URL: ${url}`);
        }
        expect(directResponse.ok()).toBeTruthy();
        const { data: directUser } = await directResponse.json();

        await apiResponsePage.navigateToUrl(url);
        await apiResponsePage.expectBodyNotEmpty();

        const renderedData = await apiResponsePage.getJsonContent();

        expect(renderedData.data.id).toBe(directUser.id);
        expect(renderedData.data.email).toBe(directUser.email);
    });

    test('Response capture: captured API response equals direct call', async ({ page, request }) => {
        const apiResponsePage = new ApiResponsePage(page);
        const url = `${REQRES_BASE_URL}${API_ENDPOINTS.usersPage(2)}`;

        const response = await apiResponsePage.waitForResponseAndNavigate(url);
        const capturedData = await response.json();

        const directResponse = await request.get(url);
        const directData = await directResponse.json();

        if (capturedData.total === undefined) {
            console.error('Captured Data is missing "total" property:', capturedData);
        }

        expect(capturedData).toBeDefined();
        expect(capturedData.total).toBe(directData.total);
        expect(capturedData.data[0].email).toBe(directData.data[0].email);
    });
});
