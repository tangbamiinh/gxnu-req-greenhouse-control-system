# Master Code Generation Prompt

Use the following detailed prompt to regenerate this system from a Problem Frames JSON model.

---

## 🤖 AI Transformation Prompt

**Objective**: Act as a Senior Software Architect and Requirements Engineer. Generate a full-stack Industrial IoT application based on the provided Problem Diagram JSON schema. The system must strictly adhere to the "Machine" and "Phenomena" definitions in the model.

### 1. Architectural Requirements
- **Backend (FastAPI)**:
    - **Modular Structure**: Organizational folders: `app/core` (Machine logic), `app/api` (Endpoins), `app/schemas` (Data models).
    - **Persistence**: Integrate MongoDB via `motor` (asynchronous driver).
    - **Logic**: Implement a standalone `Machine` class that simulates environmental drift for Causal Domains and enforces Requirements for Actuators.
- **Frontend (React + Tailwind CSS)**:
    - **Visual Style**: Premium, dark-themed industrial dashboard.
    - **Features**: Real-time polling (1.5s), Lucide icons, progress bars for sensors, and a phenomena execution log showing historical state.
- **Infrastructure**:
    - **Docker Compose**: Orchestrate the Backend and MongoDB. (Exclude Frontend from Docker).
    - **Persistence Mapping**: Ensure MongoDB data is persisted via volumes.

### 2. Implementation Specifics
- **Shared Phenomena**: Map phenomena like `readingMoisture` and `turnOnPump` to specific variables in the Machine core and fields in the JSON API.
- **Requirements Logic**:
    - REQ1: Moisture < 40% -> Activate Pump.
    - REQ2: Temp > 30°C -> Activate Fan.
    - REQ-Safety: Pulse Pump off if running > 15 mins.
- **Persistence**: Store every "step" of the machine execution into a MongoDB collection named `history`.

### 3. File List to Generate
1. `backend/app/core/machine.py` (The logic)
2. `backend/app/api/endpoints.py` (The phenomena interface)
3. `backend/app/main.py` (FastAPI setup + DB lifecycle)
4. `backend/run.py` (Launcher)
5. `backend/Dockerfile`
6. `frontend/src/App.jsx` (Tailwind Dashboard)
7. `frontend/package.json` & `tailwind.config.js`
8. `docker-compose.yml` (Backend + MongoDB)
9. `backend/tests/` (Pytest unit/integration tests)
10. `frontend/src/__tests__/` (Vitest component tests)

**Input JSON Model**: `PD2UFL_Model.json`

---
