# How I Built BackOnTrack 🌱

After chemotherapy, life doesn't just return to normal. Nobody tells you about the part that comes after: the brain fog that makes reading code feel like reading a foreign language, the fatigue that turns a 2-hour study session into a 20-minute one, the strange grief of trying to return to a normal life you're not sure you remember how to live.

I looked for an app that could help track all of this. I didn't find one that felt human. So I built it.

---

## What the App Does

BackOnTrack is a progressive web app for young adult cancer survivors navigating life after treatment. It has four features:

- **Daily check-in** — a 30-second, 4-step flow to log energy, brain fog, mood, and a note. Designed to be low-friction enough to actually do every day.
- **Cognitive exercises** — two games (Memory Cards and Word Recall) built specifically around the kinds of deficits chemo-brain causes: visual memory and short-term verbal recall. Both track scores over time.
- **Smart insights** — after 7 days of data, the app generates 2–3 observations automatically. Not from an AI API — from actual math on the user's own data (rolling averages, percentage change detection, mood-energy correlation).
- **Life milestones** — a visual timeline of 10 return-to-life moments, like "first workout" or "first day you forgot about cancer." Users can mark them complete and add their own.

---

## Technical Decisions Worth Explaining

**Why localStorage instead of a database?**
This is a portfolio project, not a production app — a backend would add auth, hosting costs, and deployment complexity without demonstrating anything new. The more interesting answer is what I'd do *in production*: Supabase with row-level encryption, given that this data is sensitive health information subject to Israeli privacy law (and HIPAA-equivalent standards if expanding internationally). I documented that tradeoff explicitly rather than pretending localStorage was the right long-term answer.

**How the insights engine works**
`generateInsights()` in `src/lib/insights.ts` is the part of this project I'm most proud of technically. It runs five independent detectors on the stored check-in data:

1. **Trend detection** — compares this week's rolling average energy/brain fog to last week's. If the change exceeds 15%, it surfaces an insight.
2. **Mood-energy correlation** — checks whether days with a positive mood emoji co-occur with above-average energy scores. If the correlation holds, it tells the user.
3. **Exercise progress** — looks at whether scores improved in 3 of the last 4 sessions.
4. **Streak acknowledgment** — if the user has checked in 7+ consecutive days, it surfaces that explicitly (consistency is the most important input for pattern detection).
5. **Low-point alert** — if energy was 1 or 2 for 3+ consecutive days, it flags it gently and suggests mentioning it at the next appointment.

All five run on every dashboard load. Results are sorted by statistical significance (largest percentage change first) and capped at 3. The whole thing is well-commented with JSDoc — I wanted it to be readable in an interview, not just functional.

**Why Next.js 14?**
File-based routing, App Router, TypeScript-first, deploys to Vercel in one click. It's what most Israeli product companies are running or moving toward, and I wanted to demonstrate I can work in that environment, not just in vanilla React.

---

## What I'd Add Next

- Replace `generateInsights()` with a lightweight time-series regression model — the current percentage-change approach is honest but crude. A simple ARIMA or even linear regression over the rolling window would catch subtler trends.
- Backend with encrypted storage so data persists across devices — the localStorage approach means clearing your browser wipes your recovery history, which is a real problem for actual users.
- Wearable integration (Apple Health, Fitbit API) for passive energy tracking, so users don't have to self-report everything.

---

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Recharts · localStorage · html2canvas + jsPDF · Lucide React · Vercel

---


