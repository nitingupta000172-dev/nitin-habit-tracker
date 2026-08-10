// ============================================================
// Phase 2 Workout Plan — Weeks 9–20 (3 Months)
// Upper/Lower × 2. Rotation-based, NOT locked to the calendar day:
// you pick any session and the app recommends the next one based on
// what you last actually did — so a missed day rolls forward instead
// of skipping a body part.
// ============================================================

// The 4 training sessions, in rotation order.
export const ROTATION = ['Upper A', 'Lower A', 'Upper B', 'Lower B'];

// Calendar hint only (used for a "suggested today" note + Progress label).
// 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
export const SESSION_BY_DAY = {
  0: 'Rest',
  1: 'Upper A',
  2: 'Lower A',
  3: 'Rest',
  4: 'Upper B',
  5: 'Lower B',
  6: 'Rest',
};

export const REST_QUOTES = [
  "Recovery is where growth happens. Own the rest day.",
  "Champions are built on rest days. Fuel up, recharge.",
  "Your muscles grow while you sleep. Today you're growing.",
  "Rest is not laziness — it's strategy.",
  "The body repairs itself in silence. Let it.",
];

const MUSCLE_COLORS = {
  Chest:         '#ef4444',
  Back:          '#3b82f6',
  Shoulders:     '#8b5cf6',
  'Side Delts':  '#06b6d4',
  'Rear Delts':  '#06b6d4',
  Biceps:        '#f59e0b',
  Triceps:       '#10b981',
  'Lower Back':  '#f97316',
  Quads:         '#ef4444',
  'Quads / Glutes': '#ef4444',
  Hamstrings:    '#3b82f6',
  Glutes:        '#8b5cf6',
  Calves:        '#10b981',
  Core:          '#8b5cf6',
  'Full Body':   '#6b7280',
  Neck:          '#f59e0b',
  Hips:          '#8b5cf6',
  Posture:       '#06b6d4',
  'Upper Back':  '#3b82f6',
};

// ex(id, name, muscle, sets, reps, { rest, notes, optional })
// optional = exercises 5–7 (do them if you have time; 1–4 are mandatory).
const ex = (id, name, muscle, sets, reps, opts = {}) => ({
  id, name, muscle,
  muscleColor: MUSCLE_COLORS[muscle] ?? '#6b7280',
  sets, reps,
  rest:     opts.rest     ?? '',
  notes:    opts.notes    ?? '',
  optional: opts.optional ?? false,
});

export const WORKOUTS = {
  'Upper A': {
    focus: 'Push Emphasis',
    warmup: [
      'Band Pull-Aparts × 15',
      'Scapular Push-Ups × 10',
      'Wall Slides × 10',
      'Chin Tucks × 10 (3 s hold)',
      'Arm Circles × 10 each way',
      'Light set of exercise 1',
    ],
    exercises: [
      ex('incline_db_press',    'Incline DB Press',            'Chest',      4, '6–10', { rest: '2 min',  notes: '30° · neutral or 45° grip. Elbows ~45° from torso. Stop 1–2 reps shy of failure.' }),
      ex('chest_supported_row', 'Chest-Supported DB Row',      'Back',       4, '8–10', { rest: '90 sec', notes: 'Chest on incline bench. Squeeze shoulder blades 1 sec.' }),
      ex('seated_db_press',     'Seated DB Shoulder Press',    'Shoulders',  3, '8–10', { rest: '90 sec', notes: 'Neutral grip, back supported. Stop at any right-shoulder pinch.' }),
      ex('face_pulls',          'Face Pulls',                  'Rear Delts', 3, '15',   { rest: '60 sec', notes: 'Rope, high cable. Pull to forehead, external rotation at the end.' }),
      ex('cable_chest_fly',     'Cable Chest Fly',             'Chest',      2, '12',   { rest: '60 sec', notes: 'Mid height. Constant tension, easy on the shoulder.', optional: true }),
      ex('db_lateral_raise',    'DB Lateral Raise',            'Side Delts', 3, '12–15',{ rest: '60 sec', notes: 'Light. Not above shoulder height.', optional: true }),
      ex('oh_cable_tricep',     'Overhead Cable Tricep Ext',   'Triceps',    2, '12',   { rest: '60 sec', notes: 'Rope. Elbows forward.', optional: true }),
    ],
    finisher: [
      'Doorway Pec Stretch — 30 s × 2 each side',
      'Chin Tucks × 10 (5 s hold)',
    ],
  },

  'Lower A': {
    focus: 'Quad + Tendon Focus',
    warmup: [
      'Glute Bridges × 15 (2 s squeeze)',
      'Bodyweight Squat × 10 (slow)',
      'Leg Swings × 10 each direction',
      'Ankle Circles × 10 each way',
      'Monster Walks (band above knees) × 10 steps each way',
      'Dead Bug × 8 each side',
    ],
    exercises: [
      ex('leg_press_hsr',       'Leg Press — HSR tempo',       'Quads',          4, '6–8',  { rest: '2 min',  notes: '3 s down, 3 s up. THE patellar tendon exercise — heavy but controlled. No lower-back rounding at the bottom.' }),
      ex('bulgarian_split',     'Bulgarian Split Squat',       'Quads / Glutes', 3, '8 ea', { rest: '90 sec', notes: 'DBs at sides. Start the weaker leg. Fixes L/R imbalance.' }),
      ex('romanian_deadlift',   'Romanian Deadlift (DBs)',     'Hamstrings',     4, '8–10', { rest: '2 min',  notes: 'Hinge, feel the hamstring stretch, stop before the lower back rounds. Straps OK (protects elbows).' }),
      ex('hip_adduction',       'Hip Adduction Machine',       'Hips',           3, '12–15',{ rest: '60 sec', notes: 'Direct hit on your weakest tested group. Slow.' }),
      ex('leg_curl',            'Leg Curl (machine)',          'Hamstrings',     3, '10–12',{ rest: '60 sec', notes: '3 s negative.', optional: true }),
      ex('calf_tib_superset',   'Standing Calf + Tibialis Raise', 'Calves',      3, '15/15',{ rest: '60 sec', notes: 'Superset. Tibialis raises (back to wall, lift toes) protect the right ankle.', optional: true }),
      ex('pallof_press',        'Pallof Press',                'Core',           2, '10 ea',{ rest: '60 sec', notes: 'Anti-rotation core.', optional: true }),
    ],
    finisher: [
      '90/90 Hip Stretch — 30 s each side',
      'Couch Stretch — 30 s each side',
    ],
  },

  'Upper B': {
    focus: 'Pull Emphasis + Posture',
    warmup: [
      'Cat-Cow × 10',
      'Band Pull-Aparts × 15',
      'Wall Slides × 10',
      'Chin Tucks × 10',
      'Thoracic Rotations × 8 each side',
      'Light set of exercise 1',
    ],
    exercises: [
      ex('lat_pulldown',        'Lat Pulldown (neutral grip)', 'Back',       4, '6–10', { rest: '2 min',  notes: 'Neutral / parallel grip spares the elbows. Pull to upper chest.' }),
      ex('seated_cable_row',    'Seated Cable Row (neutral)',  'Back',       4, '8–10', { rest: '90 sec', notes: 'Chest up, drive elbows back, 1 sec squeeze.' }),
      ex('flat_db_press',       'Flat DB Press',               'Chest',      3, '8–10', { rest: '90 sec', notes: 'Moderate. Pulling stays ahead of pushing — that ratio is deliberate.' }),
      ex('face_pulls_b',        'Face Pulls',                  'Rear Delts', 3, '15',   { rest: '60 sec', notes: 'Yes, again. Posture is a long game.' }),
      ex('reverse_pec_deck',    'Reverse Pec Deck',            'Rear Delts', 3, '12–15',{ rest: '60 sec', notes: 'Or rear-delt cable fly. Rear delts = posture money.', optional: true }),
      ex('incline_db_curl',     'Incline DB Curl',             'Biceps',     2, '10–12',{ rest: '60 sec', notes: 'Or hammer curl if inner elbow aches — hammer grip is the elbow-friendly default.', optional: true }),
      ex('cable_pushdown',      'Cable Tricep Pushdown',       'Triceps',    2, '12',   { rest: '60 sec', notes: '', optional: true }),
    ],
    finisher: [
      'Wall Angels × 10',
      'Lat Stretch — 30 s each side',
      'Chin Tucks × 10 (5 s hold)',
    ],
  },

  'Lower B': {
    focus: 'Hip + Posterior Focus',
    warmup: [
      'Glute Bridges × 15 (2 s squeeze)',
      'Bodyweight Squat × 10 (slow)',
      'Leg Swings × 10 each direction',
      'Ankle Circles × 10 each way',
      'Monster Walks (band above knees) × 10 steps each way',
      'Dead Bug × 8 each side',
    ],
    exercises: [
      ex('hip_thrust',          'Hip Thrust (bar or machine)', 'Glutes',     4, '8–10', { rest: '2 min',  notes: 'Pad on hips, no spinal loading. 2 sec squeeze at the top.' }),
      ex('goblet_squat_hsr',    'Goblet Squat — HSR tempo',    'Quads',      3, '8–10', { rest: '90 sec', notes: '3 s down, 3 s up. Second weekly tendon dose.' }),
      ex('hip_abduction',       'Hip Abduction Machine',       'Hips',       3, '12–15',{ rest: '60 sec', notes: 'Second weakest tested group. Lean slightly forward for more glute med.' }),
      ex('cable_hip_flexion',   'Cable Hip Flexion',           'Hips',       3, '10 ea',{ rest: '60 sec', notes: 'Ankle cuff, or hanging knee raises. Directly trains the hip-flexion weakness.' }),
      ex('back_extension',      'Back Extension (45°)',        'Lower Back', 3, '12',   { rest: '60 sec', notes: 'Bodyweight → light DB. Slow, no jerking. Builds the posterior chain safely.', optional: true }),
      ex('copenhagen_plank',    'Copenhagen Plank',            'Core',       2, '15–20s ea', { rest: '60 sec', notes: 'Short lever, knee on bench. Adductor strength + core. Brutal but effective.', optional: true }),
      ex('seated_calf_raise',   'Seated Calf Raise',           'Calves',     3, '15',   { rest: '60 sec', notes: '', optional: true }),
    ],
    finisher: [
      'Pigeon Stretch — 30 s each side',
      "Child's Pose — 30 s",
      'Standing Quad Stretch — 30 s each side',
    ],
  },
};

/** Parse "8–10", "10 ea", "15/15", "15–20s ea" → max integer reps for overload detection */
export const parseMaxReps = (repsStr) => {
  const nums = String(repsStr).match(/\d+/g);
  if (!nums) return Infinity;
  return Math.max(...nums.map(Number));
};
