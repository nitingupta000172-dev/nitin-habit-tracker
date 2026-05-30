import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bmnkpyxkniunszjqcqbq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbmtweXhrbml1bnN6anFjcWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDAxODEsImV4cCI6MjA5NTQxNjE4MX0.QFeRtRNNiTUHUyLu4h0re5EW-YaxDY1HNHWqpW_prEc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

/**
 * Format a Date → 'YYYY-MM-DD' using LOCAL time, not UTC.
 * NEVER use .toISOString() — that returns UTC and produces the wrong
 * date for any timezone east of UTC between midnight and the UTC offset.
 */
export const toDateStr = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Offset today by N days → 'YYYY-MM-DD' (local time) */
export const offsetDate = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
