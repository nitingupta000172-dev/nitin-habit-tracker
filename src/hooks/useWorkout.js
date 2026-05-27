import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr, offsetDate } from '../lib/supabase';
import { SESSION_BY_DAY, WORKOUTS, parseMaxReps } from '../data/workouts';

const TODAY = toDateStr();

export function useWorkout() {
  const day         = new Date().getDay();
  const sessionType = SESSION_BY_DAY[day];
  const session     = WORKOUTS[sessionType] ?? null;

  // sets: { [exercise_id]: { [set_index]: { weight, reps } } }
  const [todaySets,   setTodaySets]   = useState({});
  const [lastSession, setLastSession] = useState({}); // same shape but from last session
  const [lastDate,    setLastDate]    = useState(null);
  const [overload,    setOverload]    = useState({}); // { exercise_id: boolean }
  const [loading,     setLoading]     = useState(true);
  const [gifCache,    setGifCache]    = useState({});

  const saveQueue = useRef({});
  const saveTimer = useRef(null);

  // ── Fetch today's logged sets ─────────────────────────────
  const fetchToday = useCallback(async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('exercise_name, set_index, weight, reps')
        .eq('date', TODAY)
        .eq('session_type', sessionType);
      if (error) throw error;

      const map = {};
      data.forEach(r => {
        if (!map[r.exercise_name]) map[r.exercise_name] = {};
        map[r.exercise_name][r.set_index] = { weight: r.weight ?? '', reps: r.reps ?? '' };
      });
      setTodaySets(map);
    } catch (e) { console.warn('fetchToday workout', e.message); }
  }, [session, sessionType]);

  // ── Fetch last two sessions for pre-fill + overload ───────
  const fetchLastSessions = useCallback(async () => {
    if (!session) return;
    try {
      // Get the 2 most recent distinct dates (excluding today) for this session type
      const { data: dateRows, error: de } = await supabase
        .from('workout_sets')
        .select('date')
        .eq('session_type', sessionType)
        .neq('date', TODAY)
        .order('date', { ascending: false });
      if (de) throw de;

      const uniqueDates = [...new Set(dateRows.map(r => r.date))].slice(0, 2);
      if (!uniqueDates.length) return;

      const lastD = uniqueDates[0];
      setLastDate(lastD);

      // Fetch sets for last date (pre-fill)
      const { data: lastSetsData, error: lse } = await supabase
        .from('workout_sets')
        .select('exercise_name, set_index, weight, reps')
        .eq('date', lastD)
        .eq('session_type', sessionType);
      if (lse) throw lse;

      const lastMap = {};
      lastSetsData.forEach(r => {
        if (!lastMap[r.exercise_name]) lastMap[r.exercise_name] = {};
        lastMap[r.exercise_name][r.set_index] = { weight: r.weight ?? '', reps: r.reps ?? '' };
      });
      setLastSession(lastMap);

      // Overload check: were all sets at max reps in BOTH last 2 sessions?
      if (uniqueDates.length < 2) return;
      const { data: prevSets } = await supabase
        .from('workout_sets')
        .select('exercise_name, reps')
        .in('date', uniqueDates)
        .eq('session_type', sessionType);

      const overloadMap = {};
      session.exercises.forEach(ex => {
        const maxReps = parseMaxReps(ex.reps);
        const relevant = (prevSets ?? []).filter(r => r.exercise_name === ex.name);
        if (!relevant.length) return;
        // Group by date
        const byDate = {};
        relevant.forEach(r => {
          const d = dateRows.find(dr => dr.date === r.date)?.date ?? 'unknown';
          if (!byDate[d]) byDate[d] = [];
          byDate[d].push(r.reps);
        });
        // Overload if in each date all reps >= maxReps
        const allDatesHit = Object.values(byDate).every(
          repsArr => repsArr.length > 0 && repsArr.every(rep => rep >= maxReps)
        );
        if (allDatesHit && Object.keys(byDate).length >= 2) overloadMap[ex.id] = true;
      });
      setOverload(overloadMap);

    } catch (e) { console.warn('fetchLastSessions', e.message); }
  }, [session, sessionType]);

  // ── Update a set field ────────────────────────────────────
  const updateSet = useCallback((exerciseName, exerciseId, setIndex, field, value) => {
    setTodaySets(prev => {
      const next = { ...prev };
      if (!next[exerciseName]) next[exerciseName] = {};
      next[exerciseName][setIndex] = { ...(next[exerciseName][setIndex] ?? {}), [field]: value };
      return next;
    });

    // Queue debounced save
    const key = `${exerciseName}__${setIndex}`;
    if (!saveQueue.current[key]) saveQueue.current[key] = {};
    saveQueue.current[key][field]    = value;
    saveQueue.current[key]._name     = exerciseName;
    saveQueue.current[key]._setIndex = setIndex;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const queue = { ...saveQueue.current };
      saveQueue.current = {};
      Object.values(queue).forEach(async (item) => {
        const { _name, _setIndex, weight, reps } = item;
        try {
          // Load existing set values to merge
          const existing = todaySets[_name]?.[_setIndex] ?? {};
          const merged   = { ...existing, [field]: value };
          await supabase.from('workout_sets').upsert({
            date:          TODAY,
            session_type:  sessionType,
            exercise_name: _name,
            set_index:     _setIndex,
            weight:        parseFloat(weight ?? merged.weight) || null,
            reps:          parseInt(reps ?? merged.reps)       || null,
          }, { onConflict: 'date,session_type,exercise_name,set_index' });
        } catch (e) { console.warn('set save', e.message); }
      });
    }, 500);
  }, [todaySets, sessionType]);

  // ── Fetch exercise GIF from wger.de ───────────────────────
  const fetchGif = useCallback(async (exerciseName) => {
    if (gifCache[exerciseName] !== undefined) return;
    setGifCache(p => ({ ...p, [exerciseName]: null })); // mark loading
    try {
      const term = exerciseName.replace(/[^a-zA-Z ]/g, '').trim();
      const res = await fetch(
        `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(term)}&language=english&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      const data = await res.json();
      const baseId = data.suggestions?.[0]?.data?.base_id;
      if (!baseId) return;

      const imgRes = await fetch(
        `https://wger.de/api/v2/exerciseimage/?exercise_base=${baseId}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );
      const imgData = await imgRes.json();
      const url = imgData.results?.find(r => r.is_main)?.image ?? imgData.results?.[0]?.image;
      if (url) setGifCache(p => ({ ...p, [exerciseName]: url }));
    } catch (_) { /* silently fall through to SVG fallback */ }
  }, [gifCache]);

  // ── Init ─────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchToday(), fetchLastSessions()]);
      setLoading(false);
    };
    init();
    return () => clearTimeout(saveTimer.current);
  }, [fetchToday, fetchLastSessions]);

  return {
    sessionType,
    session,
    todaySets,
    lastSession,
    lastDate,
    overload,
    loading,
    gifCache,
    fetchGif,
    updateSet,
  };
}
