# QA Automation Foundation

Automated testing framework built with **Playwright + TypeScript** covering API and E2E levels.

---

## 📁 Project Structure

```
├── config/
│   ├── .env.dev              # Dev environment (local)
│   ├── .env.staging          # Staging environment
│   ├── .env.prod             # Production environment
│   └── .env.example          # Template — safe to commit
├── data/                     # Test data (data-driven approach)
│   ├── auth.data.ts          # Usernames, passwords, messages, credentials, scenarios
│   ├── api.data.ts           # Endpoints, emails, payloads, errors, boundary cases
│   ├── users.data.ts         # CRUD user payloads
│   └── schemas.data.ts       # JSON Schema definitions (AJV)
├── docs/
│   └── testing-strategy.md  # Stack justification & test strategy (Parts 1 & 4.2)
├── pages/                    # Page Object Model classes
│   ├── BasePage.ts           # Base class: navigate, goBack, expectUrl, waitForLoad
│   ├── LoginPage.ts          # Login form interactions & locators
│   ├── HomePage.ts           # Home page navigation links
│   ├── CheckboxesPage.ts     # Checkbox interactions & locators
│   ├── SecureAreaPage.ts     # Secure area locators
│   └── ApiResponsePage.ts    # JSON response page: parse, wait, capture
├── tests/
│   ├── api/
│   │   └── users.spec.ts          # API: auth, schema, CRUD, parameterized, boundary
│   └── e2e/
│       ├── auth.spec.ts            # E2E: login success + data-driven negative cases
│       ├── form.spec.ts            # E2E: form validation (positive + negative + boundary)
│       ├── navigation.spec.ts      # E2E: page navigation
│       └── api-data-display.spec.ts # E2E: API data rendered in UI
├── utils/
│   └── apiHelper.ts          # ApiClient wrapper (GET, POST, PUT, PATCH, DELETE)
├── playwright.config.ts
└── .github/workflows/playwright.yml
```

---

## 🚀 Local Setup

### 1. Prerequisites
- Node.js **v18+**

### 2. Install

```bash
npm install
npx playwright install --with-deps
```

### 3. Configure Environment

Copy the example file and fill in your credentials:

```bash
cp config/.env.example config/.env.dev
```

```env
# config/.env.dev
BASE_UI_URL=https://the-internet.herokuapp.com
BASE_API_URL=https://reqres.in
REQRES_API_KEY=your_reqres_api_key
```

> **Note:** `.env.dev`, `.env.staging`, `.env.prod` are in `.gitignore` and will never be committed.

### 4. Run Tests

| Command | Description |
|---------|-------------|
| `npm run test:all` | Run all tests (API + E2E) |
| `npm run test:api` | API tests only |
| `npm run test:e2e` | E2E tests only |
| `npm run report` | Open HTML report in browser |

### 5. Switch Environment

```bash
ENV=staging npm run test:all
ENV=prod    npm run test:all
```

---

## ⚙️ CI/CD (GitHub Actions)

Pipeline file: `.github/workflows/playwright.yml`

- Triggers on every **push** and **pull request** to `main`
- Runs the full test suite in **Ubuntu** with **Node 20**
- `REQRES_API_KEY` is injected via **GitHub Secrets** (never stored in code)
- Playwright **HTML report** is uploaded as an artifact and retained for **30 days**

### 📊 Test Reports

After each CI run, the full Playwright HTML report is available as a downloadable artifact:

**[View latest Actions run → Artifacts → playwright-report](https://github.com/ViacheslavSytailo/SytailoTestQuest/actions)**

To open locally after downloading:
```bash
npx playwright show-report path/to/downloaded/playwright-report
```

---

## 🏗️ Architecture

### Page Object Model

All tests interact exclusively through POM classes — no raw selectors in test files.
Every page class extends `BasePage`, which provides shared navigation and assertion methods.

```
BasePage
  ├── LoginPage        — login form, flash message
  ├── HomePage         — navigation links to other pages
  ├── CheckboxesPage   — checkbox state interactions
  ├── SecureAreaPage   — post-login secure area
  └── ApiResponsePage  — JSON response parsing & network capture
```

### Data-Driven Approach

Test data is fully separated from test logic and lives in `data/` files.
Each file follows a layered structure — atomic constants first, composed objects second, scenario arrays last:

```
auth.data.ts
  USERNAMES / PASSWORDS / AUTH_MESSAGES   ← atomic values
  AUTH_CREDENTIALS                        ← composed credential pairs
  invalidLoginScenarios / formValidationScenarios  ← parameterized test cases

api.data.ts
  API_ENDPOINTS / API_EMAILS / API_PASSWORDS / API_ERRORS / API_PAGES  ← atomic
  API_PAYLOADS                            ← composed request bodies
  invalidLoginCases / pageBoundaryCases   ← parameterized test cases
```

---

## 📄 Documentation

See [`docs/testing-strategy.md`](./docs/testing-strategy.md) for:
- **Part 1** — Language & tool selection with trade-off analysis
- **Part 4.2** — Testing strategy: coverage approach, API vs E2E split, test data management

---

## 🧪 Test Coverage

| Area | Tests |
|------|-------|
| API: successful authorization | ✅ |
| API: negative auth — parameterized (3 cases) | ✅ |
| API: JSON schema validation | ✅ |
| API: response time < 2s | ✅ |
| API: full CRUD chain (POST → PUT → PATCH → DELETE) | ✅ |
| API: boundary page values (1, 2, 9999) | ✅ |
| API: 404 for non-existent resource | ✅ |
| E2E: successful login + URL redirect | ✅ |
| E2E: failed login — data-driven (4 cases) | ✅ |
| E2E: form validation (positive + negative + boundary) | ✅ |
| E2E: navigation between pages | ✅ |
| E2E: API data displayed in UI (route interception) | ✅ |
