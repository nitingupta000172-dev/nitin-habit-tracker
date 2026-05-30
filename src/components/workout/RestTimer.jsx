import { useEffect, useRef, useState } from 'react';
import { X, Timer } from 'lucide-react';

const DURATION = 120; // 2 minutes

/** Web Audio API beep — works because it's triggered by user input (set completion) */
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.9);
    // Second beep for emphasis
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);
    osc2.start(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 1.1);
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch (_) {}
}

export default function RestTimer({ onDismiss }) {
  const [seconds,  setSeconds]  = useState(DURATION);
  const beeped = useRef(false);

  useEffect(() => {
    if (seconds <= 0) {
      if (!beeped.current) { beep(); beeped.current = true; }
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const mm   = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss   = String(seconds % 60).padStart(2, '0');
  const pct  = ((DURATION - seconds) / DURATION) * 100;
  const done = seconds === 0;
  const urgent = seconds <= 15 && !done;

  // SVG ring
  const R    = 20;
  const circ = 2 * Math.PI * R;

  return (
    <div
      className={`fixed bottom-[72px] inset-x-3 z-40 max-w-lg mx-auto
                  rounded-2xl border px-4 py-3 flex items-center gap-4
                  shadow-xl backdrop-blur-md transition-colors
                  ${done   ? 'bg-success/15 border-success/40'
                  : urgent ? 'bg-danger/15  border-danger/40 animate-pulse'
                           : 'bg-info/10    border-info/30'}`}
    >
      {/* Ring */}
      <div className="relative flex-shrink-0 w-12 h-12">
        <svg viewBox="0 0 48 48" className="-rotate-90 w-full h-full">
          <circle cx="24" cy="24" r={R} fill="none" stroke="#1e1e2a"        strokeWidth="4" />
          <circle
            cx="24" cy="24" r={R}
            fill="none"
            stroke={done ? '#10b981' : urgent ? '#ef4444' : '#3b82f6'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <Timer size={14} className={done ? 'text-success' : urgent ? 'text-danger' : 'text-info'} />
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        {done ? (
          <>
            <p className="text-sm font-bold text-success leading-tight">Rest complete!</p>
            <p className="text-xs text-text-secondary mt-0.5">Start your next set 💪</p>
          </>
        ) : (
          <>
            <p className="text-xs text-text-muted mb-0.5">Rest between sets</p>
            <p className={`text-2xl font-mono font-bold leading-none tabular-nums
                           ${urgent ? 'text-danger' : 'text-info'}`}>
              {mm}:{ss}
            </p>
          </>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-2 rounded-xl hover:bg-bg-elevated text-text-muted transition-colors"
        aria-label="Dismiss rest timer"
      >
        <X size={18} />
      </button>
    </div>
  );
}
