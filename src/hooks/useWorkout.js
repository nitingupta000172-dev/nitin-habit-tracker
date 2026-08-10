import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, toDateStr } from '../lib/supabase';
import { WORKOUTS, parseMaxReps } from '../data/workouts';

// Manual upsert by natural key. The deployed workout_sets table is missing the
// UNIQUE(date,session_type,exercise_name,set_index) constraint, so PostgREST's
// native .upsert({onConflict}) returns 400 (42P10) and nothing saves. We emulate
// upsert: UPDATE by natural key, INSERT if no row existed, with a race-safe
// fallback to UPDATE if a concurrent insert beat us.
async function saveSet(row) {
  const key = {
    date: row.date, session_type: row.session_type,
    exercise_name: row.exercise_name, set_index: row.set_index,
  };
  const fields = { weight: row.weight, reps: row.reps };

  const upd = await supabase.from('workout_sets').update(fields).match(key).select('id');
  if (upd.error) throw upd.error;
  if (upd.data?.length) return;

  const ins = await supabase.from('workout_sets').insert(row);
  if (ins.error) {
    const retry = await supabase.from('workout_sets').update(fields).match(key).select('id');
    if (retry.error) throw retry.error;
    if (!retry.data?.length) throw ins.error;
  }
}

/**
 * Per-session workout logger.
 *
 * @param {string} sessionType  the session the user is currently viewing
 *   (e.g. 'Upper A'). Passed in from WorkoutTab instead of being derived
 *   from the calendar day, so you can open and log ANY session.
 *
 * Save-race fix: fetchToday used to overwrite in-progress typing every time
 * the app regained focus (constant on a mobile PWA), clobbering unsaved sets
 * and letting the debounced flush write stale values. We now track "dirty"
 * (unsaved) sets and merge DB values UNDER local edits on refetch, and we
 * flush pending saves when the app is hidden or unloaded.
 */
export function useWorkout(sessionType) {
  const session = WORKOUTS[sessionType] ?? null;

  // todaySets: { [exerciseName]: { [setIndex]: { weight, reps } } }
  const [todaySets,   setTodaySets]   = useState({});
  const [lastSession, setLastSession] = useState({});
  const [lastDate,    setLastDate]    = useState(null);
  const [overload,    setOverload]    = useState({});
  const [loading,     setLoading]     = useState(true);
  const [saveStatus,  setSaveStatus]  = useState('idle');
  const [gifCache,    setGifCache]    = useState({});

  const todaySetsRef    = useRef({});
  const saveQueue       = useRef({});          // { 'ExName::idx': { exerciseName, setIndex } }
  const dirtyKeys       = useRef(new Set());   // keys with unsaved local edits — never clobbered on refetch
  const flushing        = useRef(false);       // guard: only one flush drains the queue at a time
  const saveTimer       = useRef(null);
  const saveStatusTimer = useRef(null);

  const syncRef = (next) => { todaySetsRef.current = next; return next; };

  const markSaved = () => {
    setSaveStatus('saved');
    clearTimeout(saveStatusTimer.current);
    saveStatusTimer.current = setTimeout(() => setSaveStatus('idle'), 1500);
  };

  // ── Fetch today's logged sets ─────────────────────────────
  // Merges DB values UNDER any dirty (unsaved) local edits so refetch-on-focus
  // never wipes what you're currently typing.
  const fetchToday = useCallback(async () => {
    if (!session) return;
    const today = toDateStr();
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

      // Overlay dirty local edits on top of the DB snapshot.
      const local = todaySetsRef.current;
      dirtyKeys.current.forEach(key => {
        const [exName, idxStr] = key.split('::');
        const idx = Number(idxStr);
        const localVal = local[exName]?.[idx];
        if (localVal) (map[exName] ??= {})[idx] = localVal;
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
      if (!uniqueDates.length) { setLastDate(null); setLastSession({}); setOverload({}); return; }

      setLastDate(uniqueDates[0]);

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

      // Progressive overload: all sets at max reps across BOTH last 2 sessions?
      if (uniqueDates.length < 2) { setOverload({}); return; }
      const { data: prevSets } = await supabase
        .from('workout_sets')
        .select('date, exercise_name, reps')
        .in('date', uniqueDates)
        .eq('session_type', sessionType);

      const overloadMap = {};
      session.exercises.forEach(exItem => {
        const maxReps  = parseMaxReps(exItem.reps);
        const relevant = (prevSets ?? []).filter(r => r.exercise_name === exItem.name);
        if (!relevant.length) return;
        const byDate = {};
        relevant.forEach(r => { (byDate[r.date] ??= []).push(r.reps); });
        const allHit = Object.values(byDate).every(
          arr => arr.length > 0 && arr.every(rep => rep >= maxReps)
        );
        if (allHit && Object.keys(byDate).length >= 2) overloadMap[exItem.id] = true;
      });
      setOverload(overloadMap);
    } catch (e) { console.warn('fetchLastSessions:', e.message); }
  }, [session, sessionType]);

  // ── Flush queued saves to Supabase (200 ms debounce) ──────
  // Serialized: only ONE flush runs at a time and it drains the queue in a
  // loop. Overlapping flushes are what could otherwise race the manual
  // update-then-insert into duplicate rows while the DB constraint is absent.
  const flushSets = useCallback(async () => {
    if (flushing.current) return;                       // a flush is already draining the queue
    if (!Object.keys(saveQueue.current).length) return;
    flushing.current = true;
    setSaveStatus('saving');
    let hadError = false;
    try {
      while (Object.keys(saveQueue.current).length) {
        const queue = { ...saveQueue.current };
        saveQueue.current = {};
        const keys    = Object.keys(queue);
        const today   = toDateStr();
        const current = todaySetsRef.current;
        try {
          await Promise.all(
            Object.values(queue).map(({ exerciseName, setIndex }) => {
              const vals = current[exerciseName]?.[setIndex] ?? {};
              return saveSet({
                date:          today,
                session_type:  sessionType,
                exercise_name: exerciseName,
                set_index:     setIndex,
                weight:        vals.weight === '' || vals.weight == null ? null : parseFloat(vals.weight),
                reps:          vals.reps   === '' || vals.reps   == null ? null : parseInt(vals.reps, 10),
              });
            })
          );
          keys.forEach(k => { if (!saveQueue.current[k]) dirtyKeys.current.delete(k); });
        } catch (e) {
          console.warn('flushSets:', e.message);
          keys.forEach(k => { saveQueue.current[k] ??= queue[k]; }); // re-queue for retry
          hadError = true;
          break;
        }
      }
    } finally {
      flushing.current = false;
    }
    if (hadError) setSaveStatus('error'); else markSaved();
  }, [sessionType]);

  // ── Update a set field (called on each keystroke) ─────────
  const updateSet = useCallback((exerciseName, _exerciseId, setIndex, field, value) => {
    const key = `${exerciseName}::${setIndex}`;
    setTodaySets(prev => {
      const next = {
        ...prev,
        [exerciseName]: {
          ...(prev[exerciseName] ?? {}),
          [setIndex]: { ...(prev[exerciseName]?.[setIndex] ?? {}), [field]: value },
        },
      };
      todaySetsRef.current = next;
      saveQueue.current[key] = { exerciseName, setIndex };
      dirtyKeys.current.add(key);
      return next;
    });
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushSets, 200);
  }, [flushSets]);

  // ── Exercise GIF fetch (wger.de, cached in state) ─────────
  const fetchGif = useCallback(async (exerciseName) => {
    if (gifCache[exerciseName] !== undefined) return;
    setGifCache(p => ({ ...p, [exerciseName]: null }));
    try {
      // Match on the core movement name: drop qualifiers after an em-dash
      // ("— HSR tempo") and parentheticals ("(neutral grip)") so wger finds it.
      const term = exerciseName
        .split('—')[0]
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
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

  // ── Init + visibility handling (per selected session) ─────
  useEffect(() => {
    // Reset per-session in-progress state when the selected session changes.
    // (Refs only — the loading skeleton masks stale data until fetchToday lands,
    // so no synchronous setState needed here.)
    saveQueue.current = {};
    dirtyKeys.current = new Set();
    todaySetsRef.current = {};

    const refresh = () => Promise.all([fetchToday(), fetchLastSessions()]);

    const init = async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    };
    init();

    const onVisible = () => {
      if (document.visibilityState === 'hidden') flushSets();  // save before leaving
      else refresh();
    };
    const onHide = () => flushSets();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    window.addEventListener('pagehide', onHide);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pagehide', onHide);
      clearTimeout(saveTimer.current);
      clearTimeout(saveStatusTimer.current);
      flushSets(); // flush any pending edits when switching sessions/unmounting
    };
  }, [fetchToday, fetchLastSessions, flushSets]);

  return {
    sessionType, session,
    todaySets, lastSession, lastDate,
    overload, loading, saveStatus,
    gifCache, fetchGif, updateSet,
  };
}
