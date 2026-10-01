// ============================================================
// Phase 2.1 Workout Plan — 5 days/week, morning training
// Upper A · Lower A · Posture · Upper B · Lower B
// Rotation-based, NOT locked to the calendar day: the app recommends
// the next session from what you last actually logged.
// Starting loads in notes come from your Aug 11 – Sep 26 log.
// "PAIR" = do that corrective set in the rest period of the named lift.
// Exercise names kept identical to Phase 2 so history and charts carry over.
// ============================================================

export const ROTATION = ['Upper A', 'Lower A', 'Posture', 'Upper B', 'Lower B'];

// Calendar hint only. 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
export const SESSION_BY_DAY = {
  0: 'Rest',
  1: 'Upper A',
  2: 'Lower A',
  3: 'Posture',
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
    focus: 'Push + Posture',
    warmup: [
      'Band Pull-Aparts × 15',
      'Scapular Push-Ups × 10',
      'Wall Slides × 10',
      'Arm Circles × 10 each way',
      'Light set of exercise 1',
    ],
    exercises: [
      ex('incline_db_press',    'Incline DB Press',            'Chest',      4, '6–8',  { rest: '2 min',  notes: 'START 32.5. Stuck at 30 since April. Heavier, fewer reps. Elbows ~45°.' }),
      ex('prone_y_raise',       'Prone Incline Y-Raise',       'Posture',    2, '10',   { rest: '—',      notes: 'PAIR with Incline Press rest. 2–4 kg, chest on 30° bench. No shrugging.' }),
      ex('chest_supported_row', 'Chest-Supported DB Row',      'Back',       4, '8–10', { rest: '90 sec', notes: 'Stay 30 until 4×10, then 32.5. 1 sec squeeze.' }),
      ex('band_external_rot',   'Band External Rotation',      'Shoulders',  2, '15 ea',{ rest: '—',      notes: 'PAIR with Row rest. Elbow at side, towel under arm. Right shoulder rehab.' }),
      ex('seated_db_press',     'Seated DB Shoulder Press',    'Shoulders',  3, '10–12',{ rest: '90 sec', notes: '25 until 3×12, then 27.5. Stop at any right-shoulder pinch.' }),
      ex('landmine_press_1arm', 'Half-Kneeling Landmine Press (1-arm)', 'Shoulders', 3, '10 ea', { rest: '—', notes: 'PAIR with Shoulder Press rest. Right side first. 3rd set = right arm only (imbalance).' }),
      ex('face_pulls',          'Face Pulls',                  'Rear Delts', 3, '15',   { rest: '60 sec', notes: '16. Move to 18 once 3×15 is clean.' }),
      ex('db_lateral_raise',    'DB Lateral Raise',            'Side Delts', 3, '12–15',{ rest: '60 sec', notes: 'Light. Not above shoulder height.', optional: true }),
      ex('oh_cable_tricep',     'Overhead Cable Tricep Ext',   'Triceps',    2, '12',   { rest: '60 sec', notes: 'Rope. Elbows forward.', optional: true }),
    ],
    finisher: [
      'Doorway Pec Stretch — 30 s × 2 each side',
      'Chin Tucks × 10 (5 s hold)',
    ],
  },

  'Lower A': {
    focus: 'Quad + Tendon + Hamstring',
    warmup: [
      'Glute Bridges × 15 (2 s squeeze)',
      'Bodyweight Squat × 10 (slow)',
      'Leg Swings × 10 each direction',
      'Monster Walks (band above knees) × 10 steps each way',
      'Ankle Circles × 10 each way',
    ],
    exercises: [
      ex('leg_press_hsr',       'Leg Press — HSR tempo',       'Quads',          4, '8',    { rest: '2 min',  notes: 'START 120. At 140 reps fell to 10, 8, 5, 5. Rebuild 4×8 clean, then back to 140. 3 s down, 3 s up.' }),
      ex('single_leg_db_rdl',   'Single-Leg DB RDL',           'Hamstrings',     2, '8 ea', { rest: '—',      notes: 'PAIR with Leg Press rest. DB in opposite hand. Weaker leg first. Hamstring length + balance.' }),
      ex('bulgarian_split',     'Bulgarian Split Squat',       'Quads / Glutes', 3, '10 ea',{ rest: '90 sec', notes: '15 until 3×10, then 17.5. Weaker leg first.' }),
      ex('copenhagen_plank',    'Copenhagen Plank',            'Core',           2, '15–20s ea', { rest: '—', notes: 'PAIR with Bulgarian rest. Short lever, knee on bench. Log seconds as reps.' }),
      ex('romanian_deadlift',   'Romanian Deadlift (DBs)',     'Hamstrings',     3, '8–10', { rest: '2 min',  notes: '27.5–30 with straps. Progressing, back is handling it. 3 s lowering.' }),
      ex('calf_tib_superset',   'Standing Calf + Tibialis Raise', 'Calves',      2, '15/15',{ rest: '—',      notes: 'PAIR with RDL rest. Protects the right ankle.' }),
      ex('hip_adduction',       'Hip Adduction Machine',       'Hips',           3, '12–15',{ rest: '60 sec', notes: 'Back to 45. It dropped to 30.' }),
      ex('leg_curl',            'Leg Curl (machine)',          'Hamstrings',     3, '8–12', { rest: '60 sec', notes: 'NOT optional anymore. Logged once in 7 weeks. 70, 3 s negative.' }),
    ],
    finisher: [
      'Banded Supine Hamstring Stretch — 45 s each',
      'Couch Stretch — 30 s each side',
    ],
  },

  'Posture': {
    focus: 'Corrective + Core',
    warmup: [
      'Cat-Cow × 10',
      "World's Greatest Stretch × 5 each side",
      '90/90 Hip Switches × 8',
      'Thoracic Rotations × 8 each side',
    ],
    exercises: [
      ex('prone_ytw',           'Prone Incline Y-T-W',         'Posture',    3, '8 ea letter', { rest: '60 sec', notes: 'Block A circuit (posture). 2–3 kg DBs. Mid/lower traps.' }),
      ex('cable_er_90',         'Cable External Rotation 90°', 'Shoulders',  3, '12 ea',{ rest: '—',      notes: 'Block A. Light. Right side first. Rotator cuff.' }),
      ex('band_neck_retraction','Band Neck Retraction',        'Neck',       3, '12',   { rest: '—',      notes: 'Block A. Band behind head, anchored in front, pull head straight back, 3 s hold. Forward head fix.' }),
      ex('db_pullover_roller',  'DB Pullover on Foam Roller',  'Upper Back', 3, '10',   { rest: '—',      notes: 'Block A. Roller across upper back, light DB. Thoracic extension.' }),
      ex('single_leg_hip_thrust','Single-Leg Hip Thrust',      'Glutes',     3, '10 ea',{ rest: '60 sec', notes: 'Block B circuit (hips + imbalance). Weaker side first.' }),
      ex('cable_hip_abduction', 'Standing Cable Hip Abduction','Hips',       3, '12 ea',{ rest: '—',      notes: 'Block B. Glute med, knee tracking.' }),
      ex('banded_psoas_march',  'Banded Psoas March',          'Hips',       3, '10 ea',{ rest: '—',      notes: 'Block B. Supine, band around feet. Hip flexion weakness.' }),
      ex('single_arm_db_row',   'Single-Arm DB Row',           'Back',       4, '10 ea',{ rest: '—',      notes: 'Block B. Right first. 4th set = right arm only (imbalance).' }),
      ex('suitcase_carry',      'Suitcase Carry',              'Core',       3, '30m ea',{ rest: '60 sec', notes: 'Block C circuit (core + low back). One heavy DB. Log metres as reps.' }),
      ex('bird_dog',            'Bird Dog (5 s hold)',         'Lower Back', 3, '6 ea', { rest: '—',      notes: 'Block C. Ankle weight optional.' }),
      ex('side_plank',          'Side Plank',                  'Core',       3, '20–30s ea', { rest: '—', notes: 'Block C. Log seconds as reps.' }),
      ex('dead_bug_pullover',   'Dead Bug + Band Pullover',    'Core',       3, '8 ea', { rest: '—',      notes: 'Block C. Ribs down. Fixes flared ribs that come with rounded posture.' }),
    ],
    finisher: [
      'Banded Hamstring Stretch — 45 s each leg',
      'Pigeon — 45 s each side',
      'Couch Stretch — 45 s each side',
      'Doorway Pec Stretch — 45 s',
      'Lat Stretch on Bench — 45 s',
      "Child's Pose — 45 s",
    ],
  },

  'Upper B': {
    focus: 'Pull + Posture',
    warmup: [
      'Cat-Cow × 10',
      'Band Pull-Aparts × 15',
      'Wall Slides × 10',
      'Dead Hang — 20–30 s',
      'Light set of exercise 1',
    ],
    exercises: [
      ex('lat_pulldown',        'Lat Pulldown (neutral grip)', 'Back',       4, '8–10', { rest: '2 min',  notes: '90, target 4×10. Flat 3 sessions, last set collapses. Rest 3 min before set 4.' }),
      ex('single_arm_cable_row','Single-Arm Cable Row (half-kneeling)', 'Back', 3, '10 ea', { rest: '—', notes: 'PAIR with Pulldown rest. Right first. 3rd set = right arm only.' }),
      ex('seated_cable_row',    'Seated Cable Row (neutral)',  'Back',       4, '8',    { rest: '90 sec', notes: 'START 90. 4×10 at 80 hit twice, overdue.' }),
      ex('prone_t_raise',       'Prone Incline T-Raise',       'Posture',    2, '12',   { rest: '—',      notes: 'PAIR with Row rest. 2–4 kg. Mid traps.' }),
      ex('flat_db_press',       'Flat DB Press',               'Chest',      3, '8',    { rest: '90 sec', notes: 'START 32.5. Top set hit 12 at 30, earned the jump.' }),
      ex('reverse_pec_deck',    'Reverse Pec Deck',            'Rear Delts', 3, '12–15',{ rest: '—',      notes: 'PAIR with Flat Press rest. Never logged in Phase 2. Rear delts = posture.' }),
      ex('face_pulls_b',        'Face Pulls',                  'Rear Delts', 3, '15',   { rest: '60 sec', notes: '16 → 18 at 3×15.' }),
      ex('hammer_curl',         'Hammer Curl',                 'Biceps',     2, '10–12',{ rest: '60 sec', notes: 'Elbow-friendly grip.', optional: true }),
      ex('cable_pushdown',      'Cable Tricep Pushdown',       'Triceps',    2, '12',   { rest: '60 sec', notes: '', optional: true }),
    ],
    finisher: [
      'Wall Angels × 10',
      'Lat Stretch — 30 s each side',
      'Chin Tucks × 10 (5 s hold)',
    ],
  },

  'Lower B': {
    focus: 'Hip + Posterior',
    warmup: [
      'Glute Bridges × 15 (2 s squeeze)',
      'Bodyweight Squat × 10 (slow)',
      'Leg Swings × 10 each direction',
      'Monster Walks (band above knees) × 10 steps each way',
      'Ankle Circles × 10 each way',
    ],
    exercises: [
      ex('hip_thrust',          'Hip Thrust (bar or machine)', 'Glutes',     4, '8–10', { rest: '2 min',  notes: '70 until 4×10, then 80. Your best lift: +55% since Aug.' }),
      ex('suitcase_carry_b',    'Suitcase Carry',              'Core',       2, '30m ea',{ rest: '—',     notes: 'PAIR with Hip Thrust rest. Log metres as reps.' }),
      ex('goblet_squat_hsr',    'Goblet Squat — HSR tempo',    'Quads',      3, '8–10', { rest: '90 sec', notes: '30 → 32 next. 3 s down, 3 s up.' }),
      ex('side_plank_leg_raise','Side Plank + Top-Leg Raise',  'Core',       2, '20s ea',{ rest: '—',     notes: 'PAIR with Goblet rest. Glute med + obliques. Log seconds as reps.' }),
      ex('hip_abduction',       'Hip Abduction Machine',       'Hips',       3, '12–15',{ rest: '60 sec', notes: 'START 52. Lean slightly forward.' }),
      ex('seated_calf_raise',   'Seated Calf Raise',           'Calves',     2, '15',   { rest: '—',      notes: 'PAIR with Abduction rest.' }),
      ex('cable_hip_flexion',   'Cable Hip Flexion',           'Hips',       3, '10 ea',{ rest: '60 sec', notes: '12 → 15 once 3×10 is easy. Hip-flexion weakness.' }),
      ex('back_extension',      'Back Extension (45°)',        'Lower Back', 3, '12',   { rest: '60 sec', notes: 'Log REPS (you logged 60 last time, probably seconds). Bodyweight → light DB.' }),
    ],
    finisher: [
      'Pigeon Stretch — 30 s each side',
      'Banded Hamstring Stretch — 45 s each',
      "Child's Pose — 30 s",
    ],
  },
};

/** Parse "8–10", "10 ea", "15/15", "15–20s ea" → max integer reps for overload detection */
export const parseMaxReps = (repsStr) => {
  const nums = String(repsStr).match(/\d+/g);
  if (!nums) return Infinity;
  return Math.max(...nums.map(Number));
};
