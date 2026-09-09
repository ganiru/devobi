// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * VoiceAgentService - Google Gemini Multimodal Live Voice AI Service & Joe's Reliable Plumbing Concierge
 * 
 * Capabilities:
 * 1. Google Gemini Multimodal Live API (Bi-directional real-time audio streaming over WebSockets)
 *    - Model: models/gemini-2.5-flash-native-audio-latest
 *    - Endpoint: wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent
 */

import { bookConsultation } from './crmService.js';

export const VOICE_PROVIDERS = {
  GEMINI_LIVE: 'gemini_live',
  BROWSER_MOCK: 'browser_mock'
};

export const DEFAULT_GEMINI_MODEL = 'models/gemini-2.5-flash-native-audio-latest';

export const GEMINI_MODELS = [
  { id: DEFAULT_GEMINI_MODEL, name: 'Gemini 2.5 Flash Native Audio (Recommended)' },
  { id: 'models/gemini-2.5-flash-native-audio-preview-09-2025', name: 'Gemini 2.5 Flash Native Audio Preview' }
];

export const GEMINI_VOICES = [
  { id: 'Aoede', name: 'Aoede (Breezy & Sophisticated - Recommended)' },
  { id: 'Sulafat', name: 'Sulafat (Warm & Luxurious)' },
  { id: 'Despina', name: 'Despina (Smooth & Elegant)' },
  { id: 'Kore', name: 'Kore (Calm & Soothing)' },
  { id: 'Zephyr', name: 'Zephyr (Bright & Polished)' },
  { id: 'Puck', name: 'Puck (Upbeat & Natural)' },
  { id: 'Charon', name: 'Charon (Informative & Deep)' }
];

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

const PLUMBING_WORKHOURS = {
  earlyMorning: [6, 9],   // 6:00-9:00 AM - emergency start
  morning: [9, 15],       // 9:00 AM-3:00 PM
  afternoon: [12, 17],    // lunch and early afternoon overlap
  lateAfternoon: [15, 18] // 3:00-6:00 PM
};

class VoiceAgentService {
  constructor() {
    this.provider = VOICE_PROVIDERS.GEMINI_LIVE;
    this.state = 'idle'; // 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking'
    this.listeners = new Set();
    this.audioContext = null;
    this.inputAudioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.scriptProcessor = null;
    this.geminiSocket = null;
    this.isSetupComplete = false;
    this.sessionActive = false;
    this.audioQueue = [];
    this.isPlayingAudio = false;
    this.nextPlayTime = 0;
    this.scheduledSources = [];
    this.recognition = null;
    this.synth = null;
    this.selectedVoice = null;

    // Live turn transcript streaming buffers
    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;

    const savedVoice = typeof window !== 'undefined' ? localStorage.getItem('joes_gemini_voice') : '';
    const configuredVoice = GEMINI_VOICES.some(v => v.id === savedVoice) ? savedVoice : 'Aoede';

    this.config = {
      geminiApiKey: '', // Handled server-side
      geminiVoice: configuredVoice,
      geminiModel: DEFAULT_GEMINI_MODEL
    };

    this.initBrowserSpeech();
  }

  initBrowserSpeech() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        if (this.provider === VOICE_PROVIDERS.BROWSER_MOCK) {
          this.setState('listening');
        }
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const isFinal = this.provider === VOICE_PROVIDERS.BROWSER_MOCK && event.results[0].isFinal;

        if (isFinal) {
          this.handleBrowserMockInput(transcript);
        } else {
          this.emit('transcript', { sender: 'user', text: transcript, isFinal: false });
        }
      };

      this.recognition.onend = () => {
        if (this.state === 'listening' && this.provider === VOICE_PROVIDERS.BROWSER_MOCK) {
          this.setState('idle');
        }
      };
    }

    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      const loadVoices = () => {
        const voices = this.synth.getVoices();
        this.selectedVoice = voices.find(v => v.lang.includes('en-US')) || null;
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  playChime(type = 'connect') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc1 = this.audioContext.createOscillator();
      const osc2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      if (type === 'connect') {
        osc1.frequency.setValueAtTime(523.25, now);
        osc1.frequency.exponentialRampToValueAtTime(698.46, now + 0.3);
        osc2.frequency.setValueAtTime(659.25, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      } else {
        osc1.frequency.setValueAtTime(698.46, now);
        osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);
        gainNode.gain.setValueAtTime(0.06, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      }

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }

  configureProvider(providerName, config = {}) {
    this.provider = providerName;
    this.config = { ...this.config, ...config };
    if (typeof window !== 'undefined') {
      if (config.geminiVoice) {
        localStorage.setItem('joes_gemini_voice', config.geminiVoice);
      }
    }
    this.emit('providerChange', { provider: this.provider });
  }

  async startGeminiLiveSession() {
    if (this.state === 'connecting' || (this.sessionActive && this.geminiSocket?.readyState === WebSocket.OPEN)) {
      console.log('[GeminiLive] Session already active or connecting');
      return;
    }

    if (this.geminiSocket) {
      try { this.geminiSocket.close(); } catch (_) { }
      this.geminiSocket = null;
    }

    this.setState('connecting');
    this.playChime('connect');

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx({ sampleRate: 24000 });
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
      }

      this.clearAudioQueue();
      this.nextPlayTime = this.audioContext.currentTime;

      const serverHost = window.location.hostname === 'localhost' ? 'localhost:3001' : window.location.host;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${serverHost}/api/plumber/live`;

      console.log('[GeminiLive] Connecting to:', wsUrl);

      const connectTimeout = setTimeout(() => {
        if (this.geminiSocket?.readyState !== WebSocket.OPEN) {
          console.error('[GeminiLive] Connection timeout');
          this.emit('transcript', {
            sender: 'aura',
            text: "Connection timeout. Let me try connecting to our plumbing dispatch system...",
            isFinal: true
          });
          this.setState('idle');
        }
      }, 10000);

      this.geminiSocket = new WebSocket(wsUrl);
      this.isSetupComplete = false;
      this.sessionActive = true;

      this.geminiSocket.onopen = async () => {
        clearTimeout(connectTimeout);
        console.log('[GeminiLive] Connected to Gemini Live');

        const setupMessage = {
          setup: {
            model: this.config.geminiModel || DEFAULT_GEMINI_MODEL,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.config.geminiVoice || 'Aoede'
                  }
                }
              },
              thinkingConfig: { thinkingLevel: 'minimal' }
            },
            systemInstruction: {
              parts: [{ text: AURA_SYSTEM_INSTRUCTION }]
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [{
              functionDeclarations: [{
                name: 'book_service_appointment',
                description: 'Books a plumbing service appointment in the work order queue. Call after collecting name, phone, email, and preferred date/time.',
                parameters: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING' },
                    phone: { type: 'STRING' },
                    email: { type: 'STRING' },
                    scheduledDate: { type: 'STRING' },
                    scheduledTime: { type: 'STRING' },
                    serviceType: {
                      type: 'STRING',
                      description: 'Emergency repair, drain cleaning, water heater replacement, etc.'
                    }
                  },
                  required: ['name', 'phone', 'email', 'scheduledDate', 'scheduledTime']
                }
              }]
            }]
          }
        };

        try {
          this.geminiSocket.send(JSON.stringify(setupMessage));
        } catch (err) {
          console.error('[GeminiLive] Failed to send setup:', err);
          this.emit('transcript', { sender: 'aura', text: `Setup error: ${err.message}`, isFinal: true });
          this.setState('idle');
        }
      };

      this.geminiSocket.onmessage = async (event) => {
        try {
          const responseData = event.data instanceof Blob ? await event.data.text() : event.data;
          const msg = JSON.parse(responseData);

          if (msg.setupComplete) {
            console.log('[GeminiLive] Setup completed');
            this.isSetupComplete = true;
            await this.startMicrophoneCapture();
            this.setState('listening');

            this.emit('transcript', {
              sender: 'aura',
              text: "Joe's Reliable Plumbing - Home of America's #1 Trusted Plumber. I'm Aura, your AI plumbing dispatch expert. Tell me about your plumbing issue - leaks, water heater problems, drain concerns or emergencies.",
              isFinal: true
            });
            return;
          }

          if (msg.error) {
            this.emit('transcript', { sender: 'aura', text: `Error: ${msg.error.message}`, isFinal: true });
            this.setState('idle');
            return;
          }

          this.handleGeminiServerMessage(msg);

        } catch (err) {
          console.warn('[GeminiLive] Message parsing error:', err);
        }
      };

      this.geminiSocket.onerror = (err) => {
        clearTimeout(connectTimeout);
        this.emit('transcript', { sender: 'aura', text: `Connection error: ${err?.message || 'Unknown'}`, isFinal: true });
        this.setState('idle');
      };

      this.geminiSocket.onclose = (event) => {
        clearTimeout(connectTimeout);
        this.stopMicrophoneCapture();
        this.setState('idle');
      };

    } catch (err) {
      console.error('[GeminiLive] Failed to start session:', err);
      this.emit('transcript', { sender: 'aura', text: `Failed to initialize: ${err.message}`, isFinal: true });
      this.setState('idle');
    }
  }

  async startMicrophoneCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.inputAudioContext = new AudioCtx({ sampleRate: 16000 });
      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);

      // Load AudioWorklet processor
      try {
        await this.inputAudioContext.audioWorklet.addModule('/plumber/worklets/audioProcessor.js');
      } catch (err) {
        console.warn('[GeminiLive] AudioWorklet load failed, falling back to ScriptProcessor:', err);
        this.startScriptProcessorFallback(source);
        return;
      }

      this.audioWorklet = new AudioWorkletNode(this.inputAudioContext, 'audio-processor');
      
      this.audioWorklet.port.onmessage = (event) => {
        if (event.data.type === 'audio-data' && this.sessionActive) {
          if (!this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

          const pcmData = new Int16Array(event.data.data);
          const base64Data = this.arrayBufferToBase64(pcmData.buffer);

          const realtimeInputMessage = {
            realtimeInput: { audio: { mimeType: 'audio/pcm;rate=16000', data: base64Data } }
          };
          this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
        }
      };

      source.connect(this.audioWorklet);
      this.audioWorklet.connect(this.inputAudioContext.destination);
    } catch (err) {
      console.error('[GeminiLive] Microphone access error:', err);
      this.emit('transcript', { sender: 'aura', text: "Microphone denied. Allow permissions to use Aura voice assistant.", isFinal: true });
    }
  }

  hasToolCallPending = false;

  handleToolCallIfReady() {
    if (this.hasToolCallPending || !this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

    this.hasToolCallPending = true;
    this.handleToolCall([]);
    this.hasToolCallPending = false;
  }

  async handleToolCall(functionCalls = []) {
    const functionResponses = [];

    for (const call of functionCalls) {
      try {
        const result = await this.executeTool(call.name, call.args);
        functionResponses.push({ id: call.id, name: call.name, response: { output: result } });
      } catch (err) {
        functionResponses.push({ id: call.id, name: call.name, response: { output: `Error: ${err.message}` } });
      }
    }

    this.geminiSocket.send(JSON.stringify({ toolResponse: { functionResponses } }));
  }

  async executeTool(name, args) {
    if (name === 'book_service_appointment') {
      const { name, phone, email, scheduledDate, scheduledTime, serviceType = '' } = args;

      const normalizedTime = this.isValid24HourFormat(scheduledTime) ? scheduledTime : '';
      if (!this.isValidDateFormat(scheduledDate) || !normalizedTime) {
        return 'Booking failed. Please provide date as YYYY-MM-DD and time in HH:mm format.';
      }

      const result = await bookConsultation({
        name, phone, email, preferredDate: scheduledDate, preferredTime: normalizedTime, serviceInterest: serviceType
      });

      this.emit('bookingConfirmed', {
        name, phone, email, scheduledDate, scheduledTime: normalizedTime,
        serviceType, crmRow: result?.row, eventId: result?.calendar?.eventId
      });

      const parts = [];
      if (result?.success) parts.push(`appointment entered in dispatch queue`);
      if (calendar?.success) {
        parts.push('calendar event created');
        if (serviceType?.toLowerCase().includes('emergency')) parts.push('Priority Dispatch Alert sent to crew');
      }

      return `Success: ${parts.slice(0, 2).join(', ')}. ${name} - Joe's Reliable Plumbing has you scheduled.`;
    }

    return `Unknown tool: ${name}`;
  }

  isValidDateFormat(date) {
    return /^(\d{4})-(\d{2})-(\d{2})$/.test(date);
  }

  isValid24HourFormat(time) {
    const t = time.trim();
    if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(t)) return true;
    // Also accept "anytime" for flexible scheduling
    if (t.toLowerCase() === 'anytime' || t.toLowerCase() === 'flexible') return false;
    return /^(\d{1,2})(?:am|pm)$/i.test(t);
  }

  startScriptProcessorFallback(source) {
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(2048, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.sessionActive) return;
      if (!this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

      const inputBuffer = e.inputBuffer.getChannelData(0);
      const pcmData = new Int16Array(inputBuffer.length);
      for (let i = 0; i < inputBuffer.length; i++) {
        const s = Math.max(-1, Math.min(1, inputBuffer[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      const base64Data = this.arrayBufferToBase64(pcmData.buffer);
      const realtimeInputMessage = {
        realtimeInput: { audio: { mimeType: 'audio/pcm;rate=16000', data: base64Data } }
      };
      this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  stopMicrophoneCapture() {
    if (this.geminiSocket?.readyState === WebSocket.OPEN) {
      try { this.geminiSocket.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } })); } catch (_) { }
    }
    if (this.audioWorklet) {
      try { this.audioWorklet.disconnect(); } catch (_) { }
      this.audioWorklet = null;
    }
    if (this.scriptProcessor) {
      try { this.scriptProcessor.disconnect(); } catch (_) { }
      this.scriptProcessor = null;
    }
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
    if (this.inputAudioContext) {
      try { this.inputAudioContext.close(); } catch (_) { }
      this.inputAudioContext = null;
    }
  }

  // Decode and queue Gemini's 24kHz PCM audio chunks for smooth gapless playback
  enqueueGeminiAudioChunk(base64Audio) {
    if (!this.audioContext || !base64Audio) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);

      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const currentTime = this.audioContext.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime + 0.04;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      if (this.analyser) {
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      } else {
        source.connect(this.audioContext.destination);
      }

      source.start(this.nextPlayTime);
      this.scheduledSources.push(source);

      this.setState('speaking');
      this.isPlayingAudio = true;

      source.onended = () => {
        if (!this.sessionActive) return;
        const index = this.scheduledSources.indexOf(source);
        if (index > -1) this.scheduledSources.splice(index, 1);
        if (this.scheduledSources.length === 0) {
          this.isPlayingAudio = false;
          if (this.state === 'speaking') {
            this.setState('listening');
          }
        }
      };

      this.nextPlayTime += audioBuffer.duration;
    } catch (err) {
      console.warn('[GeminiLive] Error decoding audio chunk:', err);
    }
  }

  clearAudioQueue() {
    for (const source of this.scheduledSources) {
      try { source.stop(); source.disconnect(); } catch (_) { }
    }
    this.scheduledSources = [];
    this.isPlayingAudio = false;
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
  }

  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  appendWithSmartSpacing(existing, chunk) {
    if (!existing) return chunk;
    if (!chunk) return existing;
    const needsSpace = !/\s$/.test(existing) && !/^\s/.test(chunk) && !/^[.,!?;:')]/.test(chunk);
    return needsSpace ? existing + ' ' + chunk : existing + chunk;
  }

  handleGeminiServerMessage(msg) {
    // Tool Call – Gemini wants to invoke a function (e.g. book_service_appointment)
    if (msg.toolCall?.functionCalls?.length) {
      this.handleToolCall(msg.toolCall.functionCalls);
      return;
    }

    // Barge-in / Turn Interruption (user spoke while Gemini was speaking)
    if (msg.serverContent?.interrupted) {
      if (this.currentModelTurnId && this.currentModelText) {
        this.emit('transcript', {
          turnId: this.currentModelTurnId,
          sender: 'aura',
          text: this.currentModelText,
          isFinal: true
        });
      }
      this.clearAudioQueue();
      this.currentModelTurnId = null;
      this.currentModelText = '';
      this.outputTranscriptionReceivedThisTurn = false;
      this.setState('listening');
      return;
    }

    // User Speech Transcription streamed by Gemini Live
    if (msg.serverContent?.inputTranscription?.text) {
      const userChunk = msg.serverContent.inputTranscription.text;
      if (userChunk) {
        if (!this.currentUserTurnId) {
          this.currentUserTurnId = 'user-' + Date.now();
          this.currentUserText = '';
        }
        if (userChunk.startsWith(this.currentUserText)) {
          this.currentUserText = userChunk;
        } else {
          this.currentUserText = this.appendWithSmartSpacing(this.currentUserText, userChunk);
        }
        this.emit('transcript', {
          turnId: this.currentUserTurnId,
          sender: 'user',
          text: this.currentUserText,
          isFinal: false
        });
      }
    }

    // Model Spoken Output Transcription streamed by Gemini Live
    if (msg.serverContent?.outputTranscription?.text) {
      const auraChunk = msg.serverContent.outputTranscription.text;
      if (auraChunk) {
        if (this.currentUserTurnId) {
          this.emit('transcript', {
            turnId: this.currentUserTurnId,
            sender: 'user',
            text: this.currentUserText,
            isFinal: true
          });
          this.currentUserTurnId = null;
          this.currentUserText = '';
        }

        if (!this.currentModelTurnId) {
          this.currentModelTurnId = 'aura-' + Date.now();
          this.currentModelText = '';
        }
        this.outputTranscriptionReceivedThisTurn = true;
        this.currentModelText = this.appendWithSmartSpacing(this.currentModelText, auraChunk);

        this.emit('transcript', {
          turnId: this.currentModelTurnId,
          sender: 'aura',
          text: this.currentModelText,
          isFinal: false
        });
      }
    }

    // Model Turn Chunks (24kHz PCM audio and optional inline text parts)
    if (msg.serverContent?.modelTurn) {
      if (this.currentUserTurnId) {
        this.emit('transcript', {
          turnId: this.currentUserTurnId,
          sender: 'user',
          text: this.currentUserText,
          isFinal: true
        });
        this.currentUserTurnId = null;
        this.currentUserText = '';
      }

      const parts = msg.serverContent.modelTurn.parts || [];

      for (const part of parts) {
        if (part.inlineData && (part.inlineData.mimeType?.startsWith('audio/pcm') || !part.inlineData.mimeType)) {
          const base64Audio = part.inlineData.data;
          if (base64Audio) {
            this.enqueueGeminiAudioChunk(base64Audio);
          }
        }

        if (part.text && !this.outputTranscriptionReceivedThisTurn) {
          if (!this.currentModelTurnId) {
            this.currentModelTurnId = 'aura-' + Date.now();
            this.currentModelText = '';
          }
          this.currentModelText = this.appendWithSmartSpacing(this.currentModelText, part.text);
          this.emit('transcript', {
            turnId: this.currentModelTurnId,
            sender: 'aura',
            text: this.currentModelText,
            isFinal: false
          });
        }
      }
    }

    // Turn Completion
    if (msg.serverContent?.turnComplete) {
      if (this.currentModelTurnId) {
        this.emit('transcript', {
          turnId: this.currentModelTurnId,
          sender: 'aura',
          text: this.currentModelText || ' ',
          isFinal: true
        });
      }
      if (this.currentUserTurnId && this.currentUserText) {
        this.emit('transcript', {
          turnId: this.currentUserTurnId,
          sender: 'user',
          text: this.currentUserText,
          isFinal: true
        });
        this.currentUserTurnId = null;
        this.currentUserText = '';
      }
      this.currentModelTurnId = null;
      this.currentModelText = '';
      this.outputTranscriptionReceivedThisTurn = false;
    }
  }

  async startSession() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      await this.startGeminiLiveSession();
    } else {
      this.playChime('connect');
      this.setState('connecting');
      setTimeout(() => {
        const welcome = "Joe's Reliable Plumbing - Home of America's #1 Trusted Plumber. I'm Aura. Describe your plumbing concern or ask about our services, emergency dispatch times, or service areas.";
        this.speakBrowser(welcome);
      }, 400);
    }
  }

  endSession() {
    this.sessionActive = false;
    this.playChime('disconnect');
    this.geminiSocket?.close();
    this.stopMicrophoneCapture();
    this.clearAudioQueue();
    this.currentModelTurnId = null; this.currentModelText = ''; this.currentUserTurnId = null; this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;
    this.hasToolCallPending = false;
    this.recognition?.stop();
    this.synth?.cancel();
  }

  startListening() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      if (this.sessionActive && this.geminiSocket?.readyState === WebSocket.OPEN) {
        this.setState('listening');
      } else {
        this.startGeminiLiveSession();
      }
    } else {
      if (this.recognition && this.state !== 'listening') {
        try { this.recognition.start(); } catch (_) { this.setState('listening'); }
      } else {
        this.setState('listening');
      }
    }
  }

  stopListening() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      this.setState('idle');
    } else {
      this.recognition?.stop();
      this.setState('idle');
    }
  }

  handleUserVoiceInput(text) {
    if (!text || text.trim().length === 0) return;

    // Reset turn buffers for new exchange
    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;
    this.hasToolCallPending = false;

    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE && this.geminiSocket?.readyState === WebSocket.OPEN) {
      this.setState('thinking');
      const realtimeInputMessage = { realtimeInput: { text } };
      this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
    } else {
      this.handleBrowserMockInput(text);
    }
  }

  handleBrowserMockInput(text) {
    this.setState('thinking');
    
    const lower = text.toLowerCase();
    let matched: typeof PLUMBING_KNOWLEDGE[number] | undefined;
    
    // First check emergency escalation keywords - these take priority over regular services
    const emergencyKeywords = ['leak', 'burst', 'emergency', 'overflow', 'flood'];
    if (emergencyKeywords.some(k => lower.includes(k))) {
      matched = PLUMBING_KNOWLEDGE[0]; // Emergency handling first
    } else {
      matched = PLUMBING_KNOWLEDGE.find(item => item.keywords.some(k => lower.includes(k)));
    }

    const reply = matched 
      ? matched.response 
      : `I'm here to help! At Joe's Reliable Plumbing, we provide same-day service for residential and commercial work. Could I get your full name so I can assist you?`;

    this.speakBrowser(reply);
  }

  speakBrowser(text) {
    this.emit('transcript', { sender: 'aura', text, isFinal: true });
    this.setState('speaking');

    if (this.synth) {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) utterance.voice = this.selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.02;

      utterance.onend = () => {
        // Wait for natural pause before checking interruption
        setTimeout(() => {
          if (this.state === 'speaking' && !this.isPlayingAudio) {
            this.setState('idle');
          }
        }, 400);
      };

      utterance.onerror = () => this.setState('idle');
      this.synth.speak(utterance);
    } else {
      const duration = Math.min(Math.max(text.length * 55, 2000), 6000);
      setTimeout(() => this.setState('idle'), duration);
    }
  }

  setState(newState) {
    if (this.state === 'speaking' && newState !== 'speaking') {
      // Don't interrupt when transitioning mid-sentence unless going idle
      if (!['idle', 'listening'].includes(newState)) return;
    }
    this.state = newState;
    this.emit('state', newState);
  }

  subscribe(event, callback) {
    this.listeners.add({ event, callback });
    return () => {
      this.listeners.forEach(item => {
        if (item.callback === callback) this.listeners.delete(item);
      });
    };
  }

  emit(event, data) {
    this.listeners.forEach(item => {
      if (item.event === event || item.event === '*') item.callback(data);
    });
  }
}

export const voiceAgent = new VoiceAgentService();
export default voiceAgent;
