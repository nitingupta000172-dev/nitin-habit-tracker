-- ============================================================
-- Nitin Habit Tracker — Supabase SQL Setup
-- Paste this entire block into the Supabase SQL Editor and Run
-- ============================================================

-- 1. HABIT CHECKS
CREATE TABLE IF NOT EXISTS public.habit_checks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date        NOT NULL,
  habit_id    text        NOT NULL,
  habit_label text,
  checked     boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, habit_id)
);

-- 2. WORKOUT SETS
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date          date        NOT NULL,
  session_type  text        NOT NULL,
  exercise_name text        NOT NULL,
  set_index     int         NOT NULL,
  weight        numeric,
  reps          int,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, session_type, exercise_name, set_index)
);

-- 3. JOURNAL ENTRIES
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date        NOT NULL,
  triggered   text,
  did_instead text,
  mood        int         CHECK (mood BETWEEN 1 AND 5),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Disable RLS (single-user app, no auth required) ──────────
ALTER TABLE public.habit_checks    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries DISABLE ROW LEVEL SECURITY;

-- ── Indexes for performance ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_habit_checks_date       ON public.habit_checks (date);
CREATE INDEX IF NOT EXISTS idx_habit_checks_habit_id   ON public.habit_checks (habit_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_date       ON public.workout_sets (date);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise   ON public.workout_sets (exercise_name);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date    ON public.journal_entries (date);

-- Done ✓
