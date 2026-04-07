// ──────────────────────────────────────────────────────────
// Cycle Calculation Utilities
// Pure functions — no React dependency
// ──────────────────────────────────────────────────────────

/**
 * Returns a midnight-normalised copy of a Date.
 */
function normalise(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Day difference (date2 – date1), ignoring time.
 */
function daysBetween(date1, date2) {
  const a = normalise(date1).getTime();
  const b = normalise(date2).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

/**
 * Format a Date to YYYY-MM-DD string (for react-native-calendars).
 */
export function toDateString(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns true when d1 and d2 fall on the same calendar day.
 */
export function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// ──────────────────────────────────────────────────────────
// Core calculations
// ──────────────────────────────────────────────────────────

/**
 * @param {Object} cycleData
 * @param {Date}   cycleData.lastPeriodDate
 * @param {number} cycleData.cycleLength    – total cycle in days
 * @param {number} cycleData.periodDuration – bleed length in days
 */
export function getNextPeriodDate({ lastPeriodDate, cycleLength }) {
  const d = new Date(lastPeriodDate);
  d.setDate(d.getDate() + cycleLength);
  return normalise(d);
}

export function getOvulationDay({ lastPeriodDate, cycleLength }) {
  const next = getNextPeriodDate({ lastPeriodDate, cycleLength });
  next.setDate(next.getDate() - 14);
  return normalise(next);
}

export function getFertileWindow({ lastPeriodDate, cycleLength }) {
  const ov = getOvulationDay({ lastPeriodDate, cycleLength });
  const start = new Date(ov);
  start.setDate(start.getDate() - 3);
  const end = new Date(ov);
  end.setDate(end.getDate() + 2);
  return { start: normalise(start), end: normalise(end) };
}

// ──────────────────────────────────────────────────────────
// Marked dates for react-native-calendars
// ──────────────────────────────────────────────────────────

/**
 * Builds a `markedDates` object for <Calendar /> covering
 * several cycles (past 3 → future 4) so the user always
 * sees marks when scrolling through months.
 *
 * Color scheme:
 *   Period    → #F8D7DA  (soft pink)
 *   Ovulation → #E6D8F5  (lavender)
 *   Fertile   → #EFE3FF  (light purple)
 *   Normal    → #F5F1EB  (beige) — only for today
 */
export function buildMarkedDates({ lastPeriodDate, cycleLength, periodDuration }) {
  if (!lastPeriodDate) return {};

  const lpd = normalise(new Date(lastPeriodDate));
  const marks = {};

  for (let cycle = -3; cycle <= 4; cycle++) {
    const cycleStart = new Date(lpd);
    cycleStart.setDate(cycleStart.getDate() + cycle * cycleLength);

    // Period days (day 0 → duration-1)
    for (let d = 0; d < periodDuration; d++) {
      const pd = new Date(cycleStart);
      pd.setDate(pd.getDate() + d);
      const key = toDateString(pd);
      marks[key] = {
        customStyles: {
          container: {
            backgroundColor: "#F8D7DA",
            borderRadius: 18,
          },
          text: {
            color: "#943B4F",
            fontWeight: "600",
          },
        },
        phase: "menstrual",
      };
    }

    // Ovulation day  (nextCycleStart – 14)
    const nextCycleStart = new Date(cycleStart);
    nextCycleStart.setDate(nextCycleStart.getDate() + cycleLength);
    const ovDay = new Date(nextCycleStart);
    ovDay.setDate(ovDay.getDate() - 14);

    // Fertile window  (ov – 3 → ov + 2, excluding exact ov day)
    for (let d = -3; d <= 2; d++) {
      const fd = new Date(ovDay);
      fd.setDate(fd.getDate() + d);
      const key = toDateString(fd);
      if (marks[key]) continue; // period takes priority
      if (d === 0) {
        // Ovulation day itself
        marks[key] = {
          customStyles: {
            container: {
              backgroundColor: "#E6D8F5",
              borderRadius: 18,
            },
            text: {
              color: "#6B4D8A",
              fontWeight: "600",
            },
          },
          phase: "ovulation",
        };
      } else {
        marks[key] = {
          customStyles: {
            container: {
              backgroundColor: "#EFE3FF",
              borderRadius: 18,
            },
            text: {
              color: "#7B63A0",
              fontWeight: "500",
            },
          },
          phase: "fertile",
        };
      }
    }
  }

  // Today marker (if not already marked)
  const todayKey = toDateString(new Date());
  if (!marks[todayKey]) {
    marks[todayKey] = {
      customStyles: {
        container: {
          backgroundColor: "#F5F1EB",
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: "#D4C5BA",
        },
        text: {
          color: "#7A6A5C",
          fontWeight: "600",
        },
      },
      phase: "normal",
    };
  } else {
    // Add border to show today even if it's on a phase day
    marks[todayKey].customStyles.container.borderWidth = 2;
    marks[todayKey].customStyles.container.borderColor = "#7A6A5C";
  }

  return marks;
}

// ──────────────────────────────────────────────────────────
// Phase detection
// ──────────────────────────────────────────────────────────

/**
 * Determines which cycle phase a given date falls in.
 *
 * Phases (for one cycle starting at cycleStart):
 *   Menstrual:   day 0  → day (periodDuration – 1)
 *   Follicular:  day periodDuration → day (ovDay – 4)
 *   Ovulation:   day (ovDay – 3) → day (ovDay + 2)       ← ±2 around ov
 *   Luteal:      day (ovDay + 3) → day (cycleLength – 1)
 *
 * @returns {"menstrual"|"follicular"|"ovulation"|"luteal"}
 */
export function getPhase(date, { lastPeriodDate, cycleLength, periodDuration }) {
  const target = normalise(date);
  const lpd = normalise(new Date(lastPeriodDate));

  const totalDays = daysBetween(lpd, target);
  const cycleIndex = Math.floor(totalDays / cycleLength);
  const cycleStart = new Date(lpd);
  cycleStart.setDate(cycleStart.getDate() + cycleIndex * cycleLength);

  const dayInCycle = daysBetween(cycleStart, target);
  const ovDayInCycle = cycleLength - 14;

  if (dayInCycle < 0) return "luteal";
  if (dayInCycle < periodDuration) return "menstrual";
  if (dayInCycle < ovDayInCycle - 3) return "follicular";
  if (dayInCycle <= ovDayInCycle + 2) return "ovulation";
  return "luteal";
}

// ──────────────────────────────────────────────────────────
// Phase helper content
// ──────────────────────────────────────────────────────────

const PHASE_DATA = {
  menstrual: {
    name: "Menstrual Phase",
    icon: "favorite",
    color: "#E8889A",
    bgColor: "rgba(248, 215, 218, 0.35)",
    description:
      "Your body is shedding its uterine lining. It's perfectly natural to feel more inward and reflective during this time.",
    body: {
      energy: "Lower than usual — rest is your friend",
      mood: "You may feel more introspective or sensitive",
      skin: "Skin can be slightly drier or more reactive",
    },
    tips: [
      "Stay warm and comfortable",
      "Gentle stretching or yoga can ease cramps",
      "Iron-rich foods and warm fluids help recovery",
      "Allow yourself extra rest without guilt",
    ],
  },
  follicular: {
    name: "Follicular Phase",
    icon: "eco",
    color: "#8BB8A8",
    bgColor: "rgba(139, 184, 168, 0.12)",
    description:
      "Estrogen is slowly rising, helping your body prepare for ovulation. Energy and optimism tend to build steadily.",
    body: {
      energy: "Gradually increasing — a great time to start new things",
      mood: "Generally positive, creative, and social",
      skin: "Tends to clear up and look more radiant",
    },
    tips: [
      "Channel rising energy into creative projects",
      "Great time for moderate-to-intense exercise",
      "Focus on nutrient-dense, balanced meals",
      "Plan social activities — your sociability peaks",
    ],
  },
  ovulation: {
    name: "Ovulation Phase",
    icon: "auto-awesome",
    color: "#9B7CC0",
    bgColor: "rgba(230, 216, 245, 0.35)",
    description:
      "An egg is released from the ovary. This is typically your highest-energy window, and confidence tends to be at its peak.",
    body: {
      energy: "Highest of the entire cycle",
      mood: "Confident, outgoing, and emotionally balanced",
      skin: "Natural glow — skin looks its best",
    },
    tips: [
      "Leverage peak energy for challenging workouts",
      "Ideal window for important conversations or presentations",
      "Stay well-hydrated as body temperature rises slightly",
      "If tracking fertility, note cervical mucus changes",
    ],
  },
  luteal: {
    name: "Luteal Phase",
    icon: "nightlight-round",
    color: "#D4A89C",
    bgColor: "rgba(212, 168, 156, 0.12)",
    description:
      "Progesterone rises as your body prepares for the next cycle. Energy gradually slows, and cravings are completely normal.",
    body: {
      energy: "Declining — your body is asking for gentleness",
      mood: "You may feel more emotional or easily frustrated",
      skin: "Breakouts or oiliness may appear, especially late in this phase",
    },
    tips: [
      "Prioritise sleep and calming routines",
      "Balanced meals help manage cravings",
      "Light exercise like walking or swimming is ideal",
      "Journaling or mindfulness can ease emotional swings",
    ],
  },
};

/**
 * Master function — returns full phase info for a given date.
 *
 * @param {Date}   date
 * @param {Object} cycleData  { lastPeriodDate, cycleLength, periodDuration }
 * @returns {Object} { phase, dayInCycle, cycleLength, name, icon, ... }
 */
export function getPhaseInfo(date, cycleData) {
  const phase = getPhase(date, cycleData);
  const data = PHASE_DATA[phase];

  const target = normalise(date);
  const lpd = normalise(new Date(cycleData.lastPeriodDate));
  const totalDays = daysBetween(lpd, target);
  const cycleIndex = Math.floor(totalDays / cycleData.cycleLength);
  const cycleStart = new Date(lpd);
  cycleStart.setDate(cycleStart.getDate() + cycleIndex * cycleData.cycleLength);
  const dayInCycle = daysBetween(cycleStart, target) + 1; // 1-indexed

  return {
    phase,
    dayInCycle: Math.max(1, dayInCycle),
    cycleLength: cycleData.cycleLength,
    ...data,
  };
}
