/**
 * OVA Health Plan API Client
 *
 * Connects the mobile app to the OVA backend server.
 * The backend proxies requests to Hugging Face — the API token
 * never touches the frontend.
 *
 * Usage:
 *   import { generateHealthPlan } from '@/lib/healthPlanApi';
 *
 *   const result = await generateHealthPlan({
 *     symptoms: 'cramps, fatigue',
 *     cyclePhase: 'menstrual',
 *     additionalInfo: 'feeling stressed',
 *   });
 *
 *   if (result.status === 'success') {
 *     console.log(result.plan);
 *   }
 */

// For local dev: use your machine's LAN IP (not localhost)
// In production: replace with your deployed server URL
const API_BASE_URL = __DEV__
  ? "http://10.0.2.2:3001" // Android emulator → host machine
  : "https://your-production-server.com";

// iOS simulator uses localhost, physical devices need LAN IP
// Uncomment the line below for iOS simulator:
// const API_BASE_URL = "http://localhost:3001";

/**
 * Generate a personalized health plan
 *
 * @param {Object} params
 * @param {string} params.symptoms - User's current symptoms
 * @param {string} params.cyclePhase - Current menstrual cycle phase
 * @param {string} [params.additionalInfo] - Optional additional context
 * @returns {Promise<{plan: string, status: string, source: string, message?: string}>}
 */
export async function generateHealthPlan({ symptoms, cyclePhase, additionalInfo }) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms,
        cyclePhase,
        additionalInfo,
      }),
    });

    const data = await response.json();

    // Even error responses include a fallback plan
    return {
      plan: data.plan || "Unable to generate a plan right now. Please try again.",
      status: data.status || "error",
      source: data.source || "unknown",
      message: data.message,
    };
  } catch (error) {
    console.warn("[healthPlanApi] Network error:", error.message);

    return {
      plan: "Unable to reach the server. Please check your connection and try again.",
      status: "error",
      source: "network_error",
      message: error.message,
    };
  }
}

/**
 * Check if the backend server is reachable
 *
 * @returns {Promise<boolean>}
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}
