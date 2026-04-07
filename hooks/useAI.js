import { useCallback, useState } from "react";

import { buildCycleSystemPrompt, generateGeminiResponse } from "@/lib/gemini";

/**
 * Hook that manages AI conversation state and sends messages to Gemini.
 *
 * @param {Object} cycleData — { lastPeriodDate, cycleLength, periodDuration }
 * @param {Object} profile — { name, age, ... }
 */
export function useAI(cycleData, profile) {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi ${profile?.name || "there"}! I'm Aira, your OVA wellness companion. Ask me anything about your cycle, symptoms, or how to feel your best today.`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (userText) => {
      const sanitizedText = userText.trim();
      if (!sanitizedText || isLoading) {
        console.log("[AI Hook] Ignored message request (Input is blank or API is currently loading).");
        return;
      }

      console.log(`[AI Hook] -> Submitting User Message: "${sanitizedText}"`);
      const userMsg = {
        id: `user-${Date.now()}`,
        role: "user",
        text: sanitizedText,
        timestamp: new Date(),
      };

      // Visually mount the user's message immediately into the UI chat log.
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        console.log("[AI Hook] Analyzing and cleaning history state...");
        // Strictly filter out initialization bubbles and any hardcoded error bubbles 
        // to prevent them from poisoning the LLM prompt context history
        const history = messages
          .filter(
            (m) =>
              m.id !== "welcome" &&
              !m.id.startsWith("error-") &&
              m.text?.trim()?.length > 0
          )
          .map((m) => ({ role: m.role, text: m.text }));

        console.log(`[AI Hook] Injecting system dynamic prompt configuration...`);
        const systemPrompt = buildCycleSystemPrompt(cycleData, profile);
        
        console.log("[AI Hook] Emitting call to generateGeminiResponse...", { historicalMessagesSent: history.length });
        const responseText = await generateGeminiResponse(
          sanitizedText,
          systemPrompt,
          history
        );

        console.log("[AI Hook] API returned completion successfully.");
        const assistantMsg = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: responseText,
          timestamp: new Date(),
        };

        // Render AI message safely onto the list
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        console.error("[AI Hook Exception] Failed abruptly outside of gemini lib catches:", error.message);
        
        const fallbackMsg = {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: "I'm experiencing a sudden technical difficulty. Please try your message again.",
          timestamp: new Date(),
        };
        // Inject error bubble on the left as 'assistant' to demonstrate feedback safely
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        console.log("[AI Hook] Completing execution and releasing loading lock status.");
        setIsLoading(false);
      }
    },
    [messages, cycleData, profile, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: `Hi ${profile?.name || "there"}! I'm Aira, your OVA wellness companion. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
  }, [profile]);

  return { messages, isLoading, sendMessage, clearChat };
}
