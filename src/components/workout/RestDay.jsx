import { REST_QUOTES } from '../../data/workouts';
import { Moon } from 'lucide-react';

export default function RestDay({ sessionType }) {
  const quote = REST_QUOTES[new Date().getDay() % REST_QUOTES.length];
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20 tab-content">
      <div className="w-24 h-24 rounded-full bg-info/10 flex items-center justify-center mb-6 shadow-glow">
        <Moon size={44} className="text-info" strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-2xl font-bold text-text-primary mb-2">{sessionType}</h2>
      <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-8">
        {quote}
      </p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {['Hydrate', 'Sleep 8h', 'Stretch'].map(tip => (
          <div key={tip} className="card p-3 text-center">
            <p className="text-xs text-text-secondary font-medium">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
