
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";
import systemPrompt from "../prompts/system-prompt.txt?raw";

export const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

export const SYSTEM_INSTRUCTION = systemPrompt;

export async function chatWithGemini(history: Message[], userInput: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, userInput })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    return "I'm having trouble connecting right now. Please try again later or contact us at info@devobi.com.";
  }
}
