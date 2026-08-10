import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr } from '../lib/supabase';
import { KCAL_BY_ID } from '../data/diet';

// Diet check-offs are stored in the existing habit_checks table with a
// `diet:<mealId>` habit_id — no new table needed. They're kept out of the
// habit streak views (see useProgress) so the two don't mix.
const DIET_PREFIX = 'diet:';
const mealIdFromHabit = (habitId) => habitId.slice(DIET_PREFIX.length);

function monthStart() { const d = new Date(); return toDateStr(new Date(d.getFullYear(), d.getMonth(), 1)); }
function yearStart()  { const d = new Date(); return toDateStr(new Date(d.getFullYear(), 0, 1)); }

export function useDiet() {
  const [checks,     setChecks]     = useState({});   // { mealId: true } for today
  const [history,    setHistory]    = useState([]);   // [{ date, mealId }] checked, this year
  const [loading,    setLoading]    = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const saveStatusTimer = useRef(null);

  const markSaved = () => {
    setSaveStatus('saved');
    clearTimeout(saveStatusTimer.current);
    saveStatusTimer.current = setTimeout(() => setSaveStatus('idle'), 1500);
  };

  // ── Today's checked meals ─────────────────────────────────
  const fetchToday = useCallback(async () => {
    const today = toDateStr();
    try {
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id')
        .eq('date', today)
        .eq('checked', true)
        .like('habit_id', 'diet:%');
      if (error) throw error;
      const map = {};
      data.forEach(r => { map[mealIdFromHabit(r.habit_id)] = true; });
      setChecks(map);
    } catch (e) { console.warn('diet fetchToday:', e.message); }
  }, []);

  // ── This year's checked meals (for month + year totals) ───
  const fetchHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('habit_checks')
        .select('habit_id, date')
        .eq('checked', true)
        .like('habit_id', 'diet:%')
        .gte('date', yearStart())
        .order('date', { ascending: false });
      if (error) throw error;
      setHistory((data ?? []).map(r => ({ date: r.date, mealId: mealIdFromHabit(r.habit_id) })));
    } catch (e) { console.warn('diet fetchHistory:', e.message); }
  }, []);

  // ── Toggle a meal (optimistic, immediate save) ────────────
  const toggle = useCallback(async (mealId, label) => {
    const next = !checks[mealId];
    setChecks(prev => ({ ...prev, [mealId]: next }));
    setSaveStatus('saving');
    const today = toDateStr();
    try {
      const { error } = await supabase
        .from('habit_checks')
        .upsert(
          { date: today, habit_id: DIET_PREFIX + mealId, habit_label: label, checked: next },
          { onConflict: 'date,habit_id' }
        );
      if (error) throw error;
      markSaved();
      // keep the yearly history in sync without a full refetch
      setHistory(prev => {
        const without = prev.filter(h => !(h.date === today && h.mealId === mealId));
        return next ? [{ date: today, mealId }, ...without] : without;
      });
    } catch (e) {
      console.warn('diet toggle:', e.message);
      setSaveStatus('error');
      setChecks(prev => ({ ...prev, [mealId]: !next })); // roll back
    }
  }, [checks]);

  useEffect(() => {
    const refresh = () => Promise.all([fetchToday(), fetchHistory()]);
    const init = async () => { setLoading(true); await refresh(); setLoading(false); };
    init();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      clearTimeout(saveStatusTimer.current);
    };
  }, [fetchToday, fetchHistory]);

  // ── Derived totals ────────────────────────────────────────
  const kcalOf = (mealId) => KCAL_BY_ID[mealId] ?? 0;

  const todayStr   = toDateStr();
  const mStart     = monthStart();
  const todayKcal  = Object.keys(checks).filter(id => checks[id]).reduce((s, id) => s + kcalOf(id), 0);
  const todayMeals = Object.values(checks).filter(Boolean).length;

  const monthRows  = history.filter(h => h.date >= mStart);
  const yearRows   = history; // already filtered to yearStart
  const sumKcal    = (rows) => rows.reduce((s, h) => s + kcalOf(h.mealId), 0);
  const daysIn     = (rows) => new Set(rows.map(h => h.date)).size;

  const monthKcal  = sumKcal(monthRows);
  const monthDays  = daysIn(monthRows);
  const yearKcal   = sumKcal(yearRows);
  const yearDays   = daysIn(yearRows);

  return {
    checks, loading, saveStatus, toggle,
    todayKcal, todayMeals,
    monthKcal, monthDays, monthAvg: monthDays ? Math.round(monthKcal / monthDays) : 0,
    yearKcal,  yearDays,  yearAvg:  yearDays  ? Math.round(yearKcal  / yearDays)  : 0,
  };
}
