/**
 * POST /generate-plan — Generate a personalized health plan
 *
 * Calls Hugging Face's BioMistral-7B model with user-provided
 * symptoms, cycle phase, and additional context.
 *
 * Returns a structured health plan with diet & exercise suggestions.
 */

const HF_MODEL_URL =
  "https://api-inference.huggingface.co/models/BioMistral/BioMistral-7B";

/**
 * Build a medically-aware prompt for BioMistral
 */
function buildPrompt({ symptoms, cyclePhase, additionalInfo }) {
  return `You are a compassionate women's health assistant named Aira, part of the OVA wellness app. Based on the following information, generate a personalized daily health plan.

## User Information
- **Current Symptoms**: ${symptoms || "None reported"}
- **Menstrual Cycle Phase**: ${cyclePhase || "Not specified"}
- **Additional Context**: ${additionalInfo || "None"}

## Instructions
Provide a structured, empathetic response with:

### 🍽️ Diet Plan
- Recommend 3-4 specific foods or meals suited to the cycle phase and symptoms
- Explain why each recommendation helps

### 🏃‍♀️ Exercise Plan  
- Suggest 2-3 exercises appropriate for the current phase
- Include intensity level and duration
- Note any exercises to avoid

### 💡 Wellness Tips
- 2-3 additional self-care suggestions
- Include hydration, sleep, or stress management advice

### ⚠️ When to Seek Help
- Briefly note any red-flag symptoms that warrant medical attention

Keep the tone warm, supportive, and non-judgmental. Use simple language.

---

Health Plan:`;
}

/**
 * Parse the raw model output into a clean response
 */
function parseModelOutput(rawOutput) {
  if (!rawOutput || rawOutput.length === 0) {
    return null;
  }

  // HF Inference API returns an array of objects with generated_text
  let text = "";

  if (Array.isArray(rawOutput)) {
    text = rawOutput[0]?.generated_text || "";
  } else if (typeof rawOutput === "object" && rawOutput.generated_text) {
    text = rawOutput.generated_text;
  } else if (typeof rawOutput === "string") {
    text = rawOutput;
  }

  // Extract only the generated plan (after our prompt)
  const planMarker = "Health Plan:";
  const markerIdx = text.lastIndexOf(planMarker);
  if (markerIdx !== -1) {
    text = text.substring(markerIdx + planMarker.length).trim();
  }

  return text || null;
}

/**
 * Fallback plan when the model is unavailable
 */
function getFallbackPlan(cyclePhase) {
  const phase = (cyclePhase || "").toLowerCase();

  const plans = {
    menstrual: {
      diet: "Focus on iron-rich foods (spinach, lentils, dark chocolate). Stay hydrated with warm herbal teas. Include omega-3 sources like walnuts and flaxseeds.",
      exercise: "Gentle yoga, light walking (15-20 min), and stretching. Avoid high-intensity workouts. Listen to your body — rest is productive too.",
      tips: "Use a warm compress for cramps. Prioritize sleep (7-9 hours). Practice deep breathing for 5 minutes before bed.",
    },
    follicular: {
      diet: "Increase protein intake (eggs, lean chicken, tofu). Add fermented foods for gut health. Include leafy greens and citrus fruits for vitamin C.",
      exercise: "This is your high-energy phase! Try cardio, dancing, or strength training. Aim for 30-45 minutes of moderate activity.",
      tips: "Great time to start new habits. Your body recovers faster now. Stay consistent with hydration (8+ glasses daily).",
    },
    ovulatory: {
      diet: "Light, fiber-rich meals. Include anti-inflammatory foods (turmeric, berries). Focus on cruciferous vegetables (broccoli, cauliflower).",
      exercise: "Peak performance phase — try HIIT, running, or group fitness. Your endurance is at its highest.",
      tips: "Be mindful of bloating. Support your liver with lemon water. This is a great social phase — connect with loved ones.",
    },
    luteal: {
      diet: "Complex carbs (sweet potato, brown rice, oats) to support serotonin. Magnesium-rich foods (dark chocolate, almonds). Reduce salt and caffeine.",
      exercise: "Moderate exercise — Pilates, swimming, or brisk walking. Gradually reduce intensity as your period approaches.",
      tips: "PMS may appear — be patient with yourself. Journaling can help with mood shifts. Prioritize calming activities before sleep.",
    },
  };

  const selected = plans[phase] || plans.follicular;

  return `**🍽️ Diet Plan**\n${selected.diet}\n\n**🏃‍♀️ Exercise Plan**\n${selected.exercise}\n\n**💡 Wellness Tips**\n${selected.tips}\n\n*Note: This is a general recommendation. For persistent symptoms, please consult a healthcare provider.*`;
}

/**
 * Express route handler
 */
async function generateHealthPlan(req, res) {
  try {
    /* ── Validate request body ── */
    const { symptoms, cyclePhase, additionalInfo } = req.body;

    if (!symptoms && !cyclePhase) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide at least 'symptoms' or 'cyclePhase' in the request body.",
      });
    }

    /* ── Check API key ── */
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      console.warn("[generate-plan] HF_API_KEY not configured — using fallback");
      return res.json({
        plan: getFallbackPlan(cyclePhase),
        status: "success",
        source: "fallback",
        message: "Generated from built-in recommendations (API key not configured).",
      });
    }

    /* ── Build prompt ── */
    const prompt = buildPrompt({ symptoms, cyclePhase, additionalInfo });

    /* ── Call Hugging Face Inference API ── */
    console.log(`[generate-plan] Calling BioMistral for phase: ${cyclePhase || "unspecified"}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const hfResponse = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
        options: {
          wait_for_model: true, // Wait if model is loading (cold start)
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    /* ── Handle HF API errors ── */
    if (!hfResponse.ok) {
      const errorBody = await hfResponse.text();
      console.error(`[generate-plan] HF API error ${hfResponse.status}:`, errorBody);

      // Model loading — return fallback with retry hint
      if (hfResponse.status === 503) {
        return res.status(202).json({
          plan: getFallbackPlan(cyclePhase),
          status: "success",
          source: "fallback",
          message: "The AI model is warming up. Here are recommendations while it loads.",
          retryAfter: 30,
        });
      }

      // Rate limited
      if (hfResponse.status === 429) {
        return res.status(429).json({
          plan: getFallbackPlan(cyclePhase),
          status: "success",
          source: "fallback",
          message: "Rate limit reached. Showing built-in recommendations.",
        });
      }

      // Auth failure — don't expose details
      if (hfResponse.status === 401 || hfResponse.status === 403) {
        console.error("[generate-plan] Authentication failed — check HF_API_KEY");
        return res.status(500).json({
          plan: getFallbackPlan(cyclePhase),
          status: "success",
          source: "fallback",
          message: "Service temporarily unavailable. Showing built-in recommendations.",
        });
      }

      // Generic error
      return res.status(502).json({
        plan: getFallbackPlan(cyclePhase),
        status: "success",
        source: "fallback",
        message: "AI service unavailable. Showing built-in recommendations.",
      });
    }

    /* ── Parse response ── */
    const rawOutput = await hfResponse.json();
    const plan = parseModelOutput(rawOutput);

    if (!plan) {
      console.warn("[generate-plan] Empty model output — using fallback");
      return res.json({
        plan: getFallbackPlan(cyclePhase),
        status: "success",
        source: "fallback",
        message: "Model returned empty response. Showing built-in recommendations.",
      });
    }

    /* ── Success ── */
    console.log(`[generate-plan] Successfully generated plan (${plan.length} chars)`);

    return res.json({
      plan,
      status: "success",
      source: "ai",
    });
  } catch (error) {
    /* ── Catch-all error handling ── */
    if (error.name === "AbortError") {
      console.error("[generate-plan] Request timed out after 30s");
      return res.status(504).json({
        plan: getFallbackPlan(req.body?.cyclePhase),
        status: "success",
        source: "fallback",
        message: "Request timed out. Showing built-in recommendations.",
      });
    }

    console.error("[generate-plan] Unexpected error:", error.message);
    return res.status(500).json({
      plan: getFallbackPlan(req.body?.cyclePhase),
      status: "success",
      source: "fallback",
      message: "Something went wrong. Showing built-in recommendations.",
    });
  }
}

module.exports = { generateHealthPlan };
