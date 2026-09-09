/**
 * AudioWorklet processor for real-time audio capture and conversion to PCM
 * Replaces deprecated ScriptProcessorNode for modern browser compatibility
 */
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.port.onmessage = (event) => {
      if (event.data.type === 'set-socket') {
        this.socket = event.data.socket;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputChannel = input[0];
      const pcmData = new Int16Array(inputChannel.length);

      // Convert Float32Array to 16-bit linear PCM (little-endian)
      for (let i = 0; i < inputChannel.length; i++) {
        const s = Math.max(-1, Math.min(1, inputChannel[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Send PCM data to main thread
      this.port.postMessage({
        type: 'audio-data',
        data: pcmData.buffer
      }, [pcmData.buffer]);
    }
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);