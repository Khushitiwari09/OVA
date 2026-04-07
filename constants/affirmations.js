const AFFIRMATIONS = [
  "You're doing great today — one step at a time.",
  "Be gentle with yourself. You deserve kindness.",
  "Your body is incredible. Trust its rhythm.",
  "Rest is not laziness. It's self-care.",
  "Every cycle is a renewal. Embrace it.",
  "You are stronger than you think.",
  "It's okay to slow down and just breathe.",
  "Your feelings are valid, always.",
  "Small steps every day make a big difference.",
  "Take care of your body — it's the only one you have.",
  "You are worthy of love and care.",
  "Embrace the changes. Growth looks different for everyone.",
  "Today is a fresh start. Make it yours.",
  "You don't have to be perfect. You just have to be you.",
  "Listen to your body. It speaks in whispers.",
  "Nourish your mind, body, and soul today.",
  "Progress, not perfection, is what matters.",
  "You are resilient, and that is beautiful.",
  "Let go of what you can't control. Focus on what you can.",
  "Your wellness journey is unique. Own it.",
  "Hydration, rest, and kindness — the magic trio.",
  "You are more than your symptoms.",
  "Celebrate the small victories today.",
  "Your cycle is a superpower, not a setback.",
  "Be proud of how far you've come.",
  "Some days are harder. That's perfectly okay.",
  "Your energy will return. Trust the process.",
  "Breathe in calm, breathe out tension.",
  "You are exactly where you need to be.",
  "Tomorrow is another chance to bloom.",
];

/**
 * Returns today's affirmation (rotates daily based on day-of-year).
 */
export function getDailyAffirmation() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
}

export default AFFIRMATIONS;
