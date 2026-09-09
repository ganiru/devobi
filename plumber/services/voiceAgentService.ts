// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * Plumber VoiceAgentService - Joe's Reliable Plumbing concierge.
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

const AURA_SYSTEM_INSTRUCTION = `You are Aura, a knowledgeable, professional, friendly, and approachable AI plumbing expert for Joe's Reliable Plumbing. 
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

Consultation Booking Flow (CRITICAL — follow this exact order):
When a customer expresses interest in scheduling, booking an appointment or fixing something:
1. Warmly acknowledge their plumbing concern and confirm interest.
2. Request their FULL NAME immediately.
3. Follow with PHONE NUMBER for same-day dispatch confirmation.
4. Then EMAIL ADDRESS to send estimate details and work order info.
5. Determine if this is URGENT/emergency or scheduled maintenance, then ask PREFERRED DATE and time (e.g., "Mornings or afternoons do you prefer?").
6. Confirm the complete booking details back: name, phone number, email, preferred date/time window.
7. If emergency service needed, emphasize that same-day service can be dispatched within 2-4 hours for most areas.
8. If not urgent, offer 3-5 available time slots and get confirmation before calling the booking tool.
9. After tool returns success, warmly confirm the service appointment is secured and dispatch scheduled.
10. Reassure them about same-day availability and punctual arrivals.

IMPORTANT: Never ask for more than one piece of information at a time. Collect name → phone → email → date/time sequentially.`;

// Comprehensive plumbing knowledge base with emergency escalation logic
const PLUMBING_KNOWLEDGE = [
  {
    keywords: ['leak', 'burst', 'emergency', 'overflow', 'flood'],
    response: "I understand - you have a plumbing emergency. Let me dispatch our emergency crew to your location immediately. We guarantee same-day service for emergencies. Can I get your name and phone number so we can prioritize getting someone out there right away?"
  },
  {
    keywords: ['drain', 'clog', 'blocked', 'slow', 'not draining'],
    response: "I can help with that drain issue! We use hydro-jetting and camera inspections to clear the most stubborn blockages quickly. Are you dealing with a kitchen sink, shower drain, or main sewer line?"
  },
  {
    keywords: ['water heater', 'heater', 'tankless', 'pilot light'],
    response: "Water heaters are essential for comfortable living! We service both traditional tank-style and modern tankless systems. Common issues include temperature fluctuations and sediment buildup that we can resolve quickly."
  },
  {
    keywords: ['toilet', 'running', 'flush', 'tank'],
    response: "Running toilets waste gallons of water per day! A simple flapper replacement or fill valve adjustment can fix most running toilet problems. Would you like an estimate before we proceed with the repair?"
  },
  {
    keywords: ['pipe', 'piping', 'repiping', 'old pipes', 'corrosion'],
    response: "Old piping systems in homes over 40 years can present serious issues, and repiping can be a great long-term solution for your plumbing infrastructure. We use modern materials like PEX that resist corrosion and won't freeze as easily."
  },
  {
    keywords: ['sewer', 'main line', 'backup'],
    response: "Sewer line concerns need prompt attention! We offer trenchless sewer repair where possible, or traditional methods if needed. Our camera inspection technology shows us exactly what's causing your sewer issue."
  },
  {
    keywords: ['gas', 'gas line', 'stove', 'range'],
    response: "Gas line work requires licensed professionals for safe installation and inspection. We'll check for proper venting, pressure requirements, and current safety codes before recommending any gas system adjustments."
  },
  {
    keywords: ['garbage disposal', 'grinder', 'sink garbage'],
    response: "Garbage disposals have a simple design when it comes to repairs! Most issues - whether jammed blades or overloads - can be resolved with proper troubleshooting, though some units may need replacement."
  },
  {
    keywords: ['sump pump', 'basement water', 'flood'],
    response: "Sump pump maintenance is essential for protecting your basement! We test pump activation and check valves regularly. For serious flooding emergencies, we dispatch same-day service to restore drainage immediately."
  },
  {
    keywords: ['bathroom remodel', 'master bath', 'kitchen remodel'],
    response: "Great choice on remodeling! We handle complete bathroom and kitchen pipe rough-ins, fixture installation, and upgrades to modern code-compliant systems. Should I walk you through our plumbing packages?"
  },
  {
    keywords: ['book', 'consult', 'appointment', 'schedule'],
    response: "Our scheduling system is ready for your appointment! Let me get your contact information so I can book this for the optimal time slot. Could I start with your full name?"
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

    return `Success: ${parts.slice(0, 2).join(', ')}. ${clientName} - Joe's Reliable Plumbing has you scheduled.`;
  }

  return `Unknown tool: ${name}`;
}

const plumberConfig = {
  siteKey: 'joes',
  brandName: "Joe's Reliable Plumbing",
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
  welcomeMessage: "Joe's Reliable Plumbing - Home of America's #1 Trusted Plumber. I'm Aura, your AI plumbing dispatch expert. Tell me about your plumbing issue - leaks, water heater problems, drain concerns or emergencies.",
  defaultProvider: VOICE_PROVIDERS.OPENAI_REALTIME,
  defaultOpenAIVoice: 'marin',
  defaultGeminiVoice: 'Aoede',
  executeTool: executePlumberTool
};

export const voiceAgent = new VoiceAgentService(plumberConfig);
export default voiceAgent;