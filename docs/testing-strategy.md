# Testing Strategy & Stack Justification

## Part 1: Language & Tool Selection

### Language Choice — TypeScript

**Why TypeScript?**

The project already has a TypeScript frontend and a Python backend.
For the test automation layer, TypeScript was chosen because:

| Factor | Rationale |
|--------|-----------|
| **Frontend alignment** | Tests for UI naturally match the same language as the frontend. Developers can own and contribute to E2E tests without context-switching. |
| **Type safety** | Catches mistakes at compile time — wrong locator types, missing API fields, mismatched schemas. |
| **Ecosystem maturity** | npm has the richest ecosystem of testing tools (Playwright, Jest, testing-library). |
| **Single runner** | Playwright Test can run both API and E2E tests in one execution, sharing configuration and reporters. No second CI step needed. |

**Why not Python (for backend alignment)?**
Python (pytest + Playwright) is a valid choice and would align with the backend team.
The trade-off: UI tests require knowledge of DOM / browser APIs, which TypeScript developers handle more naturally. With TypeScript, frontend devs can contribute to E2E tests without learning a new language.

**Trade-off summary:**

| | TypeScript | Python |
|---|---|---|
| Frontend alignment | ✅ Natural | ❌ Context switch |
| Backend alignment | ❌ Context switch | ✅ Natural |
| API testing | ✅ (Playwright APIRequestContext) | ✅ (requests / httpx) |
| E2E testing | ✅ (Playwright first-class) | ✅ (Playwright for Python) |
| Type safety | ✅ | ❌ (unless using mypy) |
| Shared runner | ✅ One `playwright test` command | ❌ Separate pytest + Playwright |

---

### Tools & Frameworks

| Layer | Tool | Reason |
|-------|------|--------|
| **E2E (UI)** | [Playwright](https://playwright.dev) | Auto-waits, multi-browser, built-in screenshot/video/trace, network interception, parallel execution |
| **API Testing** | Playwright `APIRequestContext` | Same runner, no extra setup, works with shared config and reporters |
| **Schema Validation** | [AJV](https://ajv.js.org) | Industry-standard JSON Schema validator, fastest TypeScript option |
| **Environment Config** | dotenv | Lightweight, industry-standard `.env` management |
| **Reporting** | Playwright HTML Reporter | Built-in, zero config, beautiful, includes traces and screenshots |
| **CI/CD** | GitHub Actions | Native for GitHub repos, free, well-documented |

**Why Playwright over Cypress?**

- Playwright supports multiple browsers natively (Chromium, Firefox, WebKit)
- Built-in API request context — no need for `cy.request()` workarounds
- True parallel test execution out of the box
- Better network interception (`page.route`, `page.waitForResponse`)
- No iframe limitations

---

## Part 4.2: Testing Strategy

### Where to Start Coverage on a New Project

**Priority order:**

```
1. Critical user journeys (happy paths) — highest business value
2. Authentication & authorization — security boundary
3. Core CRUD operations via API — data integrity
4. Negative cases for critical flows — prevent regressions
5. Edge cases and boundary values — polish and robustness
```

Starting with E2E happy paths provides the most visible value quickly and builds confidence in the framework.

---

### What to Test at API vs E2E Level

| Scenario | API Test | E2E Test | Reason |
|----------|----------|----------|--------|
| Login returns token | ✅ | — | Pure contract, no UI needed |
| Login error message displayed | — | ✅ | UI rendering concern |
| Schema of response body | ✅ | — | Contract testing, faster |
| CRUD operations | ✅ | — | Direct, reliable, fast |
| Form validation messages | — | ✅ | Browser rendering |
| Navigation between pages | — | ✅ | Only makes sense in browser |
| Performance / response time | ✅ | — | API layer is the bottleneck |
| Data from API shown in UI | — | ✅ | Integration concern |
| Error status codes (4xx/5xx) | ✅ | — | Protocol-level concern |

**Rule of thumb:**
- If it can be tested at API level → test it there (faster, more stable)
- If it involves rendering, user interaction, navigation → test it E2E

---

### Test Data Strategy

#### Approach: Stateless Transient Data

Since we use **reqres.in** (a mock API), all created resources are ephemeral — no cleanup needed. For real projects, apply the following strategy:

**Preparation:**
- `test.beforeEach` — create the minimum data needed for the test
- Use API calls (not UI) to set up state — faster and more reliable
- Keep test data self-contained in test files or `fixtures/`

**Isolation:**
- Each test should be independent — never rely on state from a previous test
- Use unique identifiers (timestamps, UUIDs) for test data to avoid collisions
- Separate test environments (dev / staging / prod configs) prevent pollution

**Cleanup:**
- `test.afterEach` — delete resources created during the test
- For API tests: DELETE the resource created by POST
- For E2E tests: reset state via API, not UI

#### Example data-driven fixture pattern:

```typescript
// fixtures/users.ts
export const validUser = {
  email: 'eve.holt@reqres.in',
  password: 'cityslicka',
};

export const invalidLoginCases = [
  { payload: { email: 'x@x.com' }, expectedError: 'Missing password' },
  { payload: { password: 'abc' }, expectedError: 'Missing email or username' },
];
```

---

### CI/CD Integration

The pipeline (`.github/workflows/playwright.yml`) runs on every `push` and `pull_request` to `main`.

**Steps:**
1. Checkout → Setup Node 20
2. `npm ci` — reproducible install
3. Install Playwright browsers
4. Run all tests (`npm run test:all`) with `ENV=dev` and secrets from GitHub Secrets
5. Upload Playwright HTML report as artifact (retained 30 days)

**Environment switching:**

```bash
ENV=staging npm run test:all   # uses config/.env.staging
ENV=prod    npm run test:all   # uses config/.env.prod
```

---

### Test Structure Summary

```
tests/
├── api/
│   └── users.spec.ts          # API auth, schema, CRUD chain, boundary, parameterized
└── e2e/
    ├── auth.spec.ts            # Login success + data-driven negative cases
    ├── form.spec.ts            # Form validation: positive + negative + boundary
    ├── navigation.spec.ts      # Navigation between pages
    └── api-data-display.spec.ts # Data from API rendered in UI (route interception)
```
