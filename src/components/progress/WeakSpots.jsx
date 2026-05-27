import { AlertOctagon } from 'lucide-react';

export default function WeakSpots({ spots }) {
  if (!spots.length) return null;
  return (
    <div className="card p-4 border border-warn/30 bg-warn/5">
      <div className="flex items-center gap-2 mb-3">
        <AlertOctagon size={16} className="text-warn" />
        <h2 className="font-display text-sm font-bold text-warn uppercase tracking-widest">
          Where you are slipping
        </h2>
      </div>
      <div className="space-y-2">
        {spots.map(h => (
          <div key={h.id} className="flex items-center justify-between bg-bg-elevated rounded-xl px-3 py-2.5">
            <p className="text-sm text-text-primary flex-1 min-w-0 truncate">{h.label}</p>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              {/* Mini bar */}
              <div className="w-16 h-1.5 bg-bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-warn transition-all"
                  style={{ width: `${h.consistency}%` }}
                />
              </div>
              <span className="text-xs font-bold text-warn w-8 text-right">{h.consistency}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
