# Nitin Habit Tracker

A full-stack PWA habit tracker — React + Vite + Supabase + Tailwind CSS.  
Mobile-first dark theme, offline-capable, installable on iOS/Android.

---

## ① Supabase — Create Tables

Go to your Supabase project → **SQL Editor** → paste the contents of **`SUPABASE_SETUP.sql`** → click **Run**.

That creates:
- `habit_checks` — daily habit check state
- `workout_sets` — logged workout sets (weight × reps)
- `journal_entries` — urge-surfing journal entries

---

## ② Run Dev Server

```bash
cd /root/nitin-habit-tracker   # (or wherever you cloned it)
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ③ Push to GitHub

```bash
cd /root/nitin-habit-tracker

# Init git (if not already)
git init
git add .
git commit -m "feat: initial Nitin Habit Tracker PWA"

# Create repo on GitHub (requires gh CLI)
gh repo create nitin-habit-tracker --public --source=. --remote=origin --push

# OR manually:
# git remote add origin https://github.com/YOUR_USERNAME/nitin-habit-tracker.git
# git branch -M main
# git push -u origin main
```

---

## ④ Deploy to Vercel

**Option A — Vercel CLI:**
```bash
npm i -g vercel
vercel --prod
```
Follow the prompts — framework will be auto-detected as Vite.

**Option B — Vercel Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

The `vercel.json` in the repo handles SPA routing and correct SW headers.

---

## App Structure

```
src/
├── lib/supabase.js           Supabase client + date helpers
├── data/
│   ├── habits.js             All habit definitions (day-specific)
│   └── workouts.js           Workout sessions + exercise library
├── hooks/
│   ├── useHabits.js          Habit state ↔ Supabase sync
│   ├── useWorkout.js         Workout state, set logging, overload detection
│   └── useProgress.js        Streaks, charts, history aggregation
└── components/
    ├── today/                Today tab (checklist, journal modal)
    ├── workout/              Workout tab (exercise cards, set logger)
    └── progress/             Progress tab (streaks, chart, history)
```

---

## Features

| Feature | Detail |
|---|---|
| **Today tab** | Day-aware habit checklist (hair care, skincare, workout all vary by day) |
| **Circular progress ring** | Animated SVG ring showing % complete |
| **Habit streaks** | Consecutive days per habit, shown inline |
| **Workout tab** | Upper A/B · Lower A/B · Posture Day · Rest |
| **Exercise GIFs** | Fetched from wger.de API with animated SVG fallback |
| **Set logger** | Debounced saves (500 ms), pre-filled from last session |
| **Progressive overload** | Red badge when you've hit top rep range 2 sessions in a row |
| **Progress tab** | Streaks table · Weak spots (< 60%) · Recharts line chart · History |
| **Journal** | Urge-surfing modal (triggered / did instead / mood 1–5) |
| **PWA** | Installable, offline shell cached, iOS meta tags |
| **Offline** | NetworkFirst for Supabase, CacheFirst for wger |

---

*Built with React 18 · Vite · Tailwind CSS 3 · Supabase · Recharts · lucide-react · vite-plugin-pwa*

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
