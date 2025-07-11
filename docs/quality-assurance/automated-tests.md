# 🧪 Automated Tests

This document describes our automated testing strategy, tools used, and the structure of our test suites.

---

## 🧱 Test Pyramid Overview

We follow the test pyramid approach:

     E2E Tests        🧪 (Cypress, Selenium)
  -------------------
 Integration Tests    🔌 (Postman, REST-assured)
---------------------
  Unit Tests          ⚙️ (Jest, JUnit, Mocha)


- **Unit Tests**: Fast and cover logic in isolation (highest volume)
- **Integration Tests**: Validate backend APIs and DB behavior
- **End-to-End (E2E) Tests**: Simulate real user scenarios in browser

---

## ✅ Tools and Frameworks

| Layer            | Language | Toolset                                |
|------------------|----------|-----------------------------------------|
| Unit (frontend)  | JavaScript | Jest, React Testing Library           |
| Unit (backend)   | Java       | JUnit, Mockito                        |
| API Integration  | Java       | REST-assured, Testcontainers          |
| E2E              | JavaScript | Cypress, Selenium WebDriver           |

---

## 🔁 CI Integration

- All tests run automatically on each pull request (`develop`, `main`)
- Unit and integration tests are executed in GitHub Actions using the `test` profile
- E2E tests run in a separate matrix job (Dockerized Chrome + mock backend)
- Minimal test profile:
  - H2 in-memory database
  - Mocked security layer (`TestSecurityConfig`)

---

## 🔐 Test Data & Fixtures

- `resources/test-data/` for JSON and SQL fixtures
- TestContainers spawns PostgreSQL and injects schema
- Cypress uses `cypress/fixtures/` and `cypress/support/commands.js`

---

## 🧪 Coverage Requirements

| Layer       | Min Coverage | Enforced in CI |
|-------------|--------------|----------------|
| Backend     | 80% lines    | ✅ via JaCoCo   |
| Frontend    | 70% lines    | ✅ via Jest     |
| E2E         | Scenario-based | ❌ (manual review) |

---

## 🧯 When Tests Fail

> If a test fails:
- Read the test output
- Check if it’s flaky or logic-related
- Re-run locally with verbose logging
- Fix, commit, and push — CI will recheck

---

## 📌 Summary

- We automate testing at all levels: unit, integration, and UI
- Tests are mandatory for all new features and fixes
- High test coverage is enforced before merging into `main`

See also:
- [Quality Attribute Scenarios](../quality-attributes/quality-attribute-scenarios.md)
- [User Acceptance Tests](./user-acceptance-tests.md)
