import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
//dotenv.config(); // fallback to .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

const demoLeadWebhook = 'https://n8n-production-6955.up.railway.app/webhook-test/7a87561a-5de6-4a01-9087-3f3dcdc81e4d';
const sendMailWebhook = 'https://n8n-production-6955.up.railway.app/webhook/3969361d-c5df-41d0-8db8-265bf071f73d';

// Enable all CORS requests (required for Railway deployment)
app.use(cors());

app.use(express.json());


// API Route for Gemini
app.post('/api/chat', async (req, res) => {
    try {
        const { history, userInput } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API Key not configured on server." });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Transform history into Gemini format
        const contents = history.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        // Add current user input
        contents.push({
            role: 'user',
            parts: [{ text: userInput }]
        });

        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite-preview',
            contents: contents,
            config: {
                systemInstruction: `You are the AI Assistant for Devobi LLC, a consultancy run by an AI automation expert. 
Devobi LLC specializes in building automation workflows specifically for real estate agents and realtors. 
Key offerings:
- Automated lead follow-up systems.
- AI-powered property listing descriptions.
- CRM integration and automated data entry.
- Meeting scheduling and calendar management.
- Personalized drip campaigns.

The company email is info@devobi.com. 
If someone wants to book a consultation or get started, provide this Calendly link: https://calendly.com/obinnae/ai-consultation.
Be professional, concise, and helpful. 
Focus on how automation saves realtors hours of manual work and helps close deals faster. 
You are also capable of real-time voice interaction.
Keep your responses brief, not too verbose.
If the user is speaking to you, respond naturally as a voice assistant.`,
                temperature: 0.7,
                topP: 0.9,
            },
        });

        res.json({ text: result.text || "I'm sorry, I couldn't process that request." });
    } catch (error) {
        console.error("Server-side Gemini Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI." + error });
    }
});

// Proxy route for n8n lead form webhook (avoids browser CORS restrictions)
app.post('/api/submit-lead', async (req, res) => {
    try {
        const n8nResponse = await fetch(demoLeadWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (n8nResponse.ok) {
            res.status(200).json({ success: true });
        } else {
            const errorText = await n8nResponse.text();
            console.error('n8n webhook error:', n8nResponse.status, errorText);
            res.status(n8nResponse.status).json({ success: false, error: errorText });
        }
    } catch (error) {
        console.error('Lead proxy error:', error);
        res.status(500).json({ success: false, error: 'Failed to forward lead to n8n.' });
    }
});

// Proxy route for send-mail webhook (avoids browser CORS restrictions)
app.post('/api/send-mail', async (req, res) => {
    try {
        const n8nResponse = await fetch(sendMailWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });

        if (n8nResponse.ok) {
            res.status(200).json({ success: true });
        } else {
            const errorText = await n8nResponse.text();
            console.error('n8n send-mail webhook error:', n8nResponse.status, errorText);
            res.status(n8nResponse.status).json({ success: false, error: errorText });
        }
    } catch (error) {
        console.error('Send-mail proxy error:', error);
        res.status(500).json({ success: false, error: 'Failed to forward email to n8n.' });
    }
});

// Redirect route for survey
app.get('/survey', (req, res) => {
    res.redirect(301, 'https://forms.gle/vg4MozP4P4skYwSr6');
});

// Serve static files from the Vite build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    // Fallback to index.html for SPA routing
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
