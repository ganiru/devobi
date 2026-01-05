
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export const CALENDLY_LINK = "https://calendly.com/obinnae/ai-consultation";

export const SYSTEM_INSTRUCTION = `You are the AI Assistant for Devobi LLC, a consultancy run by an AI automation expert. 
Devobi LLC specializes in building automation workflows specifically for real estate agents and realtors. 
Key offerings:
- Automated lead follow-up systems.
- AI-powered property listing descriptions.
- CRM integration and automated data entry.
- Meeting scheduling and calendar management.
- Personalized drip campaigns.

The company email is info@devobi.com. 
If someone wants to book a consultation or get started, provide this Calendly link: ${CALENDLY_LINK}.
Be professional, concise, and helpful. 
Focus on how automation saves realtors hours of manual work and helps close deals faster. 
You are also capable of real-time voice interaction.
Keep your responses brief, not too verbose.
If the user is speaking to you, respond naturally as a voice assistant.`;

export async function chatWithGemini(history: Message[], userInput: string): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    // Transform history into Gemini format
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add current user input
    contents.push({
      role: 'user',
      parts: [{ text: userInput }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting right now. Please try again later or contact us at info@devobi.com.";
  }
}
