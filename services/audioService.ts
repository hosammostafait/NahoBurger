
import { GoogleGenAI, Modality } from "@google/genai";

const SOUNDS = {
  CLICK: 'https://actions.google.com/sounds/v1/buttons/light_switch_on.ogg',
  CORRECT: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
  WRONG: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flick.ogg',
  SUCCESS: 'https://actions.google.com/sounds/v1/cartoon/clime_up_the_ladder.ogg',
  TRANSITION: 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_accent.ogg'
};

class AudioService {
  private audioCtx: AudioContext | null = null;

  private initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private play(url: string) {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }

  playClick() { this.play(SOUNDS.CLICK); }
  playCorrect() { this.play(SOUNDS.CORRECT); }
  playWrong() { this.play(SOUNDS.WRONG); }
  playSuccess() { this.play(SOUNDS.SUCCESS); }

  async speak(text: string) {
    if (!process.env.API_KEY) {
      console.warn("API_KEY is missing. TTS will not work.");
      return;
    }

    try {
      const ctx = this.initAudio();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `اقرأ السؤال التالي بوضوح للأطفال: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioData = this.base64ToUint8Array(base64Audio);
        const audioBuffer = await this.decodeAudioData(audioData, ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {
      console.error("TTS Error:", e);
    }
  }

  private base64ToUint8Array(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}

export const audioService = new AudioService();
