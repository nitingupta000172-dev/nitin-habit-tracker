import { useState } from 'react';
import { ChevronDown, ExternalLink, Clock, Info, Leaf, Check } from 'lucide-react';
import { MEALS, DIET_META, DISCLAIMER, LIFESTYLE, DAILY_KCAL_TARGET } from '../../data/diet';
import { useDiet } from '../../hooks/useDiet';
import SaveDot from '../ui/SaveDot';

const fmt = (n) => n.toLocaleString();

function LinkRow({ links }) {
  if (!links?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {links.map((l, i) => (
        <a
          key={i}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 badge bg-accent/10 border border-accent/25 text-accent text-[10px] font-medium active:scale-95"
        >
          <ExternalLink size={10} />
          {l.label}
        </a>
      ))}
    </div>
  );
}

function TickButton({ checked, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={checked ? 'Uncheck meal' : 'Mark meal eaten'}
      className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 active:scale-90
        ${checked
          ? 'bg-success border-success shadow-[0_0_8px_rgba(34,197,94,0.35)]'
          : 'border-bg-border hover:border-success/60 bg-transparent'}`}
    >
      <Check size={16} strokeWidth={3} className={checked ? 'text-white' : 'text-text-muted'} />
    </button>
  );
}

function MealCard({ meal, checked, onToggle }) {
  const [open, setOpen] = useState(false);
  const count = meal.type === 'options' ? meal.options.length : meal.items.length;

  return (
    <div className={`card overflow-hidden transition-all ${checked ? 'ring-1 ring-success/30' : ''}`}>
      <div className="flex items-center gap-2 p-4">
        <button onClick={() => setOpen(o => !o)} className="flex items-center gap-3 flex-1 text-left min-w-0">
          <span className="text-xl w-8 text-center flex-shrink-0">{meal.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-text-primary leading-tight">{meal.slot}</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-text-muted mt-0.5 flex-wrap">
              <Clock size={11} />{meal.time}
              {meal.type === 'options' && <span>· {count} options</span>}
              <span className="text-accent font-medium">· ~{meal.kcal} kcal</span>
            </span>
          </div>
          <ChevronDown size={16} className={`text-text-muted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
        </button>
        <TickButton checked={checked} onClick={() => onToggle(meal.id, meal.slot)} />
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-bg-border pt-3 animate-fade-in space-y-3">
          {meal.type === 'single' && meal.items.map((it, i) => (
            <div key={i} className="text-sm text-text-secondary">
              <p>{it.text}</p>
              {it.note && <p className="text-[11px] text-text-muted mt-1">💡 {it.note}</p>}
              <LinkRow links={it.links} />
            </div>
          ))}

          {meal.type === 'options' && meal.options.map((opt, i) => (
            <div key={i} className="bg-bg-elevated rounded-xl px-3 py-2.5">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary">{opt.title}</p>
                  {opt.lines.map((ln, j) => (
                    <p key={j} className="text-xs text-text-secondary mt-0.5">{ln}</p>
                  ))}
                  <LinkRow links={opt.links} />
                </div>
              </div>
            </div>
          ))}

          {meal.notes?.length > 0 && (
            <div className="space-y-1 pt-1">
              {meal.notes.map((n, i) => (
                <p key={i} className="text-[11px] font-medium text-accent">• {n}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, sub }) {
  return (
    <div className="flex-1 bg-bg-elevated rounded-xl px-3 py-2.5 text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wide">{label}</p>
      <p className="text-[15px] font-bold text-text-primary mt-0.5 tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DietTab() {
  const d = useDiet();
  const pct = Math.min(100, Math.round((d.todayKcal / DAILY_KCAL_TARGET) * 100));

  return (
    <div className="tab-content flex-1 flex flex-col pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-3 bg-gradient-to-b from-bg-elevated/80 to-transparent">
        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-1">
          What to eat &amp; when
        </p>
        <h1 className="font-display text-2xl font-bold text-text-primary">{DIET_META.title}</h1>
        <p className="text-sm text-accent mt-0.5">{DIET_META.name} · {DIET_META.date}</p>
        <SaveDot status={d.saveStatus} className="mt-2" />
      </div>

      <div className="flex-1 px-3 space-y-3 overflow-y-auto">
        {/* Calorie summary */}
        <div className="card p-4">
          <div className="flex items-end justify-between mb-1">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wide">Today</p>
              <p className="text-2xl font-bold text-text-primary tabular-nums leading-none mt-1">
                {fmt(d.todayKcal)}
                <span className="text-sm text-text-muted font-medium"> / {fmt(DAILY_KCAL_TARGET)} kcal</span>
              </p>
            </div>
            <p className="text-xs text-text-muted">{d.todayMeals}/{MEALS.length} meals</p>
          </div>
          <div className="w-full h-2 rounded-full bg-bg-elevated overflow-hidden">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <StatTile label="This month" value={`${fmt(d.monthKcal)}`} sub={`${d.monthDays} days · ~${fmt(d.monthAvg)}/day`} />
            <StatTile label="This year"  value={`${fmt(d.yearKcal)}`}  sub={`${d.yearDays} days · ~${fmt(d.yearAvg)}/day`} />
          </div>
          <p className="text-[10px] text-text-muted text-center mt-2">
            Calories are estimates. Tick each meal as you eat it.
          </p>
        </div>

        {/* Meals */}
        {MEALS.map(meal => (
          <MealCard key={meal.id} meal={meal} checked={!!d.checks[meal.id]} onToggle={d.toggle} />
        ))}

        {/* Disclaimer */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-danger" />
            <span className="text-[13px] font-semibold text-text-primary">Important</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{DISCLAIMER}</p>
        </div>

        {/* Lifestyle */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Leaf size={14} className="text-success" />
            <span className="text-[13px] font-semibold text-text-primary">Lifestyle changes</span>
          </div>
          <div className="space-y-2">
            {LIFESTYLE.map((l, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                <span className="text-text-secondary">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
