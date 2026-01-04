# IoT Smart Greenhouse Control System

This repository contains the complete Requirements Engineering project for the **Smart Greenhouse Controller**, developed using the **Problem Frames Approach (PFA)** and the **PF2UML** methodology.

## 📖 Project Overview

The objective of this project is to model and implement an automated environmental control system for a greenhouse. The system monitors soil moisture and air temperature to ensure optimal growing conditions through autonomous irrigation and ventilation.

## 📂 Repository Structure

```text
REQ/
├── docs/                   # Modeling Artifacts
│   ├── PD2UFL_Model.json   # Exported PF2UML Model
│   ├── ProblemDiagram.png  # Problem Diagram (PFA)
│   ├── AppScreenshot.png   # Dashboard Preview
│   └── ...
├── implementation/         # Full-Stack Application
│   ├── backend/            # FastAPI + MongoDB (Dockerized)
│   ├── frontend/           # React + Tailwind Dashboard
│   └── README.md           # Implementation Guide
└── report_draft.md         # Final 5-Page Project Report
```

## 🎥 Dashboard Preview

![Smart Greenhouse Dashboard](/Users/minh/Documents/Dev/GXNU/REQ/docs/AppScreenshot.png)

## 🛠️ Methodology & Tools

1.  **Modeling (PF2UML)**: 
    *   Used the Problem Frames Approach to decompose requirements into Domain-Machine interactions.
    *   Identified **Causal Domains** (Sensors/Actuators) and **Shared Phenomena** (Inter-domain signals).
2.  **Transformation**:
    *   Exported the structural model as JSON to drive the implementation.
3.  **Implementation**:
    *   **Backend**: Python FastAPI with an asynchronous MongoDB persistence layer.
    *   **Frontend**: React.js with Tailwind CSS, providing a high-fidelity industrial dashboard.
    *   **Orchestration**: Docker Compose for manageable backend and database infrastructure.

## 🚀 Quick Start

### 1. Launch the Backend & Database
Ensure Docker is running and execute:
```bash
cd implementation
docker-compose up --build
```

### 2. Launch the Frontend
In a new terminal:
```bash
cd implementation/frontend
npm install
npm start
```

## 📝 Requirements Highlights
*   **Moisture Maintenance**: Automatically triggers watering when soil moisture drops below 40%.
*   **Temperature Regulation**: Activates ventilation fans when air temperature exceeds 30°C.
*   **Data Persistence**: All environmental transitions are logged in MongoDB for historical auditing.

---
*University: Guangxi Normal University (GXNU)*  
*Course: Requirements Engineering 2026*
