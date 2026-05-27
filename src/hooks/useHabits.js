import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr, offsetDate } from '../lib/supabase';
import { getHabitsForDay } from '../data/habits';

const TODAY = toDateStr();

export function useHabits() {
  const [checks, setChecks]         = useState({});   // { habit_id: boolean }
  const [streaks, setStreaks]        = useState({});   // { habit_id: { current, longest, lastDate } }
  const [loading, setLoading]       = useState(true);
  const [saving,  setSaving]        = useState(false);
  const saveQueue = useRef({});
  const saveTimer = useRef(null);

  // ── Fetch today's checks ─────────────────────────────────
  const fetchToday = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id, checked')
        .eq('date', TODAY);
      if (error) throw error;
      const map = {};
      data.forEach(r => { map[r.habit_id] = r.checked; });
      setChecks(map);
    } catch (e) {
      console.warn('fetchToday failed (offline?)', e.message);
    }
  }, []);

  // ── Fetch streaks for all habit_ids in today's list ──────
  const fetchStreaks = useCallback(async (sections) => {
    try {
      // Collect all habit IDs for today
      const ids = sections.flatMap(s => s.items.map(i => i.id));
      if (!ids.length) return;

      // Fetch last 90 days of checks for these habits
      const since = offsetDate(-90);
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id, date, checked')
        .in('habit_id', ids)
        .gte('date', since)
        .eq('checked', true)
        .order('date', { ascending: false });
      if (error) throw error;

      // Group by habit_id → Set of date strings
      const byId = {};
      data.forEach(r => {
        if (!byId[r.habit_id]) byId[r.habit_id] = new Set();
        byId[r.habit_id].add(r.date);
      });

      const result = {};
      ids.forEach(id => {
        const datesSet = byId[id] ?? new Set();
        const sorted = [...datesSet].sort().reverse(); // newest first

        // Current streak: consecutive days going backwards from yesterday
        let current = 0;
        let check = offsetDate(-1);
        while (datesSet.has(check)) {
          current++;
          const d = new Date(check + 'T00:00:00');
          d.setDate(d.getDate() - 1);
          check = toDateStr(d);
        }
        // If checked today already, include today in streak
        if (datesSet.has(TODAY)) current++;

        // Longest streak: walk all sorted dates
        let longest = 0, run = 0, prev = null;
        [...datesSet].sort().forEach(dateStr => {
          if (prev) {
            const gap = (new Date(dateStr) - new Date(prev)) / 86400000;
            run = gap === 1 ? run + 1 : 1;
          } else {
            run = 1;
          }
          longest = Math.max(longest, run);
          prev = dateStr;
        });

        result[id] = {
          current,
          longest: Math.max(longest, current),
          lastDate: sorted[0] ?? null,
        };
      });

      setStreaks(result);
    } catch (e) {
      console.warn('fetchStreaks failed', e.message);
    }
  }, []);

  // ── Debounced flush to Supabase ───────────────────────────
  const flushSave = useCallback(async () => {
    const queue = { ...saveQueue.current };
    saveQueue.current = {};
    if (!Object.keys(queue).length) return;

    setSaving(true);
    try {
      const rows = Object.entries(queue).map(([habit_id, { checked, label }]) => ({
        date: TODAY,
        habit_id,
        habit_label: label,
        checked,
      }));

      // Upsert: on conflict (date, habit_id) update checked
      const { error } = await supabase
        .from('habit_checks')
        .upsert(rows, { onConflict: 'date,habit_id', ignoreDuplicates: false });
      if (error) throw error;
    } catch (e) {
      console.warn('Save failed', e.message);
    } finally {
      setSaving(false);
    }
  }, []);

  // ── Toggle a habit ────────────────────────────────────────
  const toggle = useCallback((habit_id, label) => {
    setChecks(prev => {
      const next = !prev[habit_id];
      // Queue save (debounced 500ms)
      saveQueue.current[habit_id] = { checked: next, label };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flushSave, 500);
      return { ...prev, [habit_id]: next };
    });
  }, [flushSave]);

  // ── Init ─────────────────────────────────────────────────
  useEffect(() => {
    const day = new Date().getDay();
    const sections = getHabitsForDay(day);

    const init = async () => {
      setLoading(true);
      await fetchToday();
      await fetchStreaks(sections);
      setLoading(false);
    };
    init();
    return () => clearTimeout(saveTimer.current);
  }, [fetchToday, fetchStreaks]);

  // ── Derived stats ─────────────────────────────────────────
  const day = new Date().getDay();
  const sections = getHabitsForDay(day);
  const allItems = sections.flatMap(s => s.items);
  const total   = allItems.length;
  const done    = allItems.filter(i => checks[i.id]).length;
  const pct     = total ? Math.round((done / total) * 100) : 0;

  return { sections, checks, streaks, loading, saving, toggle, done, total, pct, refetchStreaks: fetchStreaks };
}
