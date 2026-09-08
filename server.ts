import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import { google } from 'googleapis';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

dotenv.config({ path: '.env.local' });
//dotenv.config(); // fallback to .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

const demoLeadWebhook = 'https://n8n-production-6955.up.railway.app/webhook-test/mailgun-inbound'; // test - 'https://n8n-production-6955.up.railway.app/webhook-test/7a87561a-5de6-4a01-9087-3f3dcdc81e4d';
const sendMailWebhook = 'https://n8n-production-6955.up.railway.app/webhook/3969361d-c5df-41d0-8db8-265bf071f73d';
const googleSheetId = process.env.GOOGLE_SHEET_ID || process.env.VITE_GOOGLE_SHEET_ID;
const googleCalendarId = process.env.GOOGLE_CALENDAR_ID || process.env.VITE_GOOGLE_CALENDAR_ID || 'primary';
const schedulingTimeZone = 'America/Chicago';

function getGoogleAuth() {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const serviceAccount = serviceAccountJson
        ? JSON.parse(serviceAccountJson)
        : {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

    if (!serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error('Google service account credentials are not configured on the server.');
    }

    return new google.auth.JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/calendar',
        ],
    });
}

async function addCRMLead(data: any) {
    if (!googleSheetId) throw new Error('GOOGLE_SHEET_ID is not configured on the server.');
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const headers = ['Timestamp', 'Name', 'Phone', 'Email', 'Treatment Interest', 'Source'];
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: googleSheetId });
    let leadsSheet = spreadsheet.data.sheets?.find((sheet) => sheet.properties?.title === 'Leads');

    if (!leadsSheet) {
        const created = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: googleSheetId,
            requestBody: { requests: [{ addSheet: { properties: { title: 'Leads' } } }] },
        });
        leadsSheet = created.data.replies?.[0]?.addSheet;
    }

    if (!leadsSheet?.properties?.title) throw new Error('Unable to create or find the Leads sheet.');
    const sheetTitle = leadsSheet.properties.title;
    const existingHeaders = await sheets.spreadsheets.values.get({
        spreadsheetId: googleSheetId,
        range: `${sheetTitle}!A1:F1`,
    });

    if (!existingHeaders.data.values?.length) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: googleSheetId,
            range: `${sheetTitle}!A1:F1`,
            valueInputOption: 'RAW',
            requestBody: { values: [headers] },
        });
    }

    const appended = await sheets.spreadsheets.values.append({
        spreadsheetId: googleSheetId,
        range: `${sheetTitle}!A:F`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
            values: [[
                data.timestamp || new Date().toISOString(),
                data.name || '',
                data.phone || '',
                data.email || '',
                data.treatmentInterest || '',
                data.source || 'Aura Voice AI',
            ]],
        },
    });

    const updatedRange = appended.data.updates?.updatedRange || '';
    const rowMatch = updatedRange.match(/![A-Z]+(\d+):/);
    return { success: true, row: rowMatch ? Number(rowMatch[1]) : undefined, sheetId: googleSheetId };
}

async function createConsultationEvent(event: any) {
    if (!event) throw new Error('event is required');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date || '') || !/^\d{2}:\d{2}$/.test(event.time || '')) {
        throw new Error('Appointment date/time must use YYYY-MM-DD and HH:mm format');
    }

    const auth = getGoogleAuth();
    const calendar = google.calendar({ version: 'v3', auth });
    const startDateTime = `${event.date}T${event.time}:00`;
    const endDate = new Date(`${event.date}T${event.time}:00Z`);
    endDate.setUTCHours(endDate.getUTCHours() + 1);
    const endDateTime = `${endDate.toISOString().slice(0, 19)}`;
    const description = [
        event.description || '',
        event.guestEmail ? `Guest email: ${event.guestEmail}` : '',
        'Calendar invitation email was not sent because service accounts cannot invite attendees without Domain-Wide Delegation.',
    ].filter(Boolean).join('\n');
    const created = await calendar.events.insert({
        calendarId: event.calendarId || googleCalendarId,
        sendUpdates: 'none',
        requestBody: {
            summary: event.title || 'VISIA Consultation',
            description,
            start: { dateTime: startDateTime, timeZone: schedulingTimeZone },
            end: { dateTime: endDateTime, timeZone: schedulingTimeZone },
        },
    });

    return {
        success: true,
        eventId: created.data.id,
        eventLink: created.data.htmlLink,
        startTime: created.data.start?.dateTime,
        inviteSent: false,
    };
}

// Enable all CORS requests (required for Railway deployment)
app.use(cors());

app.use(express.json());

// Relay Gemini Live traffic so the browser never receives the server API key.
const medspaLiveWss = new WebSocketServer({ noServer: true });

medspaLiveWss.on('connection', (client) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        client.close(1011, 'Gemini API key is not configured on the server.');
        return;
    }

    const upstream = new WebSocket(
        `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(apiKey)}`
    );
    const pendingMessages: WebSocket.RawData[] = [];

    const closeConnections = (code = 1011, reason = 'Gemini Live upstream connection closed.') => {
        if (client.readyState === WebSocket.OPEN || client.readyState === WebSocket.CONNECTING) {
            client.close(code, reason.slice(0, 123));
        }
        if (upstream.readyState === WebSocket.OPEN || upstream.readyState === WebSocket.CONNECTING) {
            upstream.close();
        }
    };

    client.on('message', (message) => {
        if (upstream.readyState === WebSocket.OPEN) {
            upstream.send(message);
        } else if (upstream.readyState === WebSocket.CONNECTING) {
            pendingMessages.push(message);
        }
    });

    upstream.on('open', () => {
        console.log('[GeminiProxy] Upstream connection opened');
        for (const message of pendingMessages.splice(0)) {
            if (client.readyState !== WebSocket.OPEN) break;
            upstream.send(message);
        }
    });

    upstream.on('message', (message) => {
        try {
            // Forward raw message directly to client
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        } catch (error) {
            console.error('[GeminiProxy] Error forwarding message to client:', error);
            // Forward parsing error to client
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    error: {
                        message: 'Failed to parse Gemini response',
                        code: 'PARSE_ERROR'
                    }
                }));
            }
        }
    });

    client.on('close', () => closeConnections(1000, 'Browser session closed.'));
    client.on('error', (error) => {
        console.error('[GeminiProxy] Client WebSocket error:', error);
        closeConnections();
    });
    upstream.on('close', (code, reason) => {
        const upstreamReason = reason.toString() || `Gemini closed the connection with code ${code}.`;
        console.error('[GeminiProxy] Medspa Gemini Live upstream closed:', code, upstreamReason);
        // Forward the error to the client
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                error: {
                    message: upstreamReason,
                    code: code
                }
            }));
        }
        closeConnections(1011, upstreamReason);
    });
    upstream.on('error', (error) => {
        console.error('[GeminiProxy] Medspa Gemini Live proxy error:', error.message);
        // Forward the error to the client
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                error: {
                    message: error.message,
                    code: 1011
                }
            }));
        }
        closeConnections(1011, error.message);
    });
});


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
Devobi LLC specializes in building automation workflows specifically for home service contractors (roofers, HVAC installers, solar installers, etc.). 
Key offerings:
- Automated lead reactivation for dormant CRM contacts.
- Speed-to-lead SMS qualification for incoming leads.
- CRM integration and automated data entry.
- Job scheduling and calendar management.
- Personalized email + SMS drip campaigns.

The company email is info@devobi.com. 
If someone wants to book a consultation or get started, provide this Calendly link: https://calendly.com/obinnae/ai-consultation.
Be professional, concise, and helpful. 
Focus on how automation saves contractors hours of manual work and helps close more jobs faster. 
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

// Native Google Sheets and Calendar booking endpoint.
app.post('/api/medspa/crm', async (req, res) => {
    try {
        switch (req.body.action) {
            case 'add_crm_lead':
                return res.json(await addCRMLead(req.body.data));
            case 'create_calendar_event':
                return res.json(await createConsultationEvent(req.body.event));
            default:
                return res.status(400).json({ success: false, error: `Unknown action: ${req.body.action}` });
        }
    } catch (error: any) {
        console.error('Google booking error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to complete booking.' });
    }
});

// Redirect route for survey
app.get('/survey', (req, res) => {
    res.redirect(301, 'https://forms.gle/vg4MozP4P4skYwSr6');
});

// Serve static files from Vite build if available or in production mode
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath) || process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));

    // Fallback to index.html for SPA routing
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        if (req.path.startsWith('/medspa')) {
            res.sendFile(indexPath);
            return;
        }
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Build files not found. Please run `npm run build`.');
        }
    });
} else {
    app.get('/', (req, res) => {
        const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
        res.redirect(`http://${host}:5173`);
    });
}

const httpServer = createServer(app);

httpServer.on('upgrade', (request, socket, head) => {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`);
    console.log('[WebSocket] Upgrade request received:', requestUrl.pathname);
    
    if (requestUrl.pathname !== '/api/medspa/live') {
        console.log('[WebSocket] Pathname does not match, rejecting:', requestUrl.pathname);
        socket.destroy();
        return;
    }

    console.log('[WebSocket] Pathname matches, handling upgrade for /api/medspa/live');
    
    // Add error handler to the socket for debugging
    socket.on('error', (err) => {
        console.error('[WebSocket] Socket error:', err);
    });

    medspaLiveWss.handleUpgrade(request, socket, head, (client) => {
        console.log('[WebSocket] WebSocket connection established successfully');
        medspaLiveWss.emit('connection', client, request);
    });
});

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
