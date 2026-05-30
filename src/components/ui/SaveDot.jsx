/** Small inline save status indicator */
export default function SaveDot({ status, className = '' }) {
  if (status === 'idle') return null;

  const config = {
    saving: { color: 'bg-text-muted',  pulse: true,  label: 'Saving…' },
    saved:  { color: 'bg-success',     pulse: false, label: 'Saved'   },
    error:  { color: 'bg-danger',      pulse: true,  label: 'Save failed' },
  }[status] ?? null;

  if (!config) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}
      />
      <span className="text-[11px] text-text-muted">{config.label}</span>
    </div>
  );
}
