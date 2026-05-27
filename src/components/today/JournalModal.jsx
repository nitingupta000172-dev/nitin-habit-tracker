import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase, toDateStr } from '../../lib/supabase';

const MOODS = ['😫','😕','😐','🙂','😄'];

export default function JournalModal({ onClose, onSaved }) {
  const [triggered,  setTriggered]  = useState('');
  const [didInstead, setDidInstead] = useState('');
  const [mood,       setMood]       = useState(3);
  const [saving,     setSaving]     = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('journal_entries').insert({
        date:        toDateStr(),
        triggered:   triggered.trim() || null,
        did_instead: didInstead.trim() || null,
        mood,
      });
      onSaved?.();
      onClose();
    } catch (e) {
      console.warn('journal save', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-safe">
      <div className="bg-bg-card rounded-3xl w-full max-w-lg p-6 shadow-xl animate-slide-up space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">3-Line Journal</h2>
            <p className="text-xs text-text-muted mt-0.5">Quick urge-surfing check-in</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-bg-elevated text-text-secondary">
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
              What triggered you?
            </label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Stress, boredom, habit cue…"
              value={triggered}
              onChange={e => setTriggered(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block">
              What did you do instead?
            </label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Walked, meditated, called someone…"
              value={didInstead}
              onChange={e => setDidInstead(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
              Mood — {MOODS[mood - 1]}
            </label>
            <div className="flex items-center gap-3">
              <span className="text-xl">{MOODS[0]}</span>
              <input
                type="range" min={1} max={5} value={mood}
                onChange={e => setMood(Number(e.target.value))}
                className="flex-1 accent-amber-400 h-1.5"
              />
              <span className="text-xl">{MOODS[4]}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-ghost border border-bg-border">
            Skip
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary">
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
