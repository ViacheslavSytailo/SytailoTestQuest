import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/apiHelper';
import Ajv from 'ajv';
import { API_ENDPOINTS, API_EMAILS, API_PASSWORDS, API_PAGES, invalidLoginCases, pageBoundaryCases } from '../../data/api.data';
import { testUser, updatedUser, patchUser } from '../../data/users.data';
import { userListSchema } from '../../data/schemas.data';

const ajv = new Ajv();

test.describe('API Tests: ReqRes', () => {
    let apiClient: ApiClient;

    test.beforeEach(async ({ request }) => {
        apiClient = new ApiClient(request);
    });

    // ── Auth ────────────────────────────────────────────────────────────────
    test('Successful authorization', async () => {
        const payload = { email: API_EMAILS.valid, password: API_PASSWORDS.valid };
        const response = await apiClient.post(API_ENDPOINTS.login, payload);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('token');
        expect(typeof body.token).toBe('string');
        expect(body.token.length).toBeGreaterThan(0);
    });

    // ── Parameterized negative auth ─────────────────────────────────────────
    for (const { description, payload, expectedStatus, expectedError } of invalidLoginCases) {
        test(`Failed authorization — ${description}`, async () => {
            const response = await apiClient.post(API_ENDPOINTS.login, payload);
            expect(response.status()).toBe(expectedStatus);
            const body = await response.json();
            expect(body.error).toBe(expectedError);
        });
    }

    // ── JSON Schema + Performance ────────────────────────────────────────────
    test('JSON Schema validation & response time < 2s', async () => {
        const start = Date.now();
        const response = await apiClient.get(API_ENDPOINTS.usersPage(API_PAGES.second));
        const duration = Date.now() - start;

        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(2000);

        const body = await response.json();
        const validate = ajv.compile(userListSchema);
        expect(validate(body)).toBeTruthy();
    });

    // ── Boundary: page numbers ───────────────────────────────────────────────
    for (const { page, expectedStatus } of pageBoundaryCases) {
        test(`GET /api/users?page=${page} returns HTTP ${expectedStatus}`, async () => {
            const response = await apiClient.get(API_ENDPOINTS.usersPage(page));
            expect(response.status()).toBe(expectedStatus);
            const body = await response.json();
            expect(body).toHaveProperty('data');
            expect(Array.isArray(body.data)).toBeTruthy();
        });
    }

    // ── Full CRUD Chain ──────────────────────────────────────────────────────
    test('Full CRUD chain: POST → PUT → PATCH → DELETE', async () => {
        const createResp = await apiClient.post(API_ENDPOINTS.users, testUser);
        expect(createResp.status()).toBe(201);
        const created = await createResp.json();
        expect(created.name).toBe(testUser.name);
        expect(created.job).toBe(testUser.job);
        expect(created).toHaveProperty('id');
        const userId = created.id;

        const putResp = await apiClient.put(API_ENDPOINTS.userById(userId), updatedUser);
        expect(putResp.status()).toBe(200);
        const updated = await putResp.json();
        expect(updated.job).toBe(updatedUser.job);

        const patchResp = await apiClient.patch(API_ENDPOINTS.userById(userId), patchUser);
        expect(patchResp.status()).toBe(200);
        const patched = await patchResp.json();
        expect(patched.job).toBe(patchUser.job);

        const deleteResp = await apiClient.delete(API_ENDPOINTS.userById(userId));
        expect(deleteResp.status()).toBe(204);
    });

    // ── HTTP status codes spot-check ─────────────────────────────────────────
    test('GET non-existent user returns 404', async () => {
        const response = await apiClient.get(API_ENDPOINTS.userById(9999));
        expect(response.status()).toBe(404);
    });
});