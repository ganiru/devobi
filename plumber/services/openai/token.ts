// pages/api/openai/token.ts or similar
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const { model, voice, instructions, tools } = req.body;
    
    const tokenResponse = await openai.realtime.clientSecrets.create({
      expires_after: 120, // Token expires in 120 seconds
      session: {
        model: model || 'gpt-realtime-2.1-mini',
        instructions: instructions,
        voice: voice || 'shimmer',
        turn_detection: { type: 'server_vad' },
        input_audio_transcription: { enabled: true, model: 'whisper-1' },
        tool_choice: 'auto',
        tools: tools || []
      }
    });

    return res.json({
      token: tokenResponse.value,
      expiresAt: tokenResponse.expires_at
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: error.message });
  }
}