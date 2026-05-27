// days: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
export const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const LLLT_DAYS    = [1, 2, 4];       // Mon Tue Thu
const GYM_DAYS     = [1, 2, 4, 5, 6]; // Mon Tue Thu Fri Sat
const NO_LLLT_DAYS = [0, 3, 5, 6];    // Sun Wed Fri Sat

const PM_ACTIVE = {
  0: 'Pyunkang Yul only',
  1: 'Salicylic Acid 2%',
  2: 'Retinoid',
  3: 'Salicylic Acid 2%',
  4: 'Demelan Cream',
  5: 'Salicylic Acid 2%',
  6: 'Retinoid',
};

const HAIR_BY_DAY = {
  0: [ // Sunday
    { id: 'hair_rinse',       label: 'Rinse only' },
    { id: 'hair_scalp',       label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
    { id: 'hair_refill',      label: 'Refill oil bottles' },
  ],
  1: [ // Monday
    { id: 'hair_nizoral_mon', label: 'Nizoral 2% — 5 min then rinse' },
    { id: 'hair_scalp',       label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
  ],
  2: [ // Tuesday
    { id: 'hair_rinse',       label: 'Rinse only' },
    { id: 'hair_scalp',       label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
  ],
  3: [ // Wednesday
    { id: 'hair_scalp_pregym', label: 'Apply scalp mix pre-gym' },
    { id: 'hair_nizoral_wed',  label: 'Nizoral 2% post-shower' },
    { id: 'hair_scalp',        label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',        label: 'Beard mix (3–5 drops)' },
  ],
  4: [ // Thursday
    { id: 'hair_rinse',       label: 'Rinse only' },
    { id: 'hair_scalp',       label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
  ],
  5: [ // Friday
    { id: 'hair_cerave',      label: 'CeraVe Anti-Dandruff wash' },
    { id: 'hair_scalp',       label: 'Scalp mix (4–5 drops)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
  ],
  6: [ // Saturday
    { id: 'hair_dermaroll',   label: 'Dermaroll hairline 0.5mm (4–5 passes)' },
    { id: 'hair_scalp_sat',   label: 'Scalp mix to rest of scalp' },
    { id: 'hair_rinse_sat',   label: 'Rinse only post-shower' },
    { id: 'hair_minoxidil',   label: 'Kirkland Minoxidil 5% foam to hairline (wait 2 h first)' },
    { id: 'hair_beard',       label: 'Beard mix (3–5 drops)' },
  ],
};

/**
 * Returns ordered sections of habits for a given day-of-week (0–6).
 * Each section: { id, title, time, emoji, items: [{ id, label, subtitle? }] }
 */
export const getHabitsForDay = (day) => {
  const sections = [];

  // ── MORNING ──────────────────────────────────────────────
  const morning = [
    { id: 'morning_water',      label: 'Drink water' },
    { id: 'morning_meditation', label: 'Meditation', subtitle: '5:00–5:30 AM' },
  ];
  if (LLLT_DAYS.includes(day))
    morning.push({ id: 'morning_lllt',  label: 'LLLT 30 min during getting ready', badge: 'Mon · Tue · Thu' });
  if (GYM_DAYS.includes(day))
    morning.push({ id: 'morning_gym',   label: 'Gym session', subtitle: '6:00–7:00 AM — Open Workout tab →' });
  if (NO_LLLT_DAYS.includes(day))
    morning.push({ id: 'morning_ready', label: 'Getting ready, no LLLT' });

  sections.push({ id: 'morning', title: 'Morning', time: '5:00 AM', emoji: '🌅', items: morning });

  // ── MORNING SKINCARE ─────────────────────────────────────
  sections.push({
    id: 'am_skincare', title: 'Morning Skincare', time: '7:00 AM · Post-gym', emoji: '🧴',
    items: [
      { id: 'am_skin_1', label: 'Step 1 — Shiseido Cleanser' },
      { id: 'am_skin_2', label: 'Step 2 — Niacinamide 10% + Zinc (3 drops)' },
      { id: 'am_skin_3', label: 'Step 3 — SPF 35 Tinted Mineral (two finger-lengths)' },
    ],
  });

  // ── HAIR CARE ────────────────────────────────────────────
  sections.push({
    id: 'hair', title: 'Hair Care', time: 'After Morning Skincare', emoji: '💈',
    items: HAIR_BY_DAY[day] ?? [],
  });

  // ── WORK ─────────────────────────────────────────────────
  sections.push({
    id: 'work', title: 'Work', time: '8:30 AM – 5:00 PM', emoji: '💼',
    items: [
      { id: 'work_job',      label: 'Job application', subtitle: '⏰ 10:00 AM' },
      { id: 'work_linkedin', label: 'LinkedIn activity', subtitle: '⏰ 12:00 PM' },
    ],
  });

  // ── EVENING ──────────────────────────────────────────────
  sections.push({
    id: 'evening', title: 'Evening', time: '5:30 PM', emoji: '🌆',
    items: [
      { id: 'eve_meditation', label: 'Meditation & cleaning (decompress)' },
      { id: 'eve_lumber',     label: 'Lumber outreach — min 1 contact' },
      { id: 'eve_amazon',     label: 'Amazon FBA task' },
    ],
  });

  // ── NIGHT ────────────────────────────────────────────────
  sections.push({
    id: 'night', title: 'Night', time: '8:00 PM', emoji: '🌙',
    items: [
      { id: 'night_dinner', label: 'Dinner, phone-free', subtitle: '8:00 PM' },
      { id: 'night_call',   label: 'Family or friend call', subtitle: '8:30 PM' },
    ],
  });

  // ── EVENING SKINCARE ─────────────────────────────────────
  const pmActive = PM_ACTIVE[day];
  sections.push({
    id: 'pm_skincare', title: 'Evening Skincare', time: '9:00 PM', emoji: '🌛',
    items: [
      { id: 'pm_skin_1', label: 'Step 1 — Shiseido Cleanser' },
      { id: 'pm_skin_2', label: `Step 2 — ${pmActive}`, badge: 'Tonight' },
      { id: 'pm_skin_3', label: 'Step 3 — Pyunkang Yul Barrier Cream' },
    ],
  });

  // ── NIGHT CLOSE ──────────────────────────────────────────
  sections.push({
    id: 'night_close', title: 'Night Close', time: '9:30 PM+', emoji: '📖',
    items: [
      { id: 'night_reading', label: 'Evening book reading (20 min min)', subtitle: '9:30 PM' },
      { id: 'night_journal', label: '3-line journal entry', subtitle: '10:00 PM', isJournal: true },
      { id: 'night_phone',   label: 'Phone out of bedroom', subtitle: '10:00 PM' },
    ],
  });

  return sections;
};

/** All possible habit IDs — used for streak queries */
export const ALL_HABIT_IDS = [
  'morning_water','morning_meditation','morning_lllt','morning_gym','morning_ready',
  'am_skin_1','am_skin_2','am_skin_3',
  'hair_rinse','hair_scalp','hair_beard','hair_refill','hair_nizoral_mon',
  'hair_scalp_pregym','hair_nizoral_wed','hair_cerave','hair_dermaroll',
  'hair_scalp_sat','hair_rinse_sat','hair_minoxidil',
  'work_job','work_linkedin',
  'eve_meditation','eve_lumber','eve_amazon',
  'night_dinner','night_call',
  'pm_skin_1','pm_skin_2','pm_skin_3',
  'night_reading','night_journal','night_phone',
];
