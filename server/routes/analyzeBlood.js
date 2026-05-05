/**
 * POST /analyze-blood — Analyze period blood characteristics
 *
 * Takes color, flow, clots, and cycle phase to generate:
 *   - Pattern classification (normal / needs attention)
 *   - Personalized insight text
 *   - Diet recommendations
 *   - Foods to avoid
 *   - Exercise suggestions
 *   - Key nutrients needed
 *
 * SAFETY: Never diagnoses. Uses soft, supportive language throughout.
 */

/* ════════════════════════════════════════════════════════════════
   Knowledge Base — evidence-informed, non-diagnostic
   ════════════════════════════════════════════════════════════════ */

const COLOR_DATA = {
  bright_red: {
    status: "normal",
    insight:
      "Bright red flow is very common, especially in the first few days of your period. It typically indicates fresh, steady flow.",
    nutrients: ["Iron", "Vitamin C", "Folate"],
    diet: [
      "Spinach and kale salad with lemon dressing",
      "Lentil soup with turmeric",
      "Pomegranate or beetroot smoothie",
      "Dark leafy greens with citrus",
    ],
    avoid: ["Excess caffeine", "Heavily processed foods", "Very salty snacks"],
    exercise: [
      "Gentle yoga (child's pose, cat-cow)",
      "15-minute nature walk",
      "Light stretching routine",
    ],
  },
  dark_red: {
    status: "normal",
    insight:
      "Dark red flow often appears toward the middle or end of your period. It can mean the blood has taken a bit longer to leave the body, which is perfectly normal.",
    nutrients: ["Iron", "Magnesium", "Vitamin B12"],
    diet: [
      "Warm oatmeal with dates and walnuts",
      "Grilled salmon or tofu with quinoa",
      "Dark chocolate (70%+ cocoa) in moderation",
      "Iron-fortified cereals with berries",
    ],
    avoid: [
      "Excess dairy if you notice bloating",
      "Refined sugar",
      "Fried foods",
    ],
    exercise: [
      "Slow-paced swimming or water walking",
      "Restorative yoga poses",
      "Deep breathing exercises (4-7-8 technique)",
    ],
  },
  brown: {
    status: "normal",
    insight:
      "Brown spotting is often older blood that took more time to exit. It's commonly seen at the very start or end of a period and is generally considered normal.",
    nutrients: ["Iron", "Zinc", "Omega-3"],
    diet: [
      "Pumpkin seeds and trail mix",
      "Warm bone broth or vegetable broth",
      "Avocado toast with hemp seeds",
      "Baked sweet potato with tahini",
    ],
    avoid: ["Alcohol", "Excess caffeine", "Artificial sweeteners"],
    exercise: [
      "Tai chi or gentle flow yoga",
      "Slow walking in fresh air",
      "Light Pilates (mat work only)",
    ],
  },
  pink: {
    status: "needs_attention",
    insight:
      "Pink-tinted flow can sometimes indicate lighter flow or mixing with cervical fluid. While often normal at the start or end of a period, it may benefit from tracking over a few cycles. Consider speaking with your healthcare provider if it persists.",
    nutrients: ["Iron", "Vitamin C", "B-complex vitamins"],
    diet: [
      "Beetroot and carrot juice",
      "Chickpea stew with spinach",
      "Eggs with whole grain toast",
      "Fresh fruit bowl (berries, kiwi, oranges)",
    ],
    avoid: ["Skipping meals", "Very low-calorie diets", "Excessive exercise"],
    exercise: [
      "Gentle stretching only",
      "Short, easy walk (10 minutes)",
      "Mindful breathing and meditation",
    ],
  },
};

const FLOW_MODIFIERS = {
  light: {
    statusBump: false,
    insightAdd:
      " A lighter flow can be common and varies naturally from cycle to cycle.",
    dietAdd: ["Hydrating foods like cucumber and watermelon"],
    exerciseAdd: ["Moderate walking is usually comfortable"],
  },
  medium: {
    statusBump: false,
    insightAdd: " A medium flow is very typical and usually well-managed with regular care.",
    dietAdd: ["Balanced meals with protein and complex carbs"],
    exerciseAdd: ["Most regular activities should feel comfortable"],
  },
  heavy: {
    statusBump: true,
    insightAdd:
      " Heavier flow may benefit from extra attention to iron-rich foods and hydration. If heavy flow soaks through protection in under an hour, consider checking in with a healthcare provider.",
    dietAdd: [
      "Extra iron sources: red meat, lentils, or fortified cereals",
      "Vitamin C-rich fruits to help iron absorption",
    ],
    exerciseAdd: [
      "Keep activity gentle — your body is working hard",
      "Rest when needed — it's not laziness, it's recovery",
    ],
    avoidAdd: ["Intense cardio or heavy lifting during heaviest days"],
  },
};

const CLOT_INFO = {
  true: {
    insightAdd:
      " Small clots (smaller than a coin) can be common, especially with heavier flow. If you notice very large or frequent clots, it may be worth mentioning to your healthcare provider at your next visit.",
    dietAdd: ["Omega-3 rich foods (walnuts, flaxseed, fatty fish)"],
    nutrientAdd: ["Omega-3 fatty acids"],
  },
  false: {
    insightAdd: "",
    dietAdd: [],
    nutrientAdd: [],
  },
};

const PHASE_TIPS = {
  menstrual: {
    wellness:
      "During menstruation, your body benefits from warmth, rest, and nourishment. Be gentle with yourself.",
    exerciseNote: "This is your body's rest-and-restore window.",
  },
  follicular: {
    wellness:
      "Your energy is building — a great time to explore new recipes and activities.",
    exerciseNote: "Energy is rising — you may feel ready for more movement.",
  },
  ovulatory: {
    wellness:
      "Peak energy phase! Your body can handle more intensity right now.",
    exerciseNote: "Your body is at peak performance — enjoy it!",
  },
  luteal: {
    wellness:
      "Progesterone is high, so cravings and lower energy are normal. Honor what your body asks for.",
    exerciseNote:
      "Moderate activity helps mood, but don't push too hard.",
  },
};

/* ════════════════════════════════════════════════════════════════
   Analysis Engine
   ════════════════════════════════════════════════════════════════ */

function analyzeBloodData({ color, flow, clots, phase }) {
  const colorKey = (color || "bright_red").toLowerCase().replace(/\s+/g, "_");
  const flowKey = (flow || "medium").toLowerCase();
  const hasClots = clots === true || clots === "yes" || clots === "Yes";
  const phaseKey = (phase || "menstrual").toLowerCase();

  const base = COLOR_DATA[colorKey] || COLOR_DATA.bright_red;
  const flowMod = FLOW_MODIFIERS[flowKey] || FLOW_MODIFIERS.medium;
  const clotMod = CLOT_INFO[hasClots] || CLOT_INFO.false;
  const phaseTip = PHASE_TIPS[phaseKey] || PHASE_TIPS.menstrual;

  // Determine status
  let status = base.status;
  if (flowMod.statusBump && colorKey === "pink") {
    status = "needs_attention";
  }

  // Build insight
  let insight = base.insight + flowMod.insightAdd + clotMod.insightAdd;

  // Combine diet
  const diet = [
    ...base.diet,
    ...flowMod.dietAdd,
    ...clotMod.dietAdd,
  ];

  // Combine avoid
  const avoid = [...base.avoid];
  if (flowMod.avoidAdd) {
    avoid.push(...flowMod.avoidAdd);
  }

  // Combine exercise
  const exercise = [
    ...base.exercise,
    ...flowMod.exerciseAdd,
  ];

  // Combine nutrients
  const nutrients = [
    ...new Set([...base.nutrients, ...clotMod.nutrientAdd]),
  ];

  return {
    status,
    insight,
    diet,
    avoid,
    exercise,
    nutrients,
    wellness: phaseTip.wellness,
    exerciseNote: phaseTip.exerciseNote,
  };
}

/* ════════════════════════════════════════════════════════════════
   Express Route Handler
   ════════════════════════════════════════════════════════════════ */

async function analyzeBlood(req, res) {
  try {
    const { color, flow, clots, phase } = req.body;

    // Validate — at least color or flow must be provided
    if (!color && !flow) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide at least 'color' or 'flow' in the request body.",
      });
    }

    console.log(
      `[analyze-blood] color=${color}, flow=${flow}, clots=${clots}, phase=${phase}`
    );

    const result = analyzeBloodData({ color, flow, clots, phase });

    return res.json({
      ...result,
      status_label:
        result.status === "normal" ? "Normal Pattern" : "May Need Attention",
      source: "analysis",
    });
  } catch (error) {
    console.error("[analyze-blood] Error:", error.message);
    return res.status(500).json({
      status: "normal",
      status_label: "Normal Pattern",
      insight:
        "We couldn't fully analyze your data right now. As a general suggestion, stay hydrated and listen to your body.",
      diet: [
        "Iron-rich leafy greens",
        "Warm soups and broths",
        "Fresh fruits for vitamin C",
      ],
      avoid: ["Excess caffeine", "Very salty foods"],
      exercise: ["Gentle stretching", "Short walks"],
      nutrients: ["Iron", "Vitamin C"],
      wellness: "Be gentle with yourself today.",
      source: "fallback",
    });
  }
}

module.exports = { analyzeBlood };
