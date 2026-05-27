// 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
export const SESSION_BY_DAY = {
  0: 'Rest',
  1: 'Upper A',
  2: 'Lower A',
  3: 'Rest',
  4: 'Upper B',
  5: 'Lower B',
  6: 'Posture Day',
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

const ex = (id, name, muscle, sets, reps, notes = '', everySession = false) => ({
  id, name, muscle, muscleColor: MUSCLE_COLORS[muscle] ?? '#6b7280',
  sets, reps, notes, everySession,
});

const BACK_EXT = ex('back_extensions', 'Back Extensions', 'Lower Back', 3, '12–15', '', true);

export const WORKOUTS = {
  'Upper A': {
    focus: 'Push + Back Support',
    warmup: [
      'Cat-Cow × 10',
      'Band Pull-Aparts × 15',
      'Wall Slides × 10',
      'Band Dislocates × 10',
      'Chin Tucks × 10 (3 s hold)',
      'Dead Hang 20–30 s',
    ],
    exercises: [
      ex('incline_db_press',       'Incline DB Press',            'Chest',       3, '8–10',  'Neutral grip · 2–3 s negative'),
      ex('cable_row',              'Cable Row',                   'Back',        3, '10–12', 'Squeeze 2 s at peak'),
      ex('landmine_press',         'Landmine Press',              'Shoulders',   3, '10 ea', 'Half-kneeling'),
      ex('face_pulls',             'Face Pulls',                  'Rear Delts',  3, '15',    'Pull to forehead'),
      ex('db_lateral_raise',       'DB Lateral Raise',            'Side Delts',  3, '12–15'),
      ex('incline_db_curl',        'Incline DB Curl',             'Biceps',      2, '12',    '45° angle'),
      ex('overhead_tricep_ext',    'Overhead Tricep Extension',   'Triceps',     2, '12'),
      BACK_EXT,
    ],
  },

  'Lower A': {
    focus: 'Quad Focus',
    warmup: [
      'Glute Bridges × 15',
      'Bodyweight Squat × 10',
      'Walking Lunges × 8 each',
      'Cat-Cow × 8',
      'Dead Bug × 8 each',
      'Ankle Circles × 10',
    ],
    exercises: [
      ex('goblet_squat',           'Goblet Squat',                'Quads',           3, '10–12'),
      ex('leg_press',              'Leg Press',                   'Quads',           3, '10–12'),
      ex('bulgarian_split_squat',  'Bulgarian Split Squat',       'Quads / Glutes',  3, '8–10 ea'),
      ex('romanian_deadlift',      'Romanian Deadlift',           'Hamstrings',      3, '10–12', 'DBs not bar'),
      ex('leg_curl',               'Leg Curl',                    'Hamstrings',      3, '12',    '3 s negative'),
      ex('standing_calf_raise',    'Standing Calf Raise',         'Calves',          3, '15'),
      ex('pallof_press',           'Pallof Press',                'Core',            2, '10 ea'),
      BACK_EXT,
    ],
  },

  'Upper B': {
    focus: 'Pull + Posture',
    warmup: [
      'Cat-Cow × 10',
      'Band Pull-Aparts × 15',
      'Scapular Push-Ups × 10',
      'Wall Slides × 10',
      'Chin Tucks × 10',
      'Thoracic Rotation × 8 each',
    ],
    exercises: [
      ex('lat_pulldown',           'Lat Pulldown',                'Back',        3, '10–12', 'Pull to chest — never behind neck'),
      ex('flat_db_press',          'Flat DB Press',               'Chest',       3, '8–10',  'Neutral grip'),
      ex('single_arm_db_row',      'Single-Arm DB Row',           'Back',        3, '10–12 ea'),
      ex('cable_face_pull',        'Cable Face Pull',             'Rear Delts',  3, '15'),
      ex('rear_delt_fly',          'Rear Delt Fly',               'Rear Delts',  3, '12–15', 'Face-down incline'),
      ex('hammer_curl',            'Hammer Curl',                 'Biceps',      2, '12'),
      ex('rope_pushdown',          'Rope Pushdown',               'Triceps',     2, '12'),
      BACK_EXT,
    ],
  },

  'Lower B': {
    focus: 'Posterior Chain',
    warmup: [
      'Single-Leg Glute Bridge × 8 each',
      'Inchworm × 5',
      'Lateral Band Walk × 10 each',
      'Bird Dog × 8 each (3 s hold)',
      'Dead Bug × 8 each',
      "World's Greatest Stretch × 4 each",
    ],
    exercises: [
      ex('trap_bar_deadlift',      'Trap Bar Deadlift',           'Full Body',       3, '8–10',  'No trap bar → use DB RDL'),
      ex('walking_lunge',          'Walking Lunge',               'Quads / Glutes',  3, '10 ea'),
      ex('hip_thrust',             'Hip Thrust',                  'Glutes',          3, '10–12'),
      ex('leg_extension',          'Leg Extension',               'Quads',           3, '12'),
      ex('seated_leg_curl',        'Seated Leg Curl',             'Hamstrings',      3, '12'),
      ex('seated_calf_raise',      'Seated Calf Raise',           'Calves',          3, '15'),
      ex('ab_wheel_rollout',       'Ab Wheel Rollout',            'Core',            3, '8–10',  'Substitute plank if too hard'),
      BACK_EXT,
    ],
  },

  'Posture Day': {
    focus: 'Mobility & Alignment',
    warmup: [],
    exercises: [
      ex('foam_roll_upper',        'Foam Roll Upper Back',        'Upper Back',  1, '2 min'),
      ex('wall_angels',            'Wall Angels',                 'Posture',     3, '10'),
      ex('band_pull_apart_p',      'Band Pull-Apart',             'Rear Delts',  3, '15'),
      ex('chin_tucks_resist',      'Chin Tucks with Resistance',  'Neck',        3, '10',    '5 s hold'),
      ex('doorway_pec_stretch',    'Doorway Pec Stretch',         'Chest',       2, '45 s ea'),
      ex('pigeon_stretch',         'Pigeon Stretch',              'Hips',        1, '45 s ea'),
      ex('child_pose',             "Child's Pose",                'Full Body',   1, '60 s'),
      BACK_EXT,
    ],
  },
};

/** Parse "8–10" or "10 ea" → max integer reps for overload detection */
export const parseMaxReps = (repsStr) => {
  const nums = String(repsStr).match(/\d+/g);
  if (!nums) return Infinity;
  return Math.max(...nums.map(Number));
};
