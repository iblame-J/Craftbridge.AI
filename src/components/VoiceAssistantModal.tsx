import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  Package,
  DollarSign,
  Search,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { startSpeechRecognition, SpeechRecognitionController } from '../utils/speech';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { PrimaryLanguageCode } from '../types';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    language,
    setLanguage,
    role,
    activeView,
    setActiveView,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    accessibility,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; action?: string }>>([
    {
      sender: 'bot',
      text: t.helpVoiceIntro,
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const speechControllerRef = useRef<SpeechRecognitionController | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Synchronize assistant language and greeting when language state changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [{ sender: 'bot', text: t.helpVoiceIntro }];
      }
      return prev;
    });

    if (isListening) {
      if (speechControllerRef.current) {
        speechControllerRef.current.stop();
      }
      startListeningWithLang(language);
    }
  }, [language, t.helpVoiceIntro]);

  // Read greeting on open if voice feedback is enabled
  useEffect(() => {
    if (isVoiceAssistantOpen && accessibility.voiceGuidance) {
      speak(t.helpVoiceIntro);
    }
    return () => {
      stopListening();
      stopAudio();
    };
  }, [isVoiceAssistantOpen]);

  const startListeningWithLang = (targetLang: PrimaryLanguageCode) => {
    stopAudio();
    setIsListening(true);
    speechControllerRef.current = startSpeechRecognition(targetLang, {
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setInputQuery(transcript);
        if (isFinal) {
          handleSendMessage(transcript, targetLang);
          stopListening();
        }
      },
      onError: (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false),
    });
  };

  const startListening = () => {
    startListeningWithLang(language);
  };

  const stopListening = () => {
    if (speechControllerRef.current) {
      speechControllerRef.current.stop();
      speechControllerRef.current = null;
    }
    setIsListening(false);
  };

  const handleSendMessage = async (textToSend?: string, overrideLang?: PrimaryLanguageCode) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const currentActiveLang = overrideLang || language;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputQuery('');
    setIsThinking(true);
    stopListening();

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentActiveLang,
          role,
          currentView: activeView,
        }),
      });
      const data = await res.json();
      const botReply = data.text || "I'm here to help you navigate and sell your craft.";
      const action = data.actionSuggestion;

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, action }]);
      setIsThinking(false);
      speak(botReply);

      // Execute action if clearly suggested
      if (action === 'OPEN_UPLOAD') {
        setTimeout(() => {
          setIsVoiceAssistantOpen(false);
          setActiveView('product-upload');
        }, 2200);
      } else if (action === 'NAVIGATE_PRODUCTS') {
        setTimeout(() => {
          setIsVoiceAssistantOpen(false);
          setActiveView(role === 'seller' ? 'seller-dashboard' : 'buyer-marketplace');
        }, 2200);
      } else if (action === 'OPEN_SMART_PRICING') {
        setTimeout(() => {
          setIsVoiceAssistantOpen(false);
          setActiveView('smart-pricing');
        }, 2200);
      }
    } catch (err) {
      console.warn('AI Assistant request failed:', err);
      const fallback = currentActiveLang === 'kn'
        ? 'ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಿದ್ದೇನೆ. ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಒತ್ತಿ ಮುಂದುವರಿಯಬಹುದು.'
        : currentActiveLang === 'hi'
        ? 'मैं आपकी मदद के लिए तैयार हूँ। आप नीचे दिए गए बटनों पर टैप कर सकते हैं।'
        : "I'm here to assist you. You can tap any of the quick suggestion buttons below.";
      setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
      setIsThinking(false);
      speak(fallback);
    }
  };

  const executeQuickCommand = (prompt: string, targetView?: string) => {
    if (targetView) {
      setIsVoiceAssistantOpen(false);
      setActiveView(targetView as any);
    } else {
      handleSendMessage(prompt);
    }
  };

  if (!isVoiceAssistantOpen) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div 
      id="voice-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-assistant-title"
    >
      <div 
        id="voice-assistant-modal-content"
        className={`relative w-full max-w-2xl h-[88vh] flex flex-col rounded-3xl p-5 sm:p-7 shadow-2xl transition-all ${
          accessibility.highContrast 
            ? 'bg-black text-white border-4 border-yellow-400' 
            : 'bg-white text-stone-900 border border-stone-200'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 ${
              accessibility.highContrast ? 'bg-yellow-400 text-black font-black' : 'bg-stone-900 text-white'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 id="voice-assistant-title" className="font-serif text-lg sm:text-xl font-bold">
                {t.talkToAssistant || 'CraftBridge Voice AI'}
              </h2>
              <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
                <span>Listening in</span>
                <span className="font-bold text-stone-900 px-1.5 py-0.2 rounded bg-stone-100 border border-stone-200">
                  {currentLangObj.nativeName} ({currentLangObj.name})
                </span>
              </p>
            </div>
          </div>

          {/* Assistant Language Switcher & Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick In-Modal Language Selector */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-300 bg-stone-50 text-xs font-semibold text-stone-800">
              <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                id="voice-assistant-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer pr-1 text-xs font-bold"
                aria-label="Change voice assistant language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-stone-900 bg-white">
                    [{lang.badge}] {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="voice-assistant-audio-toggle"
              onClick={() => (isVoiceSpeaking ? stopAudio() : speak(messages[messages.length - 1]?.text || ''))}
              className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition"
              title={isVoiceSpeaking ? 'Stop Speech' : 'Listen'}
              aria-label={isVoiceSpeaking ? 'Stop Speech' : 'Listen'}
            >
              {isVoiceSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              id="close-voice-assistant-btn"
              onClick={() => {
                stopListening();
                stopAudio();
                setIsVoiceAssistantOpen(false);
              }}
              className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                  m.sender === 'user'
                    ? accessibility.highContrast 
                      ? 'bg-yellow-400 text-black font-bold' 
                      : 'bg-stone-900 text-white rounded-br-xs'
                    : accessibility.highContrast 
                      ? 'bg-zinc-900 text-white border-2 border-yellow-400 rounded-bl-xs' 
                      : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-bl-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {m.sender === 'bot' && <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  <span>{m.text}</span>
                </div>
              </div>

              {/* Action Chip if triggered */}
              {m.action && (
                <div className="mt-1.5">
                  <button
                    onClick={() => {
                      if (m.action === 'OPEN_UPLOAD') setActiveView('product-upload');
                      if (m.action === 'OPEN_SMART_PRICING') setActiveView('smart-pricing');
                      if (m.action === 'NAVIGATE_PRODUCTS') setActiveView(role === 'seller' ? 'seller-dashboard' : 'buyer-marketplace');
                      setIsVoiceAssistantOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs shadow-xs hover:bg-stone-800 transition"
                  >
                    <span>Proceed <ArrowRight className="w-3 h-3 inline" /></span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 max-w-[55%]">
              <span className="w-2 h-2 rounded-full bg-stone-800 animate-ping"></span>
              <span className="text-xs font-semibold text-stone-600">
                Responding in {currentLangObj.nativeName}...
              </span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar border-t border-stone-100">
          <button
            id="assistant-chip-upload"
            onClick={() => executeQuickCommand('Help me upload a craft product', 'product-upload')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition"
          >
            <Package className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.addProduct || 'List Craft'}</span>
          </button>

          <button
            id="assistant-chip-price"
            onClick={() => executeQuickCommand('How much should I charge for my craft?', 'smart-pricing')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition"
          >
            <DollarSign className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.helpChoosePrice || 'Smart Pricing'}</span>
          </button>

          <button
            id="assistant-chip-products"
            onClick={() => executeQuickCommand('Show me my products', role === 'seller' ? 'seller-dashboard' : 'buyer-marketplace')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition"
          >
            <Search className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.myProducts || 'My Products'}</span>
          </button>

          <button
            id="assistant-chip-help"
            onClick={() => executeQuickCommand('Explain this page simply and clearly')}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>{t.needHelp || 'Help'}</span>
          </button>
        </div>

        {/* Input Bar with Huge Mic Button */}
        <div className="pt-3 border-t border-stone-200 flex items-center gap-2">
          <button
            id="assistant-mic-btn"
            onClick={isListening ? stopListening : startListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition shadow-xs shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-300'
                : accessibility.highContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
            title={isListening ? 'Stop Listening' : `Speak in ${currentLangObj.nativeName}`}
            aria-label={isListening ? 'Stop Listening' : `Speak in ${currentLangObj.nativeName}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <div className="flex-1 relative">
            <input
              id="assistant-text-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={
                isListening 
                  ? `Listening in ${currentLangObj.nativeName}...` 
                  : `Ask in ${currentLangObj.nativeName} or English...`
              }
              className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium outline-none transition ${
                accessibility.highContrast
                  ? 'bg-zinc-900 border-yellow-400 text-white placeholder-zinc-400'
                  : 'bg-white border-stone-300 text-stone-900 focus:border-stone-900'
              }`}
            />
          </div>

          <button
            id="assistant-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim()}
            className="p-3 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-30 text-white transition shadow-xs shrink-0"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
