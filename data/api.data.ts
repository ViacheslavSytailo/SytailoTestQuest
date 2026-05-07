export const REQRES_BASE_URL = 'https://reqres.in';

export const API_ENDPOINTS = {
    users: '/api/users',
    login: '/api/login',
    userById: (id: number | string) => `/api/users/${id}`,
    usersPage: (page: number | string) => `/api/users?page=${page}`,
};

export const API_EMAILS = {
    valid: 'eve.holt@reqres.in',
    invalid: 'peter@klaven',
};

export const API_PASSWORDS = {
    valid: 'cityslicka',
};

export const API_ERRORS = {
    missingPassword: 'Missing password',
    missingEmailOrUsername: 'Missing email or username',
};

export const API_PAGES = {
    first: 1,
    second: 2,
    nonExistent: 9999,
};

export const API_PAYLOADS = {
    missingPassword:       { email: API_EMAILS.invalid },
    missingEmail:          { password: API_PASSWORDS.valid },
    empty:                 {},
};

export const invalidLoginCases = [
    {
        description:    'missing password',
        payload:        API_PAYLOADS.missingPassword,
        expectedStatus: 400,
        expectedError:  API_ERRORS.missingPassword,
    },
    {
        description:    'missing email',
        payload:        API_PAYLOADS.missingEmail,
        expectedStatus: 400,
        expectedError:  API_ERRORS.missingEmailOrUsername,
    },
    {
        description:    'empty body',
        payload:        API_PAYLOADS.empty,
        expectedStatus: 400,
        expectedError:  API_ERRORS.missingEmailOrUsername,
    },
];

export const pageBoundaryCases = [
    { page: API_PAGES.first,       expectedStatus: 200 },
    { page: API_PAGES.second,      expectedStatus: 200 },
    { page: API_PAGES.nonExistent, expectedStatus: 200 },
];
