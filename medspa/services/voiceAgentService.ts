// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * VoiceAgentService - Google Gemini Multimodal Live Voice AI Service & MedSpa Concierge
 *
 * Capabilities:
 * 1. Google Gemini Multimodal Live API (Bi-directional real-time audio streaming over WebSockets)
 *    - Model: models/gemini-2.5-flash-native-audio-latest
 *    - Endpoint: wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent
 *    - Protocol: BidiGenerateContent with realtimeInput (audio & text)
 *    - Audio: 16kHz 16-bit PCM input streaming & 24kHz PCM output playback with interruption handling
 *    - Features: Real-time user inputTranscription & model outputTranscription, thinkingLevel: minimal
 *    - Tools: book_consultation (Google Sheets CRM + Google Calendar via Apps Script webhook)
 * 2. Native Browser Web Speech Simulation Fallback (Immediate local testing without API key)
 * 3. Adapters for ElevenLabs, OpenAI Realtime, Vapi
 */
import { bookConsultation } from './crmService.js';

export const VOICE_PROVIDERS = {
  GEMINI_LIVE: 'gemini_live',
  BROWSER_MOCK: 'browser_mock',
  ELEVEN_LABS: 'eleven_labs',
  OPENAI_REALTIME: 'openai_realtime',
  VAPI: 'vapi'
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
  { id: 'Charon', name: 'Charon (Informative & Deep)' },
  { id: 'Fenrir', name: 'Fenrir (Commanding & Warm)' }
];

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

class VoiceAgentService {
  constructor() {
    this.provider = VOICE_PROVIDERS.GEMINI_LIVE;
    this.state = 'idle'; // 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking'
    this.listeners = new Set();

    // Web Audio instances
    this.audioContext = null;
    this.inputAudioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.scriptProcessor = null;

    // Gemini Live WebSocket & Audio Playback Queue
    this.geminiSocket = null;
    this.isSetupComplete = false;
    this.sessionActive = false;  // guards all async callbacks
    this.audioQueue = [];
    this.isPlayingAudio = false;
    this.nextPlayTime = 0;
    this.scheduledSources = [];

    // Browser Speech Synthesis / Recognition fallback
    this.recognition = null;
    this.synth = null;
    this.selectedVoice = null;

    // Live turn transcript streaming buffers (accumulate full sentence in single bubble per turn)
    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;

    // Configuration - prioritize environment variables for security
    const savedModel = typeof window !== 'undefined' ? localStorage.getItem('elevation_gemini_model') : '';
    const configuredModel = GEMINI_MODELS.some(model => model.id === savedModel)
      ? savedModel
      : DEFAULT_GEMINI_MODEL;
    const savedVoice = typeof window !== 'undefined' ? localStorage.getItem('elevation_gemini_voice') : '';
    this.config = {
      // Gemini Live is proxied by Devobi's server; the API key stays server-side.
      // In browser context, we don't access the API key directly
      geminiApiKey: '', // API key is handled server-side
      geminiVoice: savedVoice || 'Aoede',
      geminiModel: configuredModel
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
        this.emit('transcript', { sender: 'user', text: transcript, isFinal: event.results[0].isFinal });

        if (event.results[0].isFinal && this.provider === VOICE_PROVIDERS.BROWSER_MOCK) {
          this.handleBrowserMockInput(transcript);
        }
      };

      this.recognition.onerror = () => {
        if (this.provider === VOICE_PROVIDERS.BROWSER_MOCK) {
          this.setState('idle');
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
        this.selectedVoice = voices.find(v =>
          v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria') || v.name.includes('Natural'))
        ) || voices.find(v => v.lang.startsWith('en')) || null;
      };
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  // Soft luxury chime synthesis using Web Audio API
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
        osc1.frequency.setValueAtTime(659.25, now);
        osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.3);
        osc2.frequency.setValueAtTime(830.61, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      } else {
        osc1.frequency.setValueAtTime(830.61, now);
        osc1.frequency.exponentialRampToValueAtTime(440.0, now + 0.3);
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
      // Only store non-sensitive config in localStorage
      if (config.geminiModel) {
        localStorage.setItem('elevation_gemini_model', config.geminiModel);
      }
      if (config.geminiVoice) {
        localStorage.setItem('elevation_gemini_voice', config.geminiVoice);
      }
      // Never store API key in localStorage for security
    }
    this.emit('providerChange', { provider: this.provider, config: this.config });
  }

  // =========================================================================
  // GOOGLE GEMINI MULTIMODAL LIVE AUDIO STREAMING ENGINE
  // =========================================================================
  async startGeminiLiveSession() {
    // Don't start if already connecting or active
    if (this.state === 'connecting' || (this.sessionActive && this.geminiSocket && this.geminiSocket.readyState === WebSocket.OPEN)) {
      console.log('[GeminiLive] Session already active or connecting, skipping duplicate start');
      return;
    }
    // Clean up any existing session
    if (this.geminiSocket) {
      try { this.geminiSocket.close(); } catch (_) { }
      this.geminiSocket = null;
    }

    this.setState('connecting');
    this.playChime('connect');

    try {
      // Ensure Web Audio Output Context is initialized
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx({ sampleRate: 24000 });
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Initialize AnalyserNode for audio visualization
      if (!this.analyser) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
      }

      // Reset playback queues
      this.clearAudioQueue();
      this.nextPlayTime = this.audioContext.currentTime;

      // Connect to Gemini Multimodal Live WebSocket (v1beta endpoint)
      // Use the server port (3001) instead of window.location.host to ensure we connect to the proxy server
      const serverHost = window.location.hostname === 'localhost' ? 'localhost:3001' : window.location.host;
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${serverHost}/api/medspa/live`;
      console.log('[GeminiLive] Attempting to connect to:', wsUrl);
      
      // Add timeout for connection attempt
      const connectTimeout = setTimeout(() => {
        if (this.geminiSocket && this.geminiSocket.readyState !== WebSocket.OPEN) {
          console.error('[GeminiLive] Connection timeout - WebSocket not opened after 10 seconds');
          this.emit('transcript', {
            sender: 'aura',
            text: 'Connection timeout - Unable to establish connection to Gemini Live service',
            isFinal: true
          });
          this.setState('idle');
        }
      }, 10000);

      this.geminiSocket = new WebSocket(wsUrl);
      this.isSetupComplete = false;
      this.sessionActive = true;

      console.log('[GeminiLive] WebSocket object created, readyState:', this.geminiSocket.readyState);

      this.geminiSocket.onopen = async () => {
        clearTimeout(connectTimeout);
        console.log('[GeminiLive] WebSocket onopen event fired');
        console.log('[GeminiLive] Connected to Gemini Multimodal Live WebSocket (v1beta)');
        console.log('[GeminiLive] WebSocket readyState:', this.geminiSocket.readyState);

        // 1. Send Handshake Setup message conforming to Gemini Live API specification
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
              thinkingConfig: {
                thinkingLevel: 'minimal'
              }
            },
            systemInstruction: {
              parts: [{ text: AURA_SYSTEM_INSTRUCTION }]
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [
              {
                functionDeclarations: [
                  {
                    name: 'book_consultation',
                    description: 'Books a VISIA 3D consultation for the client. Saves contact info to the CRM (Google Sheets) and creates a Google Calendar event. Call this ONLY after collecting the client\'s full name, phone number, email address, and preferred date/time.',
                    parameters: {
                      type: 'OBJECT',
                      properties: {
                        name: {
                          type: 'STRING',
                          description: 'Client\'s full name'
                        },
                        phone: {
                          type: 'STRING',
                          description: 'Client\'s phone number'
                        },
                        email: {
                          type: 'STRING',
                          description: 'Client\'s email address'
                        },
                        preferredDate: {
                          type: 'STRING',
                          description: 'Confirmed consultation date in YYYY-MM-DD format. Resolve phrases such as "next Tuesday" using today\'s date before calling the tool.'
                        },
                        preferredTime: {
                          type: 'STRING',
                          description: 'Confirmed consultation time in 24-hour HH:mm format in the clinic local timezone, e.g. "12:00" or "15:00".'
                        },
                        treatmentInterest: {
                          type: 'STRING',
                          description: 'The treatment(s) the client is interested in, e.g. "Botox and HydraFacial"'
                        }
                      },
                      required: ['name', 'phone', 'email', 'preferredDate', 'preferredTime']
                    }
                  }
                ]
              }
            ]
          }
        };

        try {
          this.geminiSocket.send(JSON.stringify(setupMessage));
          console.log('[GeminiLive] Setup message sent successfully');
        } catch (err) {
          console.error('[GeminiLive] Failed to send setup message:', err);
          this.emit('transcript', {
            sender: 'aura',
            text: `Failed to send setup message: ${err.message || 'Unknown error'}`,
            isFinal: true
          });
          this.setState('idle');
          return;
        }
      };

      this.geminiSocket.onmessage = async (event) => {
        try {
          let responseData;
          if (event.data instanceof Blob) {
            const text = await event.data.text();
            responseData = JSON.parse(text);
          } else {
            responseData = JSON.parse(event.data);
          }

          // Handle setup completion
          if (responseData.setupComplete) {
            console.log('[GeminiLive] Setup completed and confirmed by Gemini server');
            this.isSetupComplete = true;
            
            // Start microphone capture after setup is complete
            try {
              await this.startMicrophoneCapture();
              this.setState('listening');
              console.log('[GeminiLive] Microphone capture started, now listening');
              
              // Warm introductory greeting
              this.emit('transcript', {
                sender: 'aura',
                text: "Welcome to ÉLÉVATION. I'm Aura, powered by Gemini Live Voice AI. Speak into your microphone and I'll answer in real time.",
                isFinal: true
              });
            } catch (err) {
              console.error('[GeminiLive] Failed to start microphone capture:', err);
              this.emit('transcript', {
                sender: 'aura',
                text: `Failed to start microphone capture: ${err.message || 'Unknown error'}`,
                isFinal: true
              });
              this.setState('idle');
            }
            return;
          }

          // Handle error messages from Gemini
          if (responseData.error) {
            console.error('[GeminiLive] Gemini API error:', responseData.error);
            this.emit('transcript', {
              sender: 'aura',
              text: `Gemini API error: ${responseData.error.message || 'Unknown error'}`,
              isFinal: true
            });
            this.setState('idle');
            return;
          }

          this.handleGeminiServerMessage(responseData);
        } catch (err) {
          console.warn('[GeminiLive] Message parsing error:', err);
          this.emit('transcript', {
            sender: 'aura',
            text: `Message parsing error: ${err.message || 'Unknown error'}`,
            isFinal: true
          });
        }
      };

      this.geminiSocket.onerror = (err) => {
        clearTimeout(connectTimeout);
        console.error('[GeminiLive] WebSocket onerror event fired:', err);
        console.error('[GeminiLive] WebSocket readyState:', this.geminiSocket.readyState);
        this.emit('transcript', {
          sender: 'aura',
          text: `Gemini Live connection error: ${err.message || 'Unknown error'}`,
          isFinal: true
        });
        this.setState('idle');
      };

      this.geminiSocket.onclose = (event) => {
        clearTimeout(connectTimeout);
        if (!this.sessionActive) {
          console.log('[GeminiLive] WebSocket closed intentionally (session ended)');
          return;
        }
        const reason = event.reason || `Connection closed with code ${event.code}.`;
        console.log('[GeminiLive] WebSocket onclose event fired:', event.code, reason);
        console.log('[GeminiLive] WebSocket readyState:', this.geminiSocket.readyState);
        this.emit('transcript', {
          sender: 'aura',
          text: `Gemini Live connection notice: ${reason}`,
          isFinal: true
        });
        this.stopMicrophoneCapture();
        this.setState('idle');
      };

    } catch (err) {
      clearTimeout(connectTimeout);
      console.error('[GeminiLive] Failed to start session:', err);
      this.emit('transcript', {
        sender: 'aura',
        text: `Failed to initialize session: ${err.message || 'Unknown error'}`,
        isFinal: true
      });
      this.setState('idle');
    }
  }

  appendWithSmartSpacing(existing, chunk) {
    if (!existing) return chunk;
    if (!chunk) return existing;
    const needsSpace = !/\s$/.test(existing) && !/^\s/.test(chunk) && !/^[.,!?;:')]/.test(chunk);
    return needsSpace ? existing + ' ' + chunk : existing + chunk;
  }

  handleGeminiServerMessage(msg) {
    // 0. Setup Confirmation from Gemini Live
    if (msg.setupComplete) {
      console.log('[GeminiLive] Setup completed and confirmed by Gemini server');
      this.isSetupComplete = true;
    }

    // 0b. Tool Call – Gemini wants to invoke a function (e.g. book_consultation)
    if (msg.toolCall?.functionCalls?.length) {
      this.handleToolCall(msg.toolCall.functionCalls);
      return; // tool calls are handled asynchronously; skip transcript processing
    }

    // 1. Handle Barge-in / Turn Interruption (User spoke while Gemini was speaking)
    if (msg.serverContent?.interrupted) {
      console.log('[GeminiLive] Interrupted by user speech (barge-in)');
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

    // 2. Handle User Speech Transcription streamed by Gemini Live
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

    // 3. Handle Model Spoken Output Transcription streamed by Gemini Live
    if (msg.serverContent?.outputTranscription?.text) {
      const auraChunk = msg.serverContent.outputTranscription.text;
      if (auraChunk) {
        // Finalize user turn if one was streaming
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

    // 4. Handle Model Turn Chunks (24kHz PCM Audio and optional inline text parts)
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
        // Incoming PCM audio chunks (24kHz little-endian)
        if (part.inlineData && (part.inlineData.mimeType?.startsWith('audio/pcm') || !part.inlineData.mimeType)) {
          const base64Audio = part.inlineData.data;
          if (base64Audio) {
            this.enqueueGeminiAudioChunk(base64Audio);
          }
        }

        // Inline text transcript (fallback if outputTranscription is absent)
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

    // 5. Handle Turn Completion
    if (msg.serverContent?.turnComplete) {
      // Finalize whatever has been accumulated so far
      if (this.currentModelTurnId) {
        this.emit('transcript', {
          turnId: this.currentModelTurnId,
          sender: 'aura',
          text: this.currentModelText || ' ',
          isFinal: true
        });
      }
      // Finalize any in-flight user transcription
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

      // Reset model turn state AFTER emitting
      this.currentModelTurnId = null;
      this.currentModelText = '';
      this.outputTranscriptionReceivedThisTurn = false;

      if (!this.isPlayingAudio) {
        this.setState('listening');
      }
    }
  }

  // =========================================================================
  // FUNCTION CALLING – Gemini triggers tools (CRM + Calendar)
  // =========================================================================

  /**
   * Receives an array of functionCall objects from Gemini Live,
   * executes each one, and sends back a toolResponse so Gemini can continue.
   */
  async handleToolCall(functionCalls) {
    if (!this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

    const functionResponses = [];

    for (const call of functionCalls) {
      console.log(`[GeminiLive] Tool call: ${call.name}`, call.args);
      try {
        const result = await this.executeTool(call.name, call.args);
        functionResponses.push({
          id: call.id,
          name: call.name,
          response: { output: result }
        });
      } catch (err) {
        console.error(`[GeminiLive] Tool "${call.name}" threw:`, err);
        functionResponses.push({
          id: call.id,
          name: call.name,
          response: { output: `Error: ${err.message}` }
        });
      }
    }

    // Send all responses back to Gemini in one message
    this.geminiSocket.send(JSON.stringify({
      toolResponse: { functionResponses }
    }));
  }

  /**
   * Routes a function call to the appropriate service.
   * @returns {Promise<string>} Human-readable result string for Gemini to summarise.
   */
  async executeTool(name, args) {
    if (name === 'book_consultation') {
      const {
        name: clientName,
        phone,
        email,
        preferredDate,
        preferredTime,
        treatmentInterest = ''
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
        treatmentInterest
      });

      const crmOk  = crm?.success;
      const calOk  = calendar?.success;
      const emailOk = confirmationEmail?.success;

      if (crmOk || calOk) {
        // Emit a UI event so the modal can show a success toast / confirmation card
        this.emit('bookingConfirmed', {
          name: clientName,
          phone,
          email,
          preferredDate,
          preferredTime: normalizedTime,
          treatmentInterest,
          eventLink: calendar?.eventLink || null,
          crmRow:    crm?.row || null
        });
        const parts = [];
        if (crmOk) parts.push(`contact saved to CRM (row ${crm.row})`);
        if (calOk) {
          parts.push(calendar.inviteSent === false
            ? 'calendar event created'
            : 'calendar event created');
        }
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

  // Capture Microphone and Stream 16kHz PCM Little-Endian to Gemini Live
  async startMicrophoneCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.inputAudioContext = new AudioCtx({ sampleRate: 16000 });
      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);

      // Load AudioWorklet processor
      try {
        const workletPath = '/medspa/worklets/audioProcessor.js';
        await this.inputAudioContext.audioWorklet.addModule(workletPath);
      } catch (err) {
        console.warn('[GeminiLive] AudioWorklet load failed, falling back to ScriptProcessor:', err);
        this.startScriptProcessorFallback(source);
        return;
      }

      // Create AudioWorkletNode
      this.audioWorklet = new AudioWorkletNode(this.inputAudioContext, 'audio-processor');
      
      // Handle audio data from worklet
      this.audioWorklet.port.onmessage = (event) => {
        if (event.data.type === 'audio-data' && this.sessionActive) {
          if (!this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

          const pcmData = new Int16Array(event.data.data);
          const base64Data = this.arrayBufferToBase64(pcmData.buffer);

          // Stream real-time input to Gemini Live via standard realtimeInput audio format
          const realtimeInputMessage = {
            realtimeInput: {
              audio: {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Data
              }
            }
          };

          this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
        }
      };

      source.connect(this.audioWorklet);
      this.audioWorklet.connect(this.inputAudioContext.destination);

    } catch (err) {
      console.error('[GeminiLive] Microphone access error:', err);
      this.emit('transcript', {
        sender: 'aura',
        text: "Microphone access was denied. Please allow microphone permissions in your browser to speak with Aura.",
        isFinal: true
      });
    }
  }

  // Fallback to ScriptProcessor for browsers that don't support AudioWorklet
  startScriptProcessorFallback(source) {
    // Buffer size 2048 at 16kHz corresponds to ~128ms packets
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(2048, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.sessionActive) return;
      if (!this.geminiSocket || this.geminiSocket.readyState !== WebSocket.OPEN) return;

      const inputBuffer = e.inputBuffer.getChannelData(0);
      // Convert Float32Array to 16-bit linear PCM (little-endian)
      const pcmData = new Int16Array(inputBuffer.length);
      for (let i = 0; i < inputBuffer.length; i++) {
        const s = Math.max(-1, Math.min(1, inputBuffer[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Convert PCM to base64
      const base64Data = this.arrayBufferToBase64(pcmData.buffer);

      // Stream real-time input to Gemini Live via standard realtimeInput audio format
      const realtimeInputMessage = {
        realtimeInput: {
          audio: {
            mimeType: 'audio/pcm;rate=16000',
            data: base64Data
          }
        }
      };

      this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  stopMicrophoneCapture() {
    if (this.geminiSocket && this.geminiSocket.readyState === WebSocket.OPEN) {
      try {
        this.geminiSocket.send(JSON.stringify({
          realtimeInput: { audioStreamEnd: true }
        }));
      } catch (_) { }
    }
    if (this.audioWorklet) {
      try { this.audioWorklet.disconnect(); } catch (_) { }
      this.audioWorklet = null;
    }
    if (this.scriptProcessor) {
      try { this.scriptProcessor.disconnect(); } catch (_) { }
      this.scriptProcessor = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioContext) {
      try { this.inputAudioContext.close(); } catch (_) { }
      this.inputAudioContext = null;
    }
  }

  // Decode and queue Gemini's 24kHz PCM audio chunks for smooth gapless playback
  enqueueGeminiAudioChunk(base64Audio) {
    if (!this.audioContext) return;

    try {
      const arrayBuffer = this.base64ToArrayBuffer(base64Audio);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);

      // Convert 16-bit PCM to Float32
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      // Create AudioBuffer at 24kHz
      const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      // Schedule playback
      const currentTime = this.audioContext.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime + 0.04; // small initial latency buffer
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Connect through AnalyserNode so visualizer pulses to Gemini's actual voice
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
        if (!this.sessionActive) return;  // session ended — don't touch state
        const index = this.scheduledSources.indexOf(source);
        if (index > -1) {
          this.scheduledSources.splice(index, 1);
        }
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
      try {
        source.stop();
        source.disconnect();
      } catch (_) { }
    }
    this.scheduledSources = [];
    this.isPlayingAudio = false;
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
  }

  // Utility: Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Utility: ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // =========================================================================
  // SESSION CONTROLS
  // =========================================================================
  async startSession() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      await this.startGeminiLiveSession();
    } else {
      // Browser Mock
      this.playChime('connect');
      this.setState('connecting');
      setTimeout(() => {
        const welcome = "Welcome to ÉLÉVATION. I'm Aura, your AI aesthetic concierge. How may I assist with your skin, body, or facial rejuvenation goals today?";
        this.speakBrowser(welcome);
      }, 400);
    }
  }

  endSession() {
    this.sessionActive = false;  // disable all async callbacks immediately
    this.playChime('disconnect');

    if (this.geminiSocket) {
      try { this.geminiSocket.close(); } catch (_) { }
      this.geminiSocket = null;
    }

    this.stopMicrophoneCapture();
    this.clearAudioQueue();

    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch (_) { }
    }
    if (this.synth) {
      this.synth.cancel();
    }

    this.setState('idle');
  }

  startListening() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      // If session is already active and connected, just set state to listening
      if (this.sessionActive && this.geminiSocket && this.geminiSocket.readyState === WebSocket.OPEN) {
        this.setState('listening');
      } else {
        // Otherwise start a new session
        this.startGeminiLiveSession();
      }
    } else {
      if (this.recognition && this.state !== 'listening') {
        try {
          this.recognition.start();
        } catch (_) {
          this.setState('listening');
        }
      } else {
        this.setState('listening');
      }
    }
  }

  stopListening() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      this.setState('idle');
    } else {
      if (this.recognition) {
        try { this.recognition.stop(); } catch (_) { }
      }
      this.setState('idle');
    }
  }

  // User input from text bar or prompt chip
  handleUserVoiceInput(text) {
    if (!text || text.trim().length === 0) return;

    // Reset turn buffers for new exchange
    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;

    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE && this.geminiSocket && this.geminiSocket.readyState === WebSocket.OPEN) {
      this.setState('thinking');
      // Send text message directly to Gemini Live using realtimeInput per latest Live API specification
      const realtimeInputMessage = {
        realtimeInput: {
          text: text
        }
      };
      this.geminiSocket.send(JSON.stringify(realtimeInputMessage));
    } else {
      // Browser Mock Fallback
      this.handleBrowserMockInput(text);
    }
  }

  handleBrowserMockInput(text) {
    this.setState('thinking');
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matched = MEDSPA_KNOWLEDGE.find(item =>
        item.keywords.some(k => lower.includes(k))
      );

      const reply = matched
        ? matched.response
        : `Thank you for sharing that. At ÉLÉVATION, every protocol is customized to your facial anatomy. Would you like me to reserve a private consultation with Dr. Vance or Elena Rostova, PA-C?`;

      this.speakBrowser(reply);
    }, 400);
  }

  speakBrowser(text) {
    this.emit('transcript', { sender: 'aura', text: text, isFinal: true });
    this.setState('speaking');

    if (this.synth) {
      this.synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = 0.96;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        this.setState('idle');
      };
      utterance.onerror = () => {
        this.setState('idle');
      };

      this.synth.speak(utterance);
    } else {
      const duration = Math.min(Math.max(text.length * 50, 2000), 6000);
      setTimeout(() => {
        this.setState('idle');
      }, duration);
    }
  }

  setState(newState) {
    this.state = newState;
    this.emit('state', newState);
  }

  subscribe(event, callback) {
    this.listeners.add({ event, callback });
    return () => {
      this.listeners.forEach(item => {
        if (item.callback === callback) {
          this.listeners.delete(item);
        }
      });
    };
  }

  emit(event, data) {
    this.listeners.forEach(item => {
      if (item.event === event || item.event === '*') {
        item.callback(data);
      }
    });
  }
}

export const voiceAgent = new VoiceAgentService();
export default voiceAgent;
