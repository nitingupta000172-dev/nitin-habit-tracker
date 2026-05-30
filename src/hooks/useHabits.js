import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr, offsetDate } from '../lib/supabase';
import { getHabitsForDay } from '../data/habits';

export function useHabits() {
  const [checks,     setChecks]     = useState({});  // { habit_id: boolean }
  const [streaks,    setStreaks]     = useState({});  // { habit_id: { current, longest, lastDate } }
  const [loading,    setLoading]    = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle'|'saving'|'saved'|'error'
  const saveStatusTimer = useRef(null);

  // ── Helpers ───────────────────────────────────────────────
  const markSaved = () => {
    setSaveStatus('saved');
    clearTimeout(saveStatusTimer.current);
    saveStatusTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // ── Fetch today's checked habits ──────────────────────────
  // Uses toDateStr() fresh on every call — never a module-level constant.
  // Filters to checked=true only: absence of a row is the unchecked default.
  const fetchToday = useCallback(async () => {
    const today = toDateStr();
    try {
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id')
        .eq('date', today)
        .eq('checked', true);
      if (error) throw error;
      const map = {};
      data.forEach(r => { map[r.habit_id] = true; });
      setChecks(map);
    } catch (e) {
      console.warn('fetchToday:', e.message);
    }
  }, []);

  // ── Fetch streaks ─────────────────────────────────────────
  const fetchStreaks = useCallback(async (sections) => {
    const today = toDateStr();
    const ids = sections.flatMap(s => s.items.map(i => i.id));
    if (!ids.length) return;
    try {
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id, date')
        .in('habit_id', ids)
        .gte('date', offsetDate(-90))
        .eq('checked', true)
        .order('date', { ascending: false });
      if (error) throw error;

      // Group into Sets of date strings per habit
      const byId = {};
      data.forEach(r => {
        (byId[r.habit_id] ??= new Set()).add(r.date);
      });

      const result = {};
      ids.forEach(id => {
        const dates = byId[id] ?? new Set();
        const sorted = [...dates].sort(); // ascending

        // Current streak: consecutive days back from yesterday, +1 if today checked
        let current = 0;
        let cursor = offsetDate(-1);
        while (dates.has(cursor)) {
          current++;
          const d = new Date(cursor + 'T00:00:00');
          d.setDate(d.getDate() - 1);
          cursor = toDateStr(d);
        }
        if (dates.has(today)) current++;

        // Longest streak: walk all dates in order
        let longest = 0, run = 0, prev = null;
        sorted.forEach(ds => {
          const gap = prev ? (new Date(ds) - new Date(prev)) / 86400000 : null;
          run = gap === 1 ? run + 1 : 1;
          longest = Math.max(longest, run);
          prev = ds;
        });
        longest = Math.max(longest, current);

        result[id] = { current, longest, lastDate: sorted[sorted.length - 1] ?? null };
      });
      setStreaks(result);
    } catch (e) {
      console.warn('fetchStreaks:', e.message);
    }
  }, []);

  // ── Toggle: immediate save, no debounce ───────────────────
  const toggle = useCallback(async (habit_id, label) => {
    // Optimistic update
    const next = !checks[habit_id];
    setChecks(prev => ({ ...prev, [habit_id]: next }));
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('habit_checks')
        .upsert(
          { date: toDateStr(), habit_id, habit_label: label, checked: next },
          { onConflict: 'date,habit_id' }
        );
      if (error) throw error;
      markSaved();
    } catch (e) {
      console.warn('toggle save:', e.message);
      setSaveStatus('error');
      // Roll back optimistic update on failure
      setChecks(prev => ({ ...prev, [habit_id]: !next }));
    }
  }, [checks]);

  // ── Init + visibility re-fetch ────────────────────────────
  useEffect(() => {
    const day = new Date().getDay();
    const sections = getHabitsForDay(day);

    const refresh = async () => {
      await fetchToday();
      await fetchStreaks(sections);
    };

    const init = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    init();

    // Re-fetch when user returns to the app (tab focus or visibility)
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      clearTimeout(saveStatusTimer.current);
    };
  }, [fetchToday, fetchStreaks]);

  // ── Derived stats ─────────────────────────────────────────
  const sections = getHabitsForDay(new Date().getDay());
  const allItems = sections.flatMap(s => s.items);
  const done  = allItems.filter(i => checks[i.id]).length;
  const total = allItems.length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return { sections, checks, streaks, loading, saveStatus, toggle, done, total, pct };
}
