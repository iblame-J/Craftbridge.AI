import React from 'react';
import { 
  Eye, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Type,
  Sun,
  Hand,
  Ear,
  RotateCcw,
  Check,
  X,
  Sliders,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccessibilitySettings } from '../types';

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  voiceGuidance: true,
  captionsEnabled: true,
  simplifiedMode: false,
  screenReaderOptimized: false,
  keyboardAssistance: false,
  speechRate: 0.95,
};

export const AccessibilityModal: React.FC = () => {
  const {
    accessibility,
    updateAccessibility,
    isAccessibilityModalOpen,
    setIsAccessibilityModalOpen,
    language,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking
  } = useApp();

  if (!isAccessibilityModalOpen) return null;

  const handleApplyPreset = (preset: 'standard' | 'highContrast' | 'easyMode' | 'voiceAssist') => {
    switch (preset) {
      case 'standard':
        updateAccessibility(DEFAULT_ACCESSIBILITY);
        speak('Standard display settings restored.');
        break;
      case 'highContrast':
        updateAccessibility({
          highContrast: true,
          largeText: true,
          captionsEnabled: false,
          simplifiedMode: false
        });
        speak('High contrast and large text enabled.');
        break;
      case 'easyMode':
        updateAccessibility({
          simplifiedMode: true,
          largeText: true,
          voiceGuidance: true,
          highContrast: false
        });
        speak('Easy Mode activated with one task per screen.');
        break;
      case 'voiceAssist':
        updateAccessibility({
          voiceGuidance: true,
          captionsEnabled: true,
          keyboardAssistance: true
        });
        speak('Voice and audio guidance enabled.');
        break;
    }
  };

  return (
    <div 
      id="accessibility-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
    >
      <div 
        id="accessibility-modal-content"
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl transition-all ${
          accessibility.highContrast 
            ? 'bg-black text-white border-4 border-yellow-400' 
            : 'bg-white text-stone-900 border border-stone-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              accessibility.highContrast ? 'bg-yellow-400 text-black' : 'bg-stone-900 text-white'
            }`}>
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 
                id="accessibility-modal-title"
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight"
              >
                {t.accessibilitySettings || 'Accessibility Options'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                {t.accessibilityOptionsSub || 'Customize visual contrast, text size, voice guidance, and easy mode.'}
              </p>
            </div>
          </div>

          <button
            id="close-accessibility-modal-btn"
            onClick={() => setIsAccessibilityModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
            aria-label="Close accessibility options"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick One-Tap Presets */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleApplyPreset('standard')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                !accessibility.highContrast && !accessibility.simplifiedMode && !accessibility.largeText
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-xs font-bold">Standard</span>
            </button>

            <button
              onClick={() => handleApplyPreset('highContrast')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                accessibility.highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300 shadow-xs font-black'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="text-xs font-bold">High Contrast</span>
            </button>

            <button
              onClick={() => handleApplyPreset('easyMode')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                accessibility.simplifiedMode
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold">Easy Mode</span>
            </button>

            <button
              onClick={() => handleApplyPreset('voiceAssist')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                accessibility.voiceGuidance
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold">Voice Assist</span>
            </button>
          </div>
        </div>

        {/* Detailed Accessible Feature Toggles */}
        <div className="mt-6 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Individual Controls
          </label>

          {/* 1. High Contrast Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {t.highContrast || 'High Contrast Display'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ultra-clear black and yellow contrast for enhanced visual legibility.
                </p>
              </div>
            </div>

            <button
              id="toggle-high-contrast-btn"
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                accessibility.highContrast ? 'bg-amber-500' : 'bg-stone-300'
              }`}
              role="switch"
              aria-checked={accessibility.highContrast}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Large Text Size Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900 shrink-0">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {t.largeText || 'Large Text Size (125%)'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Increases typography scale across all buttons, descriptions, and forms.
                </p>
              </div>
            </div>

            <button
              id="toggle-large-text-btn"
              onClick={() => updateAccessibility({ largeText: !accessibility.largeText })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                accessibility.largeText ? 'bg-blue-600' : 'bg-stone-300'
              }`}
              role="switch"
              aria-checked={accessibility.largeText}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  accessibility.largeText ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Easy Mode / Simple Layout Toggle */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-900 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {t.easyMode || 'Easy Mode (1 Task Per Screen)'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Simplified wizard interface with oversized voice buttons for rural artisans.
                </p>
              </div>
            </div>

            <button
              id="toggle-simplified-mode-btn"
              onClick={() => updateAccessibility({ simplifiedMode: !accessibility.simplifiedMode })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                accessibility.simplifiedMode ? 'bg-purple-600' : 'bg-stone-300'
              }`}
              role="switch"
              aria-checked={accessibility.simplifiedMode}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  accessibility.simplifiedMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Visual Captions & Subtitles */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 shrink-0">
                <Ear className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-stone-900">
                  {t.subtitles || 'Visual Captions & Audio Transcripts'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Displays live text banners whenever voice guides or assistant replies play.
                </p>
              </div>
            </div>

            <button
              id="toggle-captions-btn"
              onClick={() => updateAccessibility({ captionsEnabled: !accessibility.captionsEnabled })}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                accessibility.captionsEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
              role="switch"
              aria-checked={accessibility.captionsEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  accessibility.captionsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Voice Reading Speed & Test Audio */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between gap-3 mb-2">
              <label htmlFor="speech-rate-slider" className="font-bold text-xs sm:text-sm flex items-center gap-2 text-stone-800">
                <Volume2 className="w-4 h-4 text-stone-700" />
                Voice Reading Speed: <span className="font-mono font-bold text-amber-900">{accessibility.speechRate.toFixed(2)}x</span>
              </label>
              
              <button
                id="test-voice-btn"
                onClick={() => {
                  if (isVoiceSpeaking) {
                    stopAudio();
                  } else {
                    speak(t.helpVoiceIntro);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isVoiceSpeaking ? t.stopListening : 'Test Voice'}</span>
              </button>
            </div>

            <input
              id="speech-rate-slider"
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={accessibility.speechRate}
              onChange={(e) => updateAccessibility({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>Slower (0.75x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.35x)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            onClick={() => updateAccessibility(DEFAULT_ACCESSIBILITY)}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            id="save-accessibility-preferences-btn"
            onClick={() => setIsAccessibilityModalOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition shadow-xs"
          >
            {t.savePreferences || 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
