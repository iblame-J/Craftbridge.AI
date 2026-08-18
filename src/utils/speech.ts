import { PrimaryLanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

// Map primary languages to BCP-47 voice codes
const LANG_VOICE_MAP: Record<string, string[]> = {
  en: ['en-IN', 'en-US', 'en-GB'],
  kn: ['kn-IN', 'kn', 'hi-IN', 'en-IN'],
  hi: ['hi-IN', 'hi', 'en-IN'],
  ta: ['ta-IN', 'ta', 'en-IN'],
  te: ['te-IN', 'te', 'en-IN'],
  ml: ['ml-IN', 'ml', 'en-IN'],
  bn: ['bn-IN', 'bn-BD', 'bn', 'en-IN'],
  mr: ['mr-IN', 'mr', 'hi-IN', 'en-IN'],
  gu: ['gu-IN', 'gu', 'hi-IN', 'en-IN'],
  ur: ['ur-IN', 'ur-PK', 'ur', 'hi-IN', 'en-IN'],
  fr: ['fr-FR', 'fr'],
  es: ['es-ES', 'es-MX', 'es'],
  de: ['de-DE', 'de'],
  ar: ['ar-SA', 'ar-AE', 'ar'],
};

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function speakText(
  text: string,
  langCode: PrimaryLanguageCode | string = 'en',
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): boolean {
  if (!isSpeechSupported() || !text || text.trim() === '') {
    options?.onEnd?.();
    return false;
  }

  try {
    stopSpeech();

    // Clean emojis and markdown formatting from spoken text
    const cleanText = text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '') // remove emojis
      .replace(/[*_#`~]/g, '') // remove markdown symbols
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      options?.onEnd?.();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options?.rate || 0.95;
    utterance.pitch = options?.pitch || 1.0;

    const targetVoiceLocales = LANG_VOICE_MAP[langCode] || ['en-US'];
    utterance.lang = targetVoiceLocales[0];

    // Attempt to match best available browser voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => targetVoiceLocales.some(loc => v.lang.toLowerCase().startsWith(loc.toLowerCase())));
      if (match) {
        utterance.voice = match;
        utterance.lang = match.lang;
      }
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      options?.onError?.(e);
      options?.onEnd?.();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    options?.onEnd?.();
    return false;
  }
}

// Browser Speech Recognition wrapper
export interface SpeechRecognitionController {
  stop: () => void;
  isListening: boolean;
}

export function startSpeechRecognition(
  langCode: PrimaryLanguageCode | string,
  callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
    onStart?: () => void;
  }
): SpeechRecognitionController {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    callbacks.onError?.('Speech recognition is not supported in this browser. Please use text input or Chrome/Edge.');
    callbacks.onEnd?.();
    return { stop: () => {}, isListening: false };
  }

  try {
    const recognition = new SpeechRecognition();
    const primary = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    recognition.lang = primary ? primary.voiceLang : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isListening = true;

    recognition.onstart = () => {
      isListening = true;
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const fullTranscript = (finalTranscript || interimTranscript).trim();
      if (fullTranscript) {
        callbacks.onResult(fullTranscript, !!finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      callbacks.onError?.(event.error === 'not-allowed' ? 'Microphone access was denied. Please allow microphone permissions.' : 'Voice recognition stopped or encountered an error.');
    };

    recognition.onend = () => {
      isListening = false;
      callbacks.onEnd?.();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          isListening = false;
          recognition.stop();
        } catch (e) {
          // ignore
        }
      },
      isListening: true,
    };
  } catch (err) {
    console.error('Failed to initialize speech recognition:', err);
    callbacks.onError?.('Could not start speech recognition.');
    callbacks.onEnd?.();
    return { stop: () => {}, isListening: false };
  }
}
