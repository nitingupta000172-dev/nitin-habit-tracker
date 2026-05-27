import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-bg-border rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="font-bold text-accent">{payload[0].value} kg</p>
    </div>
  );
};

export default function ExerciseChart({ exerciseNames, data, selected, onSelect }) {
  const maxWeight = data.length ? Math.max(...data.map(d => d.weight)) : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          <h2 className="font-display text-sm font-bold text-text-secondary uppercase tracking-widest">
            Exercise Progress
          </h2>
        </div>
      </div>

      {/* Dropdown */}
      {exerciseNames.length > 0 ? (
        <>
          <select
            value={selected}
            onChange={e => onSelect(e.target.value)}
            className="input-field mb-4"
          >
            {exerciseNames.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#52525b', fontSize: 10 }}
                  tickFormatter={d => d.slice(5)}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: '#52525b', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                {maxWeight > 0 && (
                  <ReferenceLine y={maxWeight} stroke="#f59e0b" strokeDasharray="4 4"
                    label={{ value: `PB ${maxWeight}kg`, fill: '#f59e0b', fontSize: 10, position: 'right' }}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#f59e0b', stroke: '#0a0a0f', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : data.length === 1 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              Only 1 session logged — keep going to see the chart 📈
            </div>
          ) : (
            <div className="text-center py-8 text-text-muted text-sm">
              No data for this exercise yet
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-text-muted text-sm">
          Log your first workout session to see charts
        </div>
      )}
    </div>
  );
}
