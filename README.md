# BELSOME — AI-Powered Grooming Intelligence Platform

> "Look Better. Feel Better. Belsome."

BELSOME is a high-fidelity startup MVP built for national hackathons and investor pitches. It connects customers, stylists, salon owners, beauty vendors, wedding professionals, and corporate HR teams into a unified Hyderabad-based beauty ecosystem.


## 🛠️ Tech Stack & Architecture

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Framer Motion + Zustand (Unified Store DB)
- **Backend**: Node.js + Express.js + TypeScript + OpenAI GPT / Claude API wrapper
- **Data Layer**: Centralized Zustand store representing database collections (Users, Salons, Bookings, Products, etc.)

---

## 💻 Installation & Quickstart

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Start Express Backend
```bash
cd backend
npm install
# Set keys in .env if available, or run keyless (uses client-side rules engine fallback)
npm run dev
```

### 2. Start Vite Client
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000/` in your browser.

---

## 🐳 Optional Production Scaling (Docker)
To spin up a local PostgreSQL database and Redis cache for production-grade grading:
```bash
docker-compose up -d
```
