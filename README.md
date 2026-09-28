# ⚔️ OSRS Suite - Account Manager

A modern, high-performance web companion for Old School RuneScape (OSRS) account management, goal progression, quest tracking, and session productivity.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## 🧭 Overview

**OSRS Suite - Account Manager** is designed for players juggling mains, irons, pures, and alts who want a centralized hub to track character progress, plan long-term skill goals with mathematically exact XP curves, keep on top of quest requirements, and maintain healthy real-world gaming habits.

---

## ✨ Features

### 🏠 Command Center Dashboard
- **Active Character Overview** — Instant summary showing Combat Level (float precision), Total Level, and current Cash Stack (GP).
- **True XP Goal Tracking** — Progress bars reflect actual OSRS exponential XP curves rather than flat level ratios.
- **Recent Activity & Notes** — View your latest session notes with an automatic glowing reminder if you haven't logged notes in the last 12 hours.
- **Optimal Next Quest Engine** — Automatically analyzes your character's levels against unfinished quests to recommend the quest you're closest to starting, complete with a 1-click link to the official OSRS Wiki guide.
- **Alt-Account GE Tracker** — Lightweight widget to manually track active Grand Exchange buy/sell slots on secondary accounts.

### 📋 Character Recorder & Multi-Profile System
- **3 Character Slots** — Seamlessly toggle between your Main, Ironman, Skiller, or Alt accounts.
- **All 24 Skills** — Full stat tracking covering all standard skills plus Sailing.
- **Reactive UI & Save Feedback** — Dynamic unsaved changes detection with an animated green save button and `✓ Saved!` confirmation animations.
- **Flexible Goals System** — Add goals, prioritize them with ▲/▼ reordering, inline-edit target levels (✎ Edit), mark as finished (✓ Done), or delete.
- **Session Notes Journal** — Record daily accomplishments, drop logs, and training intentions.

### 📜 Master Quest Tracker
- **Comprehensive Quest Catalog** — Database of 115+ major OSRS quests with prerequisite skill requirements.
- **Dual Accordions** — Split into "To Do" (auto-sorted by readiness) and "✅ Completed" sections.
- **Prerequisite Validation** — Dynamically flags quests as **Ready** or **Locked** based on the active character's current stats.
- **Instant Sync & Feedback** — One-click checkboxes to toggle completion with optimistic UI updates and `✓ Saved!` feedback.
- **Global Progress Bar** — Live counter showing overall quest completion (`Completed / Total`).

### 📊 Skiller XP & Method Calculator
- Calculate exact actions and required materials between any starting and target level.
- Integrated training methods across popular skills.

### 🎲 "I'm Bored" Activity Generator
- Smart randomized activity generator weighted toward your character's lowest skills to eliminate decision paralysis.

### ⏱️ Persistent Timers & Wellness
- **Farm Run Timers** — Built-in countdowns in the sidebar for Birdhouses, Herb Runs, and Seaweed Patches.
- **Session Timer** — Real-world timer to keep session lengths conscious.
- **45-Minute Bio-Checks** — Gentle popup reminders to check posture, drink water, and check alt accounts.
- **Stale Session Sweeper** — Automatically resets session timers on reload if the app was left open for over 12 hours (e.g., across machine sleep or shutdown).

---

## 🚀 Quick Start

### Docker (Recommended)

Run the entire suite with Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend UI:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Local Development

#### Prerequisites
- Node.js 20+
- Python 3.12+

#### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will start at `http://localhost:5173` and proxy API requests to `http://localhost:8000`.

---

## 🔌 API Reference

### Characters & Progression (`/api/characters`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/characters` | List all character slots |
| `POST` | `/api/characters` | Create a character in slot 1, 2, or 3 |
| `GET` | `/api/characters/{id}` | Get full character details (stats, goals, notes, quests) |
| `PUT` | `/api/characters/{id}` | Update character name, cash stack, combat level, or skills |
| `DELETE` | `/api/characters/{id}` | Delete a character and associated data |
| `POST` | `/api/characters/{id}/goals` | Add a new skill goal |
| `PUT` | `/api/characters/{id}/goals/{goal_id}` | Edit a goal (target level, completion status) |
| `PUT` | `/api/characters/{id}/goals/reorder` | Reorder active goals by ID list |
| `DELETE` | `/api/characters/{id}/goals/{goal_id}` | Delete a goal |
| `POST` | `/api/characters/{id}/notes` | Add a session note |
| `POST` | `/api/characters/{id}/quests/toggle` | Toggle quest completion status |

### Quests (`/api/quests`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quests` | Retrieve all master quests and skill requirements |

### Skiller (`/api/skiller`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skiller/calculate` | Calculate XP, action counts, and methods between levels |

### "I'm Bored" Generator (`/api/bored`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bored/suggest/{char_id}` | Generate a recommended training or gameplay task |

---

## 🏗️ Architecture

```
┌────────────────────────────────┐     ┌────────────────────────────────┐
│        React Frontend          │     │        FastAPI Backend         │
│  (Vite + Tailwind CSS v4)      │────▶│         (Python 3.12)          │
│  - Dashboard & Command Center  │     │  - Character & Goal CRUD       │
│  - Character Recorder & Goals  │     │  - Quest Engine & Verification │
│  - Master Quest Tracker        │     │  - Skiller & Boredom APIs      │
│  - Timers & Session Context    │     └───────────────┬────────────────┘
└────────────────────────────────┘                     │
                                                ┌──────▼───────┐
                                                │    SQLite    │
                                                │ (aiosqlite)  │
                                                └──────────────┘
```

---

## 📜 License

MIT License. Old School RuneScape is a registered trademark of Jagex Ltd. This tool is an unofficial player aid.
