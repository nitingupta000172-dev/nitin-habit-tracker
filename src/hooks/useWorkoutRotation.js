import { useState, useEffect, useCallback } from 'react';
import { supabase, toDateStr } from '../lib/supabase';
import { ROTATION } from '../data/workouts';

/**
 * Rotation tracker — the fix for "if I miss a day I don't want to miss the body part."
 *
 * Instead of locking the workout to the calendar day, we look at what you
 * ACTUALLY logged last and recommend the next session in ROTATION. Miss a day
 * and the rotation simply rolls forward — nothing gets skipped.
 *
 * Returns:
 *   lastDone          → { session, date } of the most recent logged session (or null)
 *   lastDoneBySession → { [session]: 'YYYY-MM-DD' } most recent date each session was done
 *   recommendedNext   → the session you should do next
 */
export function useWorkoutRotation() {
  const [lastDone,          setLastDone]          = useState(null);
  const [lastDoneBySession, setLastDoneBySession] = useState({});
  const [recommendedNext,   setRecommendedNext]   = useState(ROTATION[0]);
  const [loading,           setLoading]           = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('workout_sets')
        .select('date, session_type, created_at')
        .order('created_at', { ascending: false })
        .limit(400);
      if (error) throw error;

      const rows = data ?? [];
      // Most recent date per session (rows already sorted newest-first).
      const bySession = {};
      for (const r of rows) {
        if (!bySession[r.session_type]) bySession[r.session_type] = r.date;
      }
      setLastDoneBySession(bySession);

      // Overall last-done = a session that's part of the rotation, newest first.
      const latest = rows.find(r => ROTATION.includes(r.session_type));
      if (latest) {
        setLastDone({ session: latest.session_type, date: latest.date });
        const idx = ROTATION.indexOf(latest.session_type);
        setRecommendedNext(ROTATION[(idx + 1) % ROTATION.length]);
      } else {
        setLastDone(null);
        setRecommendedNext(ROTATION[0]);
      }
    } catch (e) {
      console.warn('useWorkoutRotation:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, [refresh]);

  return { lastDone, lastDoneBySession, recommendedNext, loading, refresh, today: toDateStr() };
}
