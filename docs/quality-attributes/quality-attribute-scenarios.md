# ✅ Quality Characteristics and Attribute Scenarios

This document outlines the key quality attributes we aim to achieve in the Energy Cost Saving Estimator and provides concrete scenarios to verify them.

---

## 🧱 1. Modifiability

**Definition**: The ease with which the software can accommodate changes.

**Scenario**:  
*When a new type of fuel or energy pricing model needs to be added,*  
→ *a developer can update the estimator service without affecting the UI or database schema.*

✅ Achieved by:
- Modular services (UI, API, Estimator)
- Clear interfaces (REST)
- Low coupling, high cohesion

---

## ⚙️ 2. Performance (Latency)

**Definition**: The system should respond quickly to user interactions.

**Scenario**:  
*When a user submits a new estimate request,*  
→ *the results are returned and visualized within 500ms in 90% of cases.*

✅ Achieved by:
- Asynchronous request processing
- Optimized DB queries
- Fast in-memory calculation engine

---

## 🛡 3. Security

**Definition**: Protection of sensitive data and operations.

**Scenario**:  
*When a malicious user tries to bypass input validation via the API gateway,*  
→ *the request is rejected and logged; no backend logic is executed.*

✅ Achieved by:
- Input validation at API level
- Authentication middleware
- No secrets in codebase (SOPS, `.env.enc`)

---

## 🔁 4. Reliability

**Definition**: The ability to operate without failure for a given time.

**Scenario**:  
*If the Energy Price API is temporarily unavailable,*  
→ *the system uses cached data and still returns an estimate.*

✅ Achieved by:
- Graceful degradation
- Retry and fallback logic
- Local data snapshot support

---

## 🧪 5. Testability

**Definition**: How easily the system can be tested.

**Scenario**:  
*When a change is made to the estimator logic,*  
→ *unit tests and API tests verify the change with no manual effort.*

✅ Achieved by:
- Layered architecture
- High test coverage (unit, integration, E2E)
- Mockable dependencies

---

## 🌐 6. Usability

**Definition**: How easily users can learn and interact with the system.

**Scenario**:  
*A new user visits the estimator page,*  
→ *they can complete an estimate without needing instructions or help.*

✅ Achieved by:
- Simple UI with labels and tooltips
- Clear call-to-action (“Calculate”)
- Sensible default values

---

## 📦 7. Deployability

**Definition**: How easily the software can be deployed and updated.

**Scenario**:  
*When a new version is merged into `main`,*  
→ *CI/CD automatically builds, tests, and deploys the updated system within 5 minutes.*

✅ Achieved by:
- GitHub Actions CI/CD
- Dockerized services
- Versioned releases with changelog

---
