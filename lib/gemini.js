const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Send a conversation to Groq and return the AI response text.
 * Note: Kept the function name generic/same so it doesn't break existing useAI hook imports!
 *
 * @param {string} userMessage — latest user input
 * @param {string} systemPrompt — cycle-aware system context
 * @param {Array}  history — previous { role, text } messages
 * @returns {string} AI response text
 */
export async function generateGeminiResponse(
  userMessage,
  systemPrompt,
  history = []
) {
  console.log("\n==================================");
  console.log("[Aira AI] Preparing Groq API Request...");
  console.log(`[Aira AI] User Message Prompt: "${userMessage}"`);

  if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith("gsk_")) {
    console.error("[Aira AI ERROR] Valid Groq API key is missing (should start with gsk_)");
    return "I am currently disconnected. Please configure the verified Groq API key before continuing.";
  }

  // ----------------------------------------
  // 1. History Consolidation (OpenAI format)
  // ----------------------------------------
  const messages = [
    { role: "system", content: systemPrompt }
  ];

  for (const msg of history) {
    if (msg.text) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text
      });
    }
  }
  
  messages.push({ role: "user", content: userMessage });

  console.log(`[Aira AI] Formatted messages array with length: ${messages.length}`);

  try {
    console.log(`[Aira AI] Initializing Network request to Groq Endpoint...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second maximum wait

    const requestBody = {
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);
    console.log(`[Aira AI] Network Response Received with Status: ${response.status} ${response.statusText}`);

    // Handle generic HTTP errors
    if (!response.ok) {
      let errorData = "No response JSON";
      try {
        errorData = await response.json();
      } catch (e) {} 

      console.error("[Aira AI ERROR] API error payload details:", JSON.stringify(errorData, null, 2));

      if (response.status === 401 || response.status === 403) {
        return "My Groq API key seems to be unauthorized. Check the .env file! (Error 401)";
      }
      if (response.status === 429) {
        return "I'm feeling a bit overwhelmed by the number of messages right now. Let's try again in a moment! (Error 429)";
      }
      if (response.status >= 500) {
        return "My upstream core server is currently down. Check back with me soon. (Error 500)";
      }

      return `I encountered an unexpected issue trying to respond. (Error ${response.status})`;
    }

    const data = await response.json();
    console.log("[Aira AI] Successful JSON decode from response payload");

    const responseText = data?.choices?.[0]?.message?.content;
    if (!responseText) {
      console.warn("[Aira AI Diagnostic] Missing structure data.choices[0].message.content in payload:", JSON.stringify(data));
      return "I'm so sorry, but I couldn't safely parse my own response just now. Let's try saying something else!";
    }

    console.log("[Aira AI] AI Response correctly validated and parsed!");
    console.log("==================================\n");

    return responseText;
  } catch (error) {
    console.error("==================================");
    if (error.name === "AbortError") {
      console.error("[Aira AI Diagnostic] Fetch artificially aborted due to 15s timeout limit.");
      return "My connection just timed out. Are you in a low-signal area, or could you try again for me?";
    }

    console.error("[Aira AI Diagnostic] Full Network Collapse:", error.message);
    return "Check your internet connection and try again. (Network Exception)";
  }
}

/**
 * Build the system prompt with cycle context for personalized responses.
 */
export function buildCycleSystemPrompt(cycleData, profile) {
  const name = profile?.name || "there";
  const age = profile?.age || "unknown";

  let cycleContext = "";
  if (cycleData) {
    const { cycleLength, periodDuration, lastPeriodDate } = cycleData;
    const lpd = lastPeriodDate
      ? new Date(lastPeriodDate).toLocaleDateString()
      : "unknown";
    cycleContext = `
User's cycle data:
- Cycle length: ${cycleLength} days
- Period duration: ${periodDuration} days
- Last period started: ${lpd}
`;
  }

  return `You are a supportive and emotionally intelligent women's health assistant inside a menstrual health app called "OVA". Your name is "Aira (OVA AI)".

Your role:
- Help users understand their menstrual cycle.
- Provide guidance based on cycle phases.
- Offer gentle, comforting support.

User context:
${cycleContext}
User's age: ${age}

Behavior rules:
1. Tone: Always calm, warm, and reassuring. Speak like a gentle companion, not a doctor. Never sound cold, robotic, or alarming.
2. Language: Use simple, comforting sentences. Avoid medical jargon unless necessary. Avoid negativity or fear.
3. Safety: Never give medical diagnosis. You can suggest common natural remedies or over-the-counter medicines if helpful for symptoms, but you MUST always include a soft disclaimer like: "If something feels unusual, it's always good to check with a doctor."
4. Response style: Start with empathy. Then explain. Then give small actionable advice. Example: "It's okay to feel a bit low during this phase. Your body is going through natural changes. Try to rest, stay hydrated, and be kind to yourself today."
5. Phase knowledge:
   - Menstrual: low energy, possible pain
   - Follicular: rising energy, focus improves
   - Ovulation: high energy, confidence, social mood
   - Luteal: low energy, mood swings, cravings
6. Output: Short, helpful, emotionally supportive responses. No long paragraphs. Use clear and precise information based on health research.`;
}
