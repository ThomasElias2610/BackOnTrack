# BackOnTrack 🌱

**Your companion for life after treatment**

---

## The Problem

Young cancer survivors often find that the hardest part isn't treatment — it's what comes after. Brain fog, chronic fatigue, and the emotional weight of re-entering normal life can be overwhelming, yet there are almost no dedicated digital tools designed specifically for this recovery phase. Survivors are left to navigate cognitive challenges, energy crashes, and emotional setbacks with generic wellness apps that weren't built with their needs in mind.

---

## Features

### Daily Check-in
Every day, BackOnTrack invites you to log how you're feeling — your energy level, mood, any symptoms, and a note about what's on your mind. The check-in is intentionally simple and quick so it doesn't feel like a chore. Over time, these daily snapshots become a rich dataset you can look back on to understand your own patterns and share with your care team.

### Brain Exercises
Chemotherapy-related cognitive impairment — often called "chemo brain" — is one of the most common and least-discussed side effects of cancer treatment. The cognitive exercises section includes memory card games and word recall challenges designed to gently stimulate the brain each day. Sessions are short by design, tuned for days when energy and concentration are limited.

### Life Milestones
Recovery isn't linear, and progress can be hard to see when you're in the middle of it. The milestone tracker lets you record and celebrate meaningful moments — returning to work, finishing a book, going for a walk — and visualizes them on a personal timeline. These markers serve as a reminder of how far you've come.

### Smart Insights
The insights engine analyzes your check-in history to surface patterns you might not notice on your own: energy trends over rolling windows, mood-energy correlations, and week-over-week changes. Instead of raw numbers, it translates your data into plain-language observations so you can make sense of how you're doing without needing to interpret charts.

---

## Technical Decisions

**Why localStorage?** For this portfolio project, localStorage keeps the architecture simple and the app fully client-side — no backend required to demo the core experience. In a production version intended for real patients, I would replace localStorage with a Supabase backend using encrypted storage, row-level security, and full compliance with HIPAA (for US users) and Israeli privacy law (Protection of Privacy Law 5741-1981). Health data is sensitive and the storage layer would need to reflect that.

**Why Next.js 14?** Next.js is the industry-standard framework for production React applications. Using App Router with server components gave me the SSR foundation a real version of this app would need — for fast initial loads, SEO on public-facing pages, and eventual server-side data fetching from a secure backend.

**How the insights engine works:** The engine computes rolling 7-day averages for energy and mood, calculates percentage change between the current window and the previous one, and runs a simple Pearson-style correlation between daily energy and mood scores. The logic is intentionally isolated in its own module so it can be swapped out for a time-series ML model (e.g., Prophet or a lightweight LSTM) without touching the UI layer.

---

## Tech Stack

- **Next.js 14** — App Router, server components
- **TypeScript** — end-to-end type safety
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — page transitions and micro-animations
- **Recharts** — data visualization for check-in history and insights
- **localStorage** — client-side persistence (demo only)
- **html2canvas + jsPDF** — PDF export of dashboard data
- **Vercel** — deployment and hosting
- **Lucide React** — icon library

---

## Run Locally

```bash
git clone https://github.com/ThomasElias2610/BackOnTrack.git
cd backontrack
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Live Demo

[Live on Vercel →](https://back-on-track-97emvdf0t-thomaselias2610s-projects.vercel.app/)

---

## Future Improvements

- **ML-based pattern detection** — replace the rolling-average insights engine with a time-series model (e.g., Facebook Prophet or a lightweight LSTM) trained on anonymized survivor data to surface more meaningful and personalized patterns
- **Backend with encrypted storage** — migrate from localStorage to a HIPAA/privacy-law-compliant backend (Supabase or a dedicated health data provider) so the app can safely store real patient data with proper access controls and audit logging
- **Wearable device integration** — connect with Apple HealthKit and Fitbit's API to pull in resting heart rate, sleep data, and step counts automatically, eliminating the need for manual energy logging and making the insights engine significantly more accurate
