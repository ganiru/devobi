// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * Plumber VoiceAgentService - Joe Demo's Reliable Plumbing concierge.
 *
 * Thin site-specific wrapper around the shared VoiceAgentService
 * (services/voiceAgentService.ts). Supplies the plumbing persona, booking
 * tool, backend endpoints, and CRM function. Re-exports the shared provider
 * constants so the VoiceAgentModal keeps working unchanged.
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

const AURA_SYSTEM_INSTRUCTION = `You are Aura, a knowledgeable, professional, friendly, and approachable AI plumbing expert for Joe Demo's Reliable Plumbing. 
Today's date is ${today}. Resolve relative dates against today's date. "Next Tuesday" means the next calendar Tuesday after today.

Specialize in residential and commercial plumbing services including:
- Emergency Leak Repair: 24/7 rapid response for burst pipes, overflow emergencies, flooding. Guaranteed within hours.
- Drain Cleaning & Clog Removal: snaking, hydro-jetting, camera inspections to clear stubborn blockages fast.
- Water Heater Installation & Repair: tankless and traditional units, thermostat calibration, pressure relief valve checks.
- Toilet, Sink & Faucet Repair: running toilets, leaky valves, dripping faucets, fixture updates.
- Pipe Replacement & Repair: copper, PEX, PVC pipe work, old house repiping for lead/galvanized issues or corrosion.
- Sewer Line Inspection & Repair: trenchless options, root removal, camera inspections to assess damage and solve backups.
- Garbage Disposal Fixes: resetting overloads, blade sharpening, jam clearing with parts replacement as needed.
- Sump Pump & Basement Waterproofing: pump activation testing, check valve installation for flood prevention.
- Gas Line Installation & Inspection: licensed certified work for stoves, fireplaces, furnaces and dryers.

Tone & Style:
- Approachable and helpful with no-nonsense expertise and emergency readiness.
- Direct about urgency for leaks that demand immediate attention.
- Professional for appointments, pricing inquiries, service availability and booking flow.
- Confident in 24/7 same-day service commitment across residential and commercial locations.
- If the customer asks for help or a recommendation, provide a short answer and request scheduling an appointment. Avoid long explanations or multiple options. Focus on the next step: booking.
Consultation Booking Flow (CRITICAL — follow this exact order):
When a customer expresses interest in scheduling, booking an appointment or fixing something:
1. Warmly acknowledge their plumbing concern and confirm interest.
2. Request their FULL NAME and ADDRESS immediately.
3. Follow with PHONE NUMBER for same-day dispatch confirmation.
4. Ask for the PREFERRED DATE and time (e.g., "Mornings or afternoons do you prefer?").
5. Confirm the complete booking details back: name, phone number, address, preferred date/time.
6. If emergency service needed, emphasize that same-day service can be dispatched within 2-4 hours for most areas.
7. If not urgent, offer 3-5 available time slots and get confirmation before calling the booking tool.
8. After tool returns success, warmly confirm the service appointment is secured and dispatch scheduled.
9. Reassure them about same-day availability and punctual arrivals.

IMPORTANT: Never ask for more than one piece of information at a time. Collect name → phone → email → date/time sequentially.`;

// Comprehensive plumbing knowledge base with emergency escalation logic
const PLUMBING_KNOWLEDGE = [
  {
    keywords: ['leak', 'burst', 'emergency', 'overflow', 'flood'],
    response: "I understand - you have a plumbing emergency. Let me dispatch our emergency crew to your location immediately. We guarantee same-day service for emergencies."
  },
  {
    keywords: ['drain', 'clog', 'blocked', 'slow', 'not draining'],
    response: "I can help with that drain issue! Are you dealing with a kitchen sink, shower drain, or main sewer line?"
  },
  {
    keywords: ['water heater', 'heater', 'tankless', 'pilot light'],
    response: "Water heaters are essential for comfortable living!"
  },
  {
    keywords: ['toilet', 'running', 'flush', 'tank'],
    response: "Running toilets waste gallons of water per day!"
  },
  {
    keywords: ['pipe', 'piping', 'repiping', 'old pipes', 'corrosion'],
    response: "Old piping systems in homes over 40 years can present serious issues, and repiping can be a great long-term solution for your plumbing infrastructure."
  },
  {
    keywords: ['sewer', 'main line', 'backup'],
    response: "Sewer line concerns need prompt attention!"
  },
  {
    keywords: ['gas', 'gas line', 'stove', 'range'],
    response: "Gas line work requires licensed professionals for safe installation and inspection."
  },
  {
    keywords: ['garbage disposal', 'grinder', 'sink garbage'],
    response: "Garbage disposals have a simple design when it comes to repairs!"
  },
  {
    keywords: ['sump pump', 'basement water', 'flood'],
    response: "Sump pump maintenance is essential for protecting your basement!"
  },
  {
    keywords: ['bathroom remodel', 'master bath', 'kitchen remodel'],
    response: "We handle complete bathroom and kitchen pipe rough-ins, fixture installation, and upgrades to modern code-compliant systems."
  },
  {
    keywords: ['book', 'consult', 'appointment', 'schedule'],
    response: "Our scheduling system is ready!"
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

async function executePlumberTool(name, args) {
  if (name === 'book_service_appointment') {
    const { name: clientName, phone, email, scheduledDate, scheduledTime, serviceType = '' } = args;

    const normalizedTime = normalizeAppointmentTime(scheduledTime);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate || '') || !normalizedTime) {
      return 'Booking failed. Please provide date as YYYY-MM-DD and time in HH:mm format.';
    }

    const result = await bookConsultation({
      name: clientName, phone, email,
      preferredDate: scheduledDate, preferredTime: normalizedTime, notes: serviceType
    });

    voiceAgent.emit('bookingConfirmed', {
      name: clientName, phone, email,
      scheduledDate, scheduledTime: normalizedTime,
      serviceType, crmRow: result?.row, eventId: result?.calendar?.eventId
    });

    const parts = [];
    if (result?.success) parts.push(`appointment entered in dispatch queue`);
    if (result?.calendar?.success) {
      parts.push('calendar event created');
      if (serviceType?.toLowerCase().includes('emergency')) parts.push('Priority Dispatch Alert sent to crew');
    }

    return `Success: ${parts.slice(0, 2).join(', ')}. ${clientName} - Joe Demo's Reliable Plumbing has you scheduled.`;
  }

  return `Unknown tool: ${name}`;
}

const plumberConfig = {
  siteKey: 'joes',
  brandName: "Joe Demo's Reliable Plumbing",
  systemInstruction: AURA_SYSTEM_INSTRUCTION,
  knowledgeBase: PLUMBING_KNOWLEDGE,
  toolName: 'book_service_appointment',
  toolDescription: 'Books a plumbing service appointment in the work order queue. Call after collecting name, phone, email, and preferred date/time.',
  toolParameters: {
    name: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    scheduledDate: { type: 'string' },
    scheduledTime: { type: 'string' },
    serviceType: {
      type: 'string',
      description: 'Emergency repair, drain cleaning, water heater replacement, etc.'
    }
  },
  toolRequired: ['name', 'phone', 'email', 'scheduledDate', 'scheduledTime'],
  openaiSessionEndpoint: '/api/plumber/realtime-session',
  geminiWsPath: '/api/plumber/live',
  workletPath: '/plumber/worklets/audioProcessor.js',
  welcomeMessage: "Joe Demo's Reliable Plumbing - Home of America's #1 Trusted Plumber. I'm Aura, your AI plumbing dispatch expert. Tell me about your plumbing issue - leaks, water heater problems, drain concerns or emergencies.",
  defaultProvider: VOICE_PROVIDERS.OPENAI_REALTIME,
  defaultOpenAIVoice: 'marin',
  defaultGeminiVoice: 'Aoede',
  executeTool: executePlumberTool
};

export const voiceAgent = new VoiceAgentService(plumberConfig);
export default voiceAgent;