import { APIRequestContext } from '@playwright/test';

export class ApiClient {
    constructor(private request: APIRequestContext) {}

    async get(endpoint: string) {
        return this.request.get(endpoint);
    }

    async post(endpoint: string, data: object) {
        return this.request.post(endpoint, { data });
    }

    async put(endpoint: string, data: object) {
        return this.request.put(endpoint, { data });
    }

    async patch(endpoint: string, data: object) {
        return this.request.patch(endpoint, { data });
    }

    async delete(endpoint: string) {
        return this.request.delete(endpoint);
    }
}