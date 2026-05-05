/**
 * Blood Analysis API Client
 *
 * Connects the OVA mobile app to the backend /analyze-blood endpoint.
 *
 * Usage:
 *   import { analyzeBlood } from '@/lib/bloodAnalysisApi';
 *
 *   const result = await analyzeBlood({
 *     color: 'dark_red',
 *     flow: 'heavy',
 *     clots: true,
 *     phase: 'menstrual',
 *   });
 */

// Android emulator → host machine; iOS sim → localhost
// For physical devices: use your computer's LAN IP
const API_BASE_URL = __DEV__
  ? "http://10.0.2.2:3001"
  : "https://your-production-server.com";

/**
 * Analyze period blood data and get personalized recommendations.
 *
 * @param {Object} params
 * @param {string} params.color  - bright_red | dark_red | brown | pink
 * @param {string} params.flow   - light | medium | heavy
 * @param {boolean} params.clots - whether clots are present
 * @param {string} params.phase  - menstrual | follicular | ovulatory | luteal
 * @returns {Promise<Object>} Analysis result with diet, exercise, insights
 */
export async function analyzeBlood({ color, flow, clots, phase }) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-blood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color, flow, clots, phase }),
    });

    const data = await response.json();
    return {
      status: data.status || "normal",
      statusLabel: data.status_label || "Normal Pattern",
      insight: data.insight || "Listen to your body and stay hydrated.",
      diet: data.diet || [],
      avoid: data.avoid || [],
      exercise: data.exercise || [],
      nutrients: data.nutrients || [],
      wellness: data.wellness || "",
      exerciseNote: data.exerciseNote || "",
      source: data.source || "unknown",
    };
  } catch (error) {
    console.warn("[bloodAnalysisApi] Network error:", error.message);

    // Offline fallback
    return {
      status: "normal",
      statusLabel: "Normal Pattern",
      insight:
        "Unable to reach the server right now. As a general tip: stay hydrated, eat iron-rich foods, and rest when your body asks for it.",
      diet: [
        "Iron-rich leafy greens (spinach, kale)",
        "Warm lentil soup",
        "Fresh fruits for vitamin C",
        "Whole grains for sustained energy",
      ],
      avoid: ["Excess caffeine", "Highly processed foods", "Very salty snacks"],
      exercise: [
        "Gentle stretching",
        "Short, easy walks",
        "Deep breathing exercises",
      ],
      nutrients: ["Iron", "Vitamin C", "Magnesium"],
      wellness: "Be gentle with yourself today.",
      exerciseNote: "Listen to your body and move at your own pace.",
      source: "offline_fallback",
    };
  }
}
