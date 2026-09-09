// pages/api/openai/webrtc.ts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, sdp } = req.body;
    
    // Forward SDP to OpenAI with the token
    const response = await fetch('https://api.openai.com/v1/realtime/webrtc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sdp })
    });

    if (!response.ok) {
      throw new Error(`OpenAI WebRTC error: ${response.status}`);
    }

    const answer = await response.json();
    return res.json(answer);
  } catch (error) {
    console.error('WebRTC negotiation error:', error);
    return res.status(500).json({ error: error.message });
  }
}