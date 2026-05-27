import { CheckSquare, Dumbbell, Percent, Calendar } from 'lucide-react';

export default function TodayStats({ stats }) {
  if (!stats) return null;
  const { done, total, pct, exercises, session } = stats;

  const tiles = [
    { icon: CheckSquare, label: 'Habits done',    value: `${done}/${total}`, color: 'text-success', bg: 'bg-success/10' },
    { icon: Percent,     label: 'Completion',     value: `${pct}%`,         color: 'text-accent',  bg: 'bg-accent/10' },
    { icon: Calendar,    label: 'Session',        value: session,           color: 'text-info',    bg: 'bg-info/10' },
    { icon: Dumbbell,    label: 'Exercises logged',value: exercises,        color: 'text-warn',    bg: 'bg-warn/10' },
  ];

  return (
    <div className="card p-4">
      <h2 className="font-display text-sm font-bold text-text-secondary uppercase tracking-widest mb-3">
        Today
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 flex items-center gap-3`}>
            <Icon size={20} className={color} />
            <div>
              <p className={`text-lg font-bold ${color} leading-none`}>{value}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
