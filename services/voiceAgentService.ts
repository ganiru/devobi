// @ts-nocheck Transitional conversion: Gemini Live payloads remain runtime-shaped until protocol types are introduced.
/**
 * Shared VoiceAgentService - reusable across all demo sites (plumber, medspa,
 * and future HVAC). Each site instantiates the service with a config object
 * describing its persona, booking tool, backend endpoints, and CRM function.
 *
 * Providers:
 *  1. OpenAI Realtime (WebRTC) - DEFAULT. Browser connects directly to OpenAI
 *     over WebRTC using a short-lived token minted by our backend. Favored
 *     over Gemini because it is lower-latency and simpler (no PCM chunking).
 *  2. Google Gemini Multimodal Live (WebSocket) - proxied through our server.
 *  3. Browser Web Speech (local fallback, no network).
 */

export const VOICE_PROVIDERS = {
  GEMINI_LIVE: 'gemini_live',
  OPENAI_REALTIME: 'openai_realtime',
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

// --- OpenAI Realtime (WebRTC) provider constants -------------------------
export const DEFAULT_OPENAI_MODEL = 'gpt-realtime-2';

export const OPENAI_VOICES = [
  { id: 'marin', name: 'Marin (Most natural - Recommended)' },
  { id: 'cedar', name: 'Cedar (Warm & Natural)' },
  { id: 'alloy', name: 'Alloy (Neutral & Balanced)' },
  { id: 'ballad', name: 'Ballad (Smooth & Expressive)' },
  { id: 'coral', name: 'Coral (Bright & Friendly)' }
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

/**
 * @typedef {Object} VoiceAgentConfig
 * @property {string} siteKey            localStorage namespace, e.g. 'joes' | 'elevation'
 * @property {string} brandName          e.g. "Joe's Reliable Plumbing"
 * @property {string} systemInstruction  persona + booking flow prompt
 * @property {Array}  knowledgeBase      keyword->response pairs for browser mock
 * @property {string} toolName           e.g. 'book_service_appointment' | 'book_consultation'
 * @property {string} toolDescription
 * @property {Object} toolParameters     JSON schema properties
 * @property {string[]} toolRequired
 * @property {string} openaiSessionEndpoint  e.g. '/api/plumber/realtime-session'
 * @property {string} geminiWsPath           e.g. '/api/plumber/live'
 * @property {string} workletPath            e.g. '/plumber/worklets/audioProcessor.js'
 * @property {string} welcomeMessage
 * @property {string} [defaultProvider]      defaults to OPENAI_REALTIME
 * @property {string} [defaultOpenAIVoice]   defaults to 'marin'
 * @property {string} [defaultGeminiVoice]   defaults to 'Aoede'
 * @property {Function} executeTool          (name, args) => Promise<string>
 */

class VoiceAgentService {
  constructor(config) {
    this.config = config;
    this.provider = config.defaultProvider || VOICE_PROVIDERS.OPENAI_REALTIME;
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

    // OpenAI Realtime (WebRTC) state
    this.rtcPeerConnection = null;
    this.rtcDataChannel = null;
    this.rtcDataChannelOpen = false;
    this.openaiMicStream = null;
    this.remoteAudioElement = null;
    this.currentOpenAIResponseId = null;

    // Live turn transcript streaming buffers
    this.currentModelTurnId = null;
    this.currentModelText = '';
    this.currentUserTurnId = null;
    this.currentUserText = '';
    this.outputTranscriptionReceivedThisTurn = false;

    const savedGeminiVoice = typeof window !== 'undefined' ? localStorage.getItem(`${config.siteKey}_gemini_voice`) : '';
    const configuredGeminiVoice = GEMINI_VOICES.some(v => v.id === savedGeminiVoice) ? savedGeminiVoice : (config.defaultGeminiVoice || 'Aoede');

    const savedOpenAIVoice = typeof window !== 'undefined' ? localStorage.getItem(`${config.siteKey}_openai_voice`) : '';
    const configuredOpenAIVoice = OPENAI_VOICES.some(v => v.id === savedOpenAIVoice) ? savedOpenAIVoice : (config.defaultOpenAIVoice || 'marin');

    this.runtimeConfig = {
      geminiVoice: configuredGeminiVoice,
      geminiModel: DEFAULT_GEMINI_MODEL,
      openaiVoice: configuredOpenAIVoice,
      openaiModel: DEFAULT_OPENAI_MODEL,
      openaiSessionEndpoint: config.openaiSessionEndpoint
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
    this.runtimeConfig = { ...this.runtimeConfig, ...config };
    if (typeof window !== 'undefined') {
      if (config.geminiVoice) {
        localStorage.setItem(`${this.config.siteKey}_gemini_voice`, config.geminiVoice);
      }
      if (config.openaiVoice) {
        localStorage.setItem(`${this.config.siteKey}_openai_voice`, config.openaiVoice);
      }
    }
    this.emit('providerChange', { provider: this.provider });
  }

  // =========================================================================
  // GOOGLE GEMINI MULTIMODAL LIVE (WebSocket, proxied via server)
  // =========================================================================
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
      const wsUrl = `${protocol}//${serverHost}${this.config.geminiWsPath}`;

      console.log('[GeminiLive] Connecting to:', wsUrl);

      const connectTimeout = setTimeout(() => {
        if (this.geminiSocket?.readyState !== WebSocket.OPEN) {
          console.error('[GeminiLive] Connection timeout');
          this.emit('transcript', {
            sender: 'aura',
            text: "Connection timeout. Let me try connecting again...",
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
            model: this.runtimeConfig.geminiModel || DEFAULT_GEMINI_MODEL,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.runtimeConfig.geminiVoice || 'Aoede'
                  }
                }
              },
              thinkingConfig: { thinkingLevel: 'minimal' }
            },
            systemInstruction: {
              parts: [{ text: this.config.systemInstruction }]
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [{
              functionDeclarations: [{
                name: this.config.toolName,
                description: this.config.toolDescription,
                parameters: {
                  type: 'OBJECT',
                  properties: this.config.toolParameters,
                  required: this.config.toolRequired
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
              text: this.config.welcomeMessage,
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

  // =========================================================================
  // OPENAI REALTIME (WebRTC) - DEFAULT provider
  // =========================================================================
  async startOpenAIRealtimeSession() {
    if (this.state === 'connecting' || (this.sessionActive && this.rtcDataChannelOpen)) {
      console.log('[OpenAIRealtime] Session already active or connecting');
      return;
    }

    this.endOpenAIRealtimeSession(); // clean slate if a stale session exists

    this.setState('connecting');
    this.playChime('connect');

    const connectTimeout = setTimeout(() => {
      if (!this.rtcDataChannelOpen) {
        console.error('[OpenAIRealtime] Connection timeout');
        this.emit('transcript', {
          sender: 'aura',
          text: "Connection timeout. Let me try connecting again...",
          isFinal: true
        });
        this.endOpenAIRealtimeSession();
        this.setState('idle');
      }
    }, 10000);

    try {
      // 1. Mint a short-lived client secret via our backend.
      const tokenResponse = await fetch(this.runtimeConfig.openaiSessionEndpoint, { method: 'POST' });
      if (!tokenResponse.ok) {
        throw new Error(`Failed to get realtime session token (HTTP ${tokenResponse.status})`);
      }
      const { clientSecret, model } = await tokenResponse.json();
      if (!clientSecret) throw new Error('No client secret returned by server.');

      // 2. Set up the peer connection + local mic track.
      const pc = new RTCPeerConnection();
      this.rtcPeerConnection = pc;
      this.sessionActive = true;

      if (!this.remoteAudioElement) {
        this.remoteAudioElement = document.createElement('audio');
        this.remoteAudioElement.autoplay = true;
      }
      pc.ontrack = (event) => {
        this.remoteAudioElement.srcObject = event.streams[0];
      };

      this.openaiMicStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      this.openaiMicStream.getTracks().forEach((track) => pc.addTrack(track, this.openaiMicStream));

      // 3. Data channel for session config, transcripts, and tool calls.
      const dc = pc.createDataChannel('oai-events');
      this.rtcDataChannel = dc;

      dc.onopen = () => {
        clearTimeout(connectTimeout);
        this.rtcDataChannelOpen = true;
        console.log('[OpenAIRealtime] Data channel open, sending session.update');

        this.sendOpenAIEvent({
          type: 'session.update',
          session: {
            type: 'realtime',
            output_modalities: ['audio'],
            instructions: this.config.systemInstruction,
            audio: {
              input: {
                transcription: { model: 'gpt-realtime-whisper' },
                turn_detection: { type: 'server_vad', silence_duration_ms: 500 }
              },
              output: {
                voice: this.runtimeConfig.openaiVoice || 'marin'
              }
            },
            tools: [{
              type: 'function',
              name: this.config.toolName,
              description: this.config.toolDescription,
              parameters: {
                type: 'object',
                properties: this.config.toolParameters,
                required: this.config.toolRequired
              }
            }]
          }
        });

        this.setState('listening');
        this.emit('transcript', {
          sender: 'aura',
          text: this.config.welcomeMessage,
          isFinal: true
        });
      };

      dc.onmessage = (event) => {
        try {
          this.handleOpenAIServerEvent(JSON.parse(event.data));
        } catch (err) {
          console.warn('[OpenAIRealtime] Event parsing error:', err);
        }
      };

      dc.onerror = (err) => {
        console.error('[OpenAIRealtime] Data channel error:', err);
      };

      dc.onclose = () => {
        this.rtcDataChannelOpen = false;
        if (this.sessionActive) {
          this.setState('idle');
        }
      };

      // 4. SDP offer/answer exchange directly against OpenAI's Realtime endpoint.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model || this.runtimeConfig.openaiModel)}`,
        {
          method: 'POST',
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            'Content-Type': 'application/sdp'
          }
        }
      );

      if (!sdpResponse.ok) {
        throw new Error(`OpenAI SDP exchange failed (HTTP ${sdpResponse.status})`);
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    } catch (err) {
      clearTimeout(connectTimeout);
      console.error('[OpenAIRealtime] Failed to start session:', err);
      this.emit('transcript', { sender: 'aura', text: `Failed to initialize: ${err.message}`, isFinal: true });
      this.endOpenAIRealtimeSession();
      this.setState('idle');
    }
  }

  sendOpenAIEvent(eventObj) {
    if (this.rtcDataChannel && this.rtcDataChannel.readyState === 'open') {
      this.rtcDataChannel.send(JSON.stringify(eventObj));
    }
  }

  handleOpenAIServerEvent(msg) {
    switch (msg.type) {
      case 'input_audio_buffer.speech_started':
        if (this.currentModelTurnId && this.currentModelText) {
          this.emit('transcript', {
            turnId: this.currentModelTurnId,
            sender: 'aura',
            text: this.currentModelText,
            isFinal: true
          });
        }
        this.currentModelTurnId = null;
        this.currentModelText = '';

        // IMMEDIATELY show the user's speech bubble so they see their
        // message appear before the AI starts responding.
        this.currentUserTurnId = 'user-' + Date.now();
        this.currentUserText = '(listening...)';
        this.emit('transcript', {
          turnId: this.currentUserTurnId,
          sender: 'user',
          text: this.currentUserText,
          isFinal: false
        });

        this.setState('listening');
        break;

      case 'conversation.item.input_audio_transcription.completed':
        const finalTurnId = this.currentUserTurnId || ('user-' + Date.now());
        if (!this.currentUserTurnId) {
          this.currentUserTurnId = finalTurnId;
        }
        this.currentUserText = msg.transcript || '';
        this.emit('transcript', {
          turnId: finalTurnId,
          sender: 'user',
          text: this.currentUserText,
          isFinal: true
        });
        this.currentUserTurnId = null;
        this.currentUserText = '';
        break;

      case 'response.created':
        this.currentOpenAIResponseId = msg.response?.id || null;
        this.setState('thinking');
        break;

      case 'response.output_audio_transcript.delta':
      case 'response.audio_transcript.delta':
        if (!this.currentModelTurnId) {
          this.currentModelTurnId = 'aura-' + Date.now();
          this.currentModelText = '';
        }
        this.currentModelText = this.appendWithSmartSpacing(this.currentModelText, msg.delta || '');
        this.setState('speaking');
        this.emit('transcript', {
          turnId: this.currentModelTurnId,
          sender: 'aura',
          text: this.currentModelText,
          isFinal: false
        });
        break;

      case 'response.function_call_arguments.done':
        this.handleOpenAIFunctionCall(msg.call_id, msg.name, msg.arguments);
        break;

      case 'response.done':
        if (this.currentModelTurnId) {
          this.emit('transcript', {
            turnId: this.currentModelTurnId,
            sender: 'aura',
            text: this.currentModelText || ' ',
            isFinal: true
          });
        }
        this.currentModelTurnId = null;
        this.currentModelText = '';
        this.currentOpenAIResponseId = null;
        if (this.state === 'speaking' || this.state === 'thinking') {
          this.setState('listening');
        }
        break;

      case 'error':
        console.error('[OpenAIRealtime] Server error event:', msg.error);
        this.emit('transcript', { sender: 'aura', text: `Error: ${msg.error?.message || 'Unknown error'}`, isFinal: true });
        break;

      default:
        break;
    }
  }

  async handleOpenAIFunctionCall(callId, name, argsJsonString) {
    let args = {};
    try {
      args = argsJsonString ? JSON.parse(argsJsonString) : {};
    } catch (err) {
      console.error('[OpenAIRealtime] Failed to parse function call arguments:', err);
      this.sendOpenAIEvent({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: `Error: Failed to parse arguments: ${err.message}`
        }
      });
      this.sendOpenAIEvent({ type: 'response.create' });
      return;
    }

    console.log(`[OpenAIRealtime] Tool call: ${name}`, JSON.stringify(args, null, 2));

    let output;
    try {
      output = await this.config.executeTool(name, args);
    } catch (err) {
      console.error('[OpenAIRealtime] executeTool error:', err);
      output = `Error: ${err.message}`;
    }

    console.log(`[OpenAIRealtime] Tool result:`, output);

    this.sendOpenAIEvent({
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: typeof output === 'string' ? output : JSON.stringify(output)
      }
    });
    this.sendOpenAIEvent({ type: 'response.create' });
  }

  endOpenAIRealtimeSession() {
    if (this.rtcDataChannel) {
      try { this.rtcDataChannel.close(); } catch (_) { }
      this.rtcDataChannel = null;
    }
    this.rtcDataChannelOpen = false;
    if (this.rtcPeerConnection) {
      try { this.rtcPeerConnection.close(); } catch (_) { }
      this.rtcPeerConnection = null;
    }
    if (this.openaiMicStream) {
      this.openaiMicStream.getTracks().forEach((t) => t.stop());
      this.openaiMicStream = null;
    }
    if (this.remoteAudioElement) {
      this.remoteAudioElement.srcObject = null;
    }
    this.currentOpenAIResponseId = null;
  }

  // =========================================================================
  // MICROPHONE CAPTURE (Gemini Live only - OpenAI uses WebRTC tracks)
  // =========================================================================
  async startMicrophoneCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.inputAudioContext = new AudioCtx({ sampleRate: 16000 });
      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);

      try {
        await this.inputAudioContext.audioWorklet.addModule(this.config.workletPath);
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
        const result = await this.config.executeTool(call.name, call.args);
        functionResponses.push({ id: call.id, name: call.name, response: { output: result } });
      } catch (err) {
        functionResponses.push({ id: call.id, name: call.name, response: { output: `Error: ${err.message}` } });
      }
    }

    this.geminiSocket.send(JSON.stringify({ toolResponse: { functionResponses } }));
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
    if (msg.toolCall?.functionCalls?.length) {
      this.handleToolCall(msg.toolCall.functionCalls);
      return;
    }

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

  // =========================================================================
  // SESSION CONTROLS
  // =========================================================================
  async startSession() {
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE) {
      await this.startGeminiLiveSession();
    } else if (this.provider === VOICE_PROVIDERS.OPENAI_REALTIME) {
      await this.startOpenAIRealtimeSession();
    } else {
      this.playChime('connect');
      this.setState('connecting');
      setTimeout(() => {
        this.speakBrowser(this.config.welcomeMessage);
      }, 400);
    }
  }

  endSession() {
    this.sessionActive = false;
    this.playChime('disconnect');
    this.geminiSocket?.close();
    this.stopMicrophoneCapture();
    this.clearAudioQueue();
    this.endOpenAIRealtimeSession();
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
    } else if (this.provider === VOICE_PROVIDERS.OPENAI_REALTIME) {
      if (this.sessionActive && this.rtcDataChannelOpen) {
        this.setState('listening');
      } else {
        this.startOpenAIRealtimeSession();
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
    if (this.provider === VOICE_PROVIDERS.GEMINI_LIVE || this.provider === VOICE_PROVIDERS.OPENAI_REALTIME) {
      this.setState('idle');
    } else {
      this.recognition?.stop();
      this.setState('idle');
    }
  }

  handleUserVoiceInput(text) {
    if (!text || text.trim().length === 0) return;

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
    } else if (this.provider === VOICE_PROVIDERS.OPENAI_REALTIME && this.rtcDataChannelOpen) {
      this.setState('thinking');
      this.sendOpenAIEvent({
        type: 'conversation.item.create',
        item: { type: 'message', role: 'user', content: [{ type: 'input_text', text }] }
      });
      this.sendOpenAIEvent({ type: 'response.create' });
    } else {
      this.handleBrowserMockInput(text);
    }
  }

  handleBrowserMockInput(text) {
    this.setState('thinking');

    const lower = text.toLowerCase();
    let matched;

    const kb = this.config.knowledgeBase || [];
    matched = kb.find(item => item.keywords.some(k => lower.includes(k)));

    const reply = matched
      ? matched.response
      : `I'm here to help! At ${this.config.brandName}, we're ready to assist you. Could I get your full name so I can help?`;

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

export default VoiceAgentService;