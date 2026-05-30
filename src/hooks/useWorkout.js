import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr, offsetDate } from '../lib/supabase';
import { SESSION_BY_DAY, WORKOUTS, parseMaxReps } from '../data/workouts';

export function useWorkout() {
  const day         = new Date().getDay();
  const sessionType = SESSION_BY_DAY[day];
  const session     = WORKOUTS[sessionType] ?? null;

  // todaySets: { [exerciseName]: { [setIndex]: { weight, reps } } }
  const [todaySets,    setTodaySets]    = useState({});
  const [lastSession,  setLastSession]  = useState({});
  const [lastDate,     setLastDate]     = useState(null);
  const [overload,     setOverload]     = useState({});
  const [loading,      setLoading]      = useState(true);
  const [saveStatus,   setSaveStatus]   = useState('idle');
  const [gifCache,     setGifCache]     = useState({});

  // Ref mirrors todaySets so flush callback always reads current values
  // without needing todaySets as a closure dependency.
  const todaySetsRef   = useRef({});
  const saveQueue      = useRef({});   // { 'ExName::idx': { exerciseName, setIndex } }
  const saveTimer      = useRef(null);
  const saveStatusTimer= useRef(null);

  const syncRef = (next) => { todaySetsRef.current = next; return next; };

  const markSaved = () => {
    setSaveStatus('saved');
    clearTimeout(saveStatusTimer.current);
    saveStatusTimer.current = setTimeout(() => setSaveStatus('idle'), 1500);
  };

  // ── Fetch today's logged sets ─────────────────────────────
  const fetchToday = useCallback(async () => {
    if (!session) return;
    const today = toDateStr(); // always fresh local date
    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('exercise_name, set_index, weight, reps')
        .eq('date', today)
        .eq('session_type', sessionType);
      if (error) throw error;
      const map = {};
      data.forEach(r => {
        (map[r.exercise_name] ??= {})[r.set_index] = {
          weight: r.weight ?? '',
          reps:   r.reps   ?? '',
        };
      });
      setTodaySets(syncRef(map));
    } catch (e) { console.warn('fetchToday workout:', e.message); }
  }, [session, sessionType]);

  // ── Fetch last sessions for pre-fill + overload detection ─
  const fetchLastSessions = useCallback(async () => {
    if (!session) return;
    const today = toDateStr();
    try {
      const { data: dateRows, error: de } = await supabase
        .from('workout_sets')
        .select('date')
        .eq('session_type', sessionType)
        .neq('date', today)
        .order('date', { ascending: false });
      if (de) throw de;

      const uniqueDates = [...new Set(dateRows.map(r => r.date))].slice(0, 2);
      if (!uniqueDates.length) return;

      setLastDate(uniqueDates[0]);

      // Pre-fill data from last session
      const { data: lastData, error: le } = await supabase
        .from('workout_sets')
        .select('exercise_name, set_index, weight, reps')
        .eq('date', uniqueDates[0])
        .eq('session_type', sessionType);
      if (le) throw le;

      const lastMap = {};
      lastData.forEach(r => {
        (lastMap[r.exercise_name] ??= {})[r.set_index] = {
          weight: r.weight ?? '',
          reps:   r.reps   ?? '',
        };
      });
      setLastSession(lastMap);

      // Progressive overload: were all sets at max reps in BOTH last 2 sessions?
      if (uniqueDates.length < 2) return;
      const { data: prevSets } = await supabase
        .from('workout_sets')
        .select('date, exercise_name, reps')
        .in('date', uniqueDates)
        .eq('session_type', sessionType);

      const overloadMap = {};
      session.exercises.forEach(ex => {
        const maxReps  = parseMaxReps(ex.reps);
        const relevant = (prevSets ?? []).filter(r => r.exercise_name === ex.name);
        if (!relevant.length) return;
        const byDate = {};
        relevant.forEach(r => { (byDate[r.date] ??= []).push(r.reps); });
        const allHit = Object.values(byDate).every(
          arr => arr.length > 0 && arr.every(rep => rep >= maxReps)
        );
        if (allHit && Object.keys(byDate).length >= 2) overloadMap[ex.id] = true;
      });
      setOverload(overloadMap);
    } catch (e) { console.warn('fetchLastSessions:', e.message); }
  }, [session, sessionType]);

  // ── Flush queued saves to Supabase (200ms debounce) ───────
  // Reads from todaySetsRef so it always has the latest values
  // with no stale closure dependency on todaySets state.
  const flushSets = useCallback(async () => {
    const queue = { ...saveQueue.current };
    saveQueue.current = {};
    if (!Object.keys(queue).length) return;

    const today   = toDateStr();
    const current = todaySetsRef.current;
    setSaveStatus('saving');
    try {
      await Promise.all(
        Object.values(queue).map(({ exerciseName, setIndex }) => {
          const vals = current[exerciseName]?.[setIndex] ?? {};
          return supabase.from('workout_sets').upsert(
            {
              date:          today,
              session_type:  sessionType,
              exercise_name: exerciseName,
              set_index:     setIndex,
              weight:        parseFloat(vals.weight) || null,
              reps:          parseInt(vals.reps)     || null,
            },
            { onConflict: 'date,session_type,exercise_name,set_index' }
          );
        })
      );
      markSaved();
    } catch (e) {
      console.warn('flushSets:', e.message);
      setSaveStatus('error');
    }
  }, [sessionType]);

  // ── Update a set field (called on each keystroke) ─────────
  const updateSet = useCallback((exerciseName, _exerciseId, setIndex, field, value) => {
    // Merge into state AND ref atomically via the state updater
    setTodaySets(prev => {
      const next = {
        ...prev,
        [exerciseName]: {
          ...(prev[exerciseName] ?? {}),
          [setIndex]: { ...(prev[exerciseName]?.[setIndex] ?? {}), [field]: value },
        },
      };
      todaySetsRef.current = next; // keep ref in sync

      // Queue this set for flush — store key only; flush reads from ref
      saveQueue.current[`${exerciseName}::${setIndex}`] = { exerciseName, setIndex };
      return next;
    });

    // Debounce at 200ms — tight enough to feel instant, avoids per-keystroke writes
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushSets, 200);
  }, [flushSets]);

  // ── Exercise GIF fetch (wger.de, cached in state) ─────────
  const fetchGif = useCallback(async (exerciseName) => {
    if (gifCache[exerciseName] !== undefined) return;
    setGifCache(p => ({ ...p, [exerciseName]: null }));
    try {
      const term = exerciseName.replace(/[^a-zA-Z ]/g, '').trim();
      const res  = await fetch(
        `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data   = await res.json();
      const baseId = data.suggestions?.[0]?.data?.base_id;
      if (!baseId) return;
      const imgRes  = await fetch(
        `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      const imgData = await imgRes.json();
      const url = imgData.results?.find(r => r.is_main)?.image ?? imgData.results?.[0]?.image;
      if (url) setGifCache(p => ({ ...p, [exerciseName]: url }));
    } catch (_) { /* SVG fallback shown automatically */ }
  }, [gifCache]);

  // ── Init + visibility re-fetch ────────────────────────────
  useEffect(() => {
    const refresh = () => Promise.all([fetchToday(), fetchLastSessions()]);

    const init = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    init();

    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      clearTimeout(saveTimer.current);
      clearTimeout(saveStatusTimer.current);
    };
  }, [fetchToday, fetchLastSessions]);

  return {
    sessionType, session,
    todaySets, lastSession, lastDate,
    overload, loading, saveStatus,
    gifCache, fetchGif, updateSet,
  };
}
