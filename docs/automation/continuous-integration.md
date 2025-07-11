# ⚙️ Continuous Integration (CI)

This document describes our Continuous Integration (CI) strategy, including tooling, structure, and quality gates used in the Energy Cost Saving Estimator project.

---

## 🚀 Overview

Our CI pipeline ensures that:
- Every pull request is automatically built and tested
- Code quality and formatting are validated
- Security checks run before merging
- Test coverage stays above threshold

We use **GitHub Actions** as our CI engine.

---

## 📁 CI Configuration

All CI logic is defined in:


The workflow is triggered on:
- `push` to `develop`, `main`, or `release/*` branches
- Any `pull_request` targeting these branches

---

## 🧱 CI Pipeline Steps

| Stage             | Tools                       | Description                                               |
|------------------|-----------------------------|-----------------------------------------------------------|
| 🧹 Lint / Format   | ESLint, Prettier, Checkstyle | Ensures code style and formatting                        |
| 🧪 Unit Tests      | Jest, JUnit                  | Runs unit tests for frontend/backend                      |
| 🔌 Integration     | REST-assured, TestContainers | Validates DB + API layer in isolation                     |
| 🌐 E2E Tests       | Cypress                      | Simulates real user flows                                 |
| 📦 Build Artifacts | Maven, Docker                | Compiles backend, bundles frontend, builds Docker image   |
| 📊 Coverage        | JaCoCo, Jest                 | Generates and uploads code coverage reports               |
| 🛡 Security Scan   | Dependabot, CodeQL           | Scans for vulnerable packages and logic flaws             |

---

## 🔐 Profiles & Configuration

- **Spring Boot** runs with profile: `test`
- Uses **H2** in-memory database (no external PostgreSQL needed)
- Security layer mocked via `TestSecurityConfig`
- Secrets and credentials are injected via GitHub Environments

---

## ✅ Required Checks Before Merge

All of the following must pass before merging into `main` or `develop`:

- ✅ Code formatting (Prettier/Checkstyle)
- ✅ Lint checks (ESLint for JS/TS)
- ✅ Unit + integration + E2E tests
- ✅ Code coverage ≥ 80%
- ✅ CI workflow status = green
- ✅ PR reviewed and approved

---

## 🧪 Test Matrix

We use a matrix strategy to run tests on different OS and JDK versions:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest]
    java: [17]
    node: [18]
