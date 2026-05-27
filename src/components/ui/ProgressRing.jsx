export default function ProgressRing({ pct = 0, size = 120, stroke = 10, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e2a" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
