// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * Medspa VoiceAgentService - ÉLÉVATION MedSpa & Longevity concierge.
 *
 * Thin site-specific wrapper around the shared VoiceAgentService
 * (services/voiceAgentService.ts). Supplies the luxury aesthetic persona,
 * booking tool, backend endpoints, and CRM function. Re-exports the shared
 * provider constants so the VoiceAgentModal keeps working unchanged.
 *
 * Defaults to OpenAI Realtime (WebRTC) like the plumber site, with Gemini
 * Live and Browser Mock available as alternatives.
 */
import VoiceAgentService, {
  VOICE_PROVIDERS,
  GEMINI_MODELS,
  GEMINI_VOICES,
  OPENAI_VOICES,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL
} from '../../services/voiceAgentService';
import { bookConsultation } from './crmService.js';

export {
  VOICE_PROVIDERS,
  GEMINI_MODELS,
  GEMINI_VOICES,
  OPENAI_VOICES,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL
};

const localDate = new Date();
const today = [localDate.getFullYear(), String(localDate.getMonth() + 1).padStart(2, '0'), String(localDate.getDate()).padStart(2, '0')].join('-');

const AURA_SYSTEM_INSTRUCTION = `You are Aura, an ultra-luxurious, knowledgeable, warm, and sophisticated AI aesthetic concierge for ÉLÉVATION MedSpa & Longevity Institute located in Beverly Hills on Wilshire Boulevard and Manhattan on Madison Avenue.
Today's date is ${today}. Resolve relative dates against today's date. "Next Tuesday" means the next calendar Tuesday after today, not the nearest weekday and not a date in the past.
You guide elite patients through clinical aesthetic treatments including:
- Precision Neurotoxins (Botox & Dysport): softening expression lines, zero downtime, lasts 3-4 months.
- Morpheus8 RF Microneedling: deep collagen remodeling, jawline contouring, skin tightening, 1-2 days mild pinkness.
- Platinum HydraFacial: 6-step medical vortex extraction, lymphatic drainage, peptide infusion, zero downtime, instant red-carpet glow.
- Architectural Dermal Fillers (Juvéderm & Restylane): facial balancing, lip definition, malar volume, lasts 12-18 months.
- Sciton BBL Hero & Halo Laser: reversing photo-aging, sun damage, broken capillaries, 1-3 days recovery.
- Cellular Longevity IV Infusions (High-Dose NAD+, Glutathione): mitochondrial repair, cognitive energy.

Tone & Style:
- Highly refined, warm, medical-grade confidence, polished, and empathetic.
- Spoken responses MUST be concise (2 to 4 sentences maximum) so conversation flows naturally.
- Emphasize that all procedures are guided by double board-certified physicians.

Consultation Booking Flow (CRITICAL — follow this exact order):
When a client expresses any interest in scheduling, booking, a consultation, or a visit:
1. Warmly confirm their interest and ask for their FULL NAME.
2. Once you have their name, ask for their PHONE NUMBER.
3. Once you have their phone number, ask for their EMAIL ADDRESS.
4. Once you have all three, ask for their PREFERRED DATE and time (e.g., "Are mornings or afternoons better for you, and do you have a preferred date?").
5. Confirm the details back to the client naturally (e.g., "Wonderful, [Name] — I have your number as [phone] and email as [email], and I'll reserve your VISIA consultation for [date/time].").
6. Before calling the booking tool, repeat the exact weekday, calendar date, and time and obtain a clear confirmation.
7. Call the book_consultation tool only after confirmation, with the date as YYYY-MM-DD and the time as HH:mm in the clinic's local time. Do NOT pass relative dates, weekdays, "morning", or "afternoon".
8. After the tool returns success, warmly confirm that the reservation is secured. Mention that a confirmation email was sent only when the tool reports email success; otherwise say the team will follow up separately.

IMPORTANT: Never ask for more than one piece of information at a time. Collect name → phone → email → date/time sequentially.`;

// Curated aesthetic fallback knowledge base
const MEDSPA_KNOWLEDGE = [
  {
    keywords: ['botox', 'dysport', 'wrinkle', 'neurotoxin', 'forehead', 'crow'],
    response: "At ÉLÉVATION, our board-certified injectors use micro-precision Botox and Dysport. It softens expression lines while preserving authentic facial movement. Treatment takes 15 minutes with zero downtime, and results flourish within 5 to 7 days."
  },
  {
    keywords: ['morpheus', 'morpheus8', 'microneedling', 'radiofrequency', 'tighten', 'sagging'],
    response: "Morpheus8 is our premier radiofrequency microneedling therapy. It remodels deep subdermal collagen to tighten skin and sculpt the mandibular jawline. Expect 24 to 48 hours of mild pinkness, with transformative contouring over three sessions."
  },
  {
    keywords: ['hydrafacial', 'facial', 'glow', 'blackhead', 'pore', 'hydration'],
    response: "Our Platinum HydraFacial is a medical-grade 6-step ritual including lymphatic drainage, vortex pore extraction, and customized peptide infusion. It provides an immediate radiant red-carpet glow with zero downtime."
  },
  {
    keywords: ['filler', 'lips', 'cheeks', 'jawline', 'volume', 'juvederm', 'restylane'],
    response: "We specialize in structural facial balancing with hyaluronic acid fillers like Restylane and Juvéderm. We focus on anatomical harmony rather than over-filling. Results are immediate and last 12 to 18 months."
  },
  {
    keywords: ['downtime', 'recovery', 'bruis', 'peeling'],
    response: "Most therapies, including neurotoxins and HydraFacials, have zero social downtime. For deeper collagen treatments like Morpheus8 or Halo laser, anticipate 1 to 3 days of mild sunburn-like pinkness. We provide customized post-procedure serums."
  },
  {
    keywords: ['book', 'consult', 'appointment', 'schedule', 'price', 'cost'],
    response: "We offer comprehensive 45-minute VISIA 3D digital consultations with our medical aesthetic team. Would you like me to open the booking calendar right now to select your preferred date?"
  }
];

function normalizeAppointmentTime(value) {
  const time = String(value || '').trim().toUpperCase();
  const twentyFourHour = time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) return `${twentyFourHour[1]}:${twentyFourHour[2]}`;

  const twelveHour = time.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/);
  if (!twelveHour) return '';

  let hour = Number(twelveHour[1]);
  if (twelveHour[3] === 'AM' && hour === 12) hour = 0;
  if (twelveHour[3] === 'PM' && hour !== 12) hour += 12;
  return `${String(hour).padStart(2, '0')}:${twelveHour[2]}`;
}

async function executeMedspaTool(name, args) {
  if (name === 'book_consultation') {
    const {
      name: clientName,
      phone,
      email,
      preferredDate,
      preferredTime,
      notes = ''
    } = args;

    const normalizedTime = normalizeAppointmentTime(preferredTime);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate || '') || !normalizedTime) {
      return 'Booking not created. The appointment date and time must be confirmed and supplied as YYYY-MM-DD and HH:mm.';
    }

    const { crm, calendar, email: confirmationEmail } = await bookConsultation({
      name: clientName,
      phone,
      email,
      preferredDate,
      preferredTime: normalizedTime,
      notes
    });

    const crmOk  = crm?.success;
    const calOk  = calendar?.success;
    const emailOk = confirmationEmail?.success;

    if (crmOk || calOk) {
      voiceAgent.emit('bookingConfirmed', {
        name: clientName,
        phone,
        email,
        preferredDate,
        preferredTime: normalizedTime,
        notes,
        eventLink: calendar?.eventLink || null,
        crmRow:    crm?.row || null
      });
      const parts = [];
      if (crmOk) parts.push(`contact saved to CRM (row ${crm.row})`);
      if (calOk) parts.push('calendar event created');
      if (emailOk) parts.push('confirmation email sent');
      else if (confirmationEmail?.error) parts.push('confirmation email could not be sent; the team will follow up separately');
      return `Success: ${parts.join(' and ')}. Client: ${clientName}, ${email}, ${phone}.`;
    } else {
      const err = crm?.error || calendar?.error || 'unknown error';
      return `Partial failure — ${err}. Please confirm with the client that the team will follow up manually.`;
    }
  }

  return `Unknown function: ${name}`;
}

const medspaConfig = {
  siteKey: 'elevation',
  brandName: 'ÉLÉVATION MedSpa',
  systemInstruction: AURA_SYSTEM_INSTRUCTION,
  knowledgeBase: MEDSPA_KNOWLEDGE,
  toolName: 'book_consultation',
  toolDescription: "Books a VISIA 3D consultation for the client. Saves contact info to the CRM (Google Sheets) and creates a Google Calendar event. Call this ONLY after collecting the client's full name, phone number, email address, and preferred date/time.",
  toolParameters: {
    name: { type: 'string', description: "Client's full name" },
    phone: { type: 'string', description: "Client's phone number" },
    email: { type: 'string', description: "Client's email address" },
    preferredDate: {
      type: 'string',
      description: 'Confirmed consultation date in YYYY-MM-DD format. Resolve phrases such as "next Tuesday" using today\'s date before calling the tool.'
    },
    preferredTime: {
      type: 'string',
      description: 'Confirmed consultation time in 24-hour HH:mm format in the clinic local timezone, e.g. "12:00" or "15:00".'
    },
    notes: { type: 'string', description: "Additional notes about the client's consultation request" }
  },
  toolRequired: ['name', 'phone', 'email', 'preferredDate', 'preferredTime'],
  openaiSessionEndpoint: '/api/medspa/realtime-session',
  geminiWsPath: '/api/medspa/live',
  workletPath: '/medspa/worklets/audioProcessor.js',
  welcomeMessage: "Welcome to ÉLÉVATION. I'm Aura, your AI aesthetic concierge. How may I assist with your skin, body, or facial rejuvenation goals today?",
  defaultProvider: VOICE_PROVIDERS.OPENAI_REALTIME,
  defaultOpenAIVoice: 'marin',
  defaultGeminiVoice: 'Aoede',
  executeTool: executeMedspaTool
};

export const voiceAgent = new VoiceAgentService(medspaConfig);
export default voiceAgent;