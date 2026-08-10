// ============================================================
// Diet Plan — Nitin Gupta (06.08.26)
// "So I know what to eat and when." Static reference, by time of day.
// YouTube links are reference-only (see disclaimer).
// ============================================================

const yt = (label, id) => ({ label, url: `https://youtube.com/shorts/${id}` });

export const DIET_META = {
  title: 'Diet Plan',
  name: 'Nitin Gupta',
  date: '06.08.26',
};

// Rough training-day target from the Phase 2 plan (~2,900–3,000 kcal).
export const DAILY_KCAL_TARGET = 2900;

// slot types: 'single' → items[]  ·  'options' → options[]
export const MEALS = [
  {
    id: 'pre',
    slot: 'Pre-Workout',
    time: 'before training',
    emoji: '⚡',
    kcal: 200,
    type: 'single',
    items: [
      { text: '1 scoop creatine mixed in water' },
      {
        text: '2 small homemade dry-fruit laddus',
        note: 'Make a 15–20 day batch, store it properly, have 2 laddoo daily.',
        links: [yt('Dry-fruit ladoo recipe', 'ILTeub6eVxk')],
      },
    ],
  },
  {
    id: 'post',
    slot: 'Post-Workout',
    time: 'within ~1 hr of finishing',
    emoji: '🥤',
    kcal: 330,
    type: 'single',
    items: [
      { text: 'Smoothie: 1 scoop protein powder + 100 ml almond or oats milk + 20 g soaked oats + 1 medium fruit of choice' },
    ],
  },
  {
    id: 'breakfast',
    slot: 'Breakfast',
    time: 'morning',
    emoji: '🍳',
    kcal: 420,
    type: 'options',
    options: [
      { title: 'Egg Omelette with Gluten-free Bread', lines: ['2 whole eggs', 'Served with 2 slices of gluten-free bread'] },
      { title: 'Gluten-free avocado egg sandwich', lines: ['2 gluten-free bread slices + 2 whole eggs + ½ avocado'], links: [yt('Recipe', 'joJMWCFHKmo')] },
      { title: '2 slices gluten-free bread + hummus or avocado dip', lines: ['Prepare fresh hummus, refrigerate up to 1 week'], links: [yt('Hummus dip', 'ZCnHXEzvK3Y'), yt('Avocado dip', 'w0VFbi3Cfao')] },
      { title: 'Ragi Porridge', lines: ['2 tbsp ragi powder + cardamom, palm sugar and a little milk'], links: [yt('Recipe', 'cCRSlo8l_As')] },
      { title: 'Poha with Peanuts & Sprouts', lines: ['1 bowl of poha topped with peanuts and sprouts'] },
    ],
  },
  {
    id: 'mid',
    slot: 'Mid-Morning',
    time: 'mid-morning',
    emoji: '🥜',
    kcal: 200,
    type: 'single',
    items: [
      { text: '1 peanut-jaggery chikki, or beetroot chips, or sweet-potato chips — add 1–2 tsp virgin olive oil' },
    ],
  },
  {
    id: 'lunch',
    slot: 'Lunch',
    time: '1:00 pm',
    emoji: '🍛',
    kcal: 600,
    type: 'options',
    options: [
      { title: '2 Hummus & veggie wraps', lines: ['2 tbsp hummus + 1 whole-wheat roti + 60–80 g veggies + ½ avocado'], links: [yt('Wrap', 'l_BGRCgAzIc'), yt('Hummus', 'e16giQTp0z0')] },
      { title: 'Tofu Burji', lines: ['1 bowl tofu burji (80 g) + ½ bowl rice + 2 jowar / ragi roti'] },
      { title: 'Lauki Chana Dal', lines: ['1 bowl + ½ bowl jeera rice + 2 besan roti + 1 amla'] },
      { title: '2-Egg Omelette', lines: ['2-egg omelette + 2 jowar / ragi roti + ½ bowl rice'] },
      { title: 'Egg Fried Rice (healthy)', lines: ['2 eggs + 100 g rice + 100 g vegetables (very little soy sauce)'], links: [yt('Recipe', 'CJauy8hpANQ')] },
      { title: 'Nutrela Pulao', lines: ['2 bowls, using 80 g soybean'], links: [yt('Recipe', 'V_M1ONvgOl8')] },
    ],
    notes: ['You can increase the quantity as per your appetite.'],
  },
  {
    id: 'eve1',
    slot: 'Evening 1',
    time: '4:00 pm',
    emoji: '🥛',
    kcal: 220,
    type: 'single',
    items: [
      { text: 'Protein Smoothie: ½ scoop protein powder + 100 g Greek yogurt + 1 fruit of choice' },
    ],
  },
  {
    id: 'eve2',
    slot: 'Evening 2',
    time: '6:30 pm',
    emoji: '🥑',
    kcal: 260,
    type: 'single',
    items: [
      { text: '2 slices gluten-free bread + hummus dip or avocado dip', links: [yt('Hummus dip', 'ZCnHXEzvK3Y'), yt('Avocado dip', 'w0VFbi3Cfao')] },
    ],
  },
  {
    id: 'dinner',
    slot: 'Dinner',
    time: '9:00 pm',
    emoji: '🌙',
    kcal: 600,
    type: 'options',
    options: [
      { title: 'Spinach & Egg Wrap', lines: ['½ bowl chopped spinach + 2 eggs + 1 whole-wheat roti'], links: [yt('Recipe', 'R_2au-IrvQU')] },
      { title: 'Baingan Bharta', lines: ['1 bowl baingan bharta + 1 bowl tadka dal + ½ bowl rice + 2 roti'] },
      { title: '2-Egg Bhurji', lines: ['1 bowl 2-egg bhurji + ½ bowl rice + 2 roti'] },
      { title: 'Dal Makhani (or any dal)', lines: ['1 bowl + ½ bowl rice + 1–2 roti'] },
      { title: 'Drumstick Dal Fry / Lauki Dal', lines: ['1 bowl + ½ bowl rice + 1–2 jowar / ragi / wheat roti'], links: [yt('Drumstick dal', 'tSOHoTlRjEU'), yt('Lauki dal', 'SI8j40yip1c')] },
      { title: 'Veg Pulao', lines: ['2 bowls + paneer / soybean / mushroom 60 g + 100–150 g cooked rice + 1 bowl boondi raita'] },
    ],
    notes: ['Have 2 dates or 1–2 ladus after dinner.', 'You can increase the quantity as per your appetite.'],
  },
];

export const DISCLAIMER =
  'YouTube links are for reference only — do NOT use the large amounts of oil or ghee shown in them. ' +
  'Avoid preservatives, sauces, vinegar, soy sauce and other processed ingredients. Your dish should be ' +
  '100% homemade from natural ingredients. Do not use chia seeds without soaking.';

// mealId → estimated kcal (used to total up checked meals)
export const KCAL_BY_ID = Object.fromEntries(MEALS.map(m => [m.id, m.kcal]));
export const TOTAL_PLAN_KCAL = MEALS.reduce((sum, m) => sum + m.kcal, 0);

export const LIFESTYLE = [
  'Avoid long meal gaps.',
  'Eat slowly and chew properly.',
  'Keep stress to a minimum — try to manage it.',
  'Sleep by 11–11:30 pm.',
  'No gadgets after 10:30 pm — try meditation or read a book.',
  'Say no to smoking.',
];
