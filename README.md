# BELSOME — AI-Powered Grooming Intelligence Platform

> "Look Better. Feel Better. Belsome."

BELSOME is a high-fidelity startup MVP built for national hackathons and investor pitches. It connects customers, stylists, salon owners, beauty vendors, wedding professionals, and corporate HR teams into a unified Hyderabad-based beauty ecosystem.

---

## 🚀 3-Minute Judge Demo Script

To score a winning pitch in under 3 minutes, follow this exact sequence:

1. **The Hero Entrance (AI Concierge)**:
   - Go to `http://localhost:3000/`.
   - Ask the AI Grooming Concierge chat bubble: *"I have an oval face shape and need to prep for a corporate board meeting tomorrow."*
   - Show the instant customized haircut recommendations (e.g. Slicked Back Undercut) and price estimates.
2. **Visual Onboarding (Style DNA Quiz)**:
   - Click **Style DNA Quiz** in the sidebar.
   - Run the 5-question visual quiz. Select answers like *Trendy*, *Bleached Highlights*, and *Socialite*.
   - Submit and show the matching results card matching your DNA to Vikram Malhotra or Priya Rao.
3. **The Viral Factor (Be Next Hero & Look Finder)**:
   - Click **Be Next Hero** in the sidebar.
   - Click the **Virat Kohli** or **Allu Arjun** preset.
   - Show the celebrity match confidence card and the **Full Look Finder** Pinterest wardrobe recommendations.
   - Click **Download Style Card** to show the downloadable PDF-ready look sheet.
4. **Smart Booking & Glow Dynamic Pricing**:
   - Go back to **Book Appointment**. Select *Signature Haircut* and *Vikram Malhotra*.
   - In scheduling, click an off-peak slot (e.g. Monday morning) to show the price slide down by 20% under **Off-Peak Rules**.
   - Select product preferences (e.g. *Organic, Paraben-Free*) and confirm the booking.
5. **The Ecosystem Loop**:
   - Click **Salon Owner** or **Platform Admin** in the Top Demo Switcher.
   - Point out that the appointment booked in step 4 is **instantly synced** to the Owner calendar, the Stylist schedule, and the Admin gross platform charts without loading screens (powered by Zustand).
6. **The Hackathon WOW (WhatsApp QR Bot)**:
   - Click the floating green WhatsApp chat widget in the bottom right corner.
   - Type *"Book Appointment"* and show the booking completed inside 4 text bubbles, writing to the platform database.

---

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
