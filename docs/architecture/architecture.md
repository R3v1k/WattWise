# 🧱 Tech Stack

The Energy Cost Saving Estimator project is built using a modern full-stack architecture composed of the following technologies:

---

## 🖥️ Frontend

| Technology     | Purpose                             |
|----------------|-------------------------------------|
| **React.js**   | Main UI framework                   |
| **Vite**       | Fast build and development tooling  |
| **TypeScript** | Optional static typing              |
| **Tailwind CSS** | UI styling utility classes       |
| **Cypress**    | End-to-end testing                  |
| **Jest**       | Unit testing                        |

---

## 🔄 Backend

| Technology      | Purpose                                    |
|------------------|--------------------------------------------|
| **Spring Boot (Java 17)** | REST API & business logic layer   |
| **JUnit + Mockito**       | Backend unit testing               |
| **REST-assured**          | API integration testing            |
| **TestContainers**        | Containerized test environments    |
| **MapStruct**             | DTO–entity mapping                 |
| **Lombok**                | Code simplification (getters/setters)

---

## 🗄️ Database

| Technology     | Purpose                        |
|----------------|--------------------------------|
| **PostgreSQL** | Primary relational database    |
| **H2**         | In-memory database for testing |
| **Flyway**     | Schema versioning & migrations |

---

## ⚙️ DevOps & CI/CD

| Tool            | Purpose                                      |
|------------------|----------------------------------------------|
| **GitHub Actions** | Continuous Integration & Testing           |
| **Docker**         | Containerization for all services           |
| **GitHub Environments** | Secrets and config management        |
| **JaCoCo + Jest** | Code coverage reports                       |

---

## 🧪 QA & Testing

- **Jest**: frontend unit tests  
- **JUnit 5**: backend unit & service-layer tests  
- **Cypress**: full-stack E2E test automation  
- **Postman / REST-assured**: API integration tests  
- **Selenium (optional)**: cross-browser testing

---

## 📦 Project Structure Highlights

- Monorepo: frontend + backend in one repository
- CI: `.github/workflows/full-ci.yml`
- Test folders: `tests/unit`, `tests/integration`, `tests/e2e`
- Infrastructure-as-code: coming soon with Terraform

---

> See also the [context diagram](./context-diagram.md) and [static view](./static-view/component-diagram.svg)
