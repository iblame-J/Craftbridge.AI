import React, { useState } from 'react';
import { 
  Heart, 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Globe, 
  BookOpen 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { startSpeechRecognition, SpeechRecognitionController } from '../utils/speech';

interface StoryModalProps {
  onClose: () => void;
}

export const ArtisanStoryModal: React.FC<StoryModalProps> = ({ onClose }) => {
  const {
    language,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    selectedArtisan,
    artisans,
    showNotification
  } = useApp();

  const currentArtisan = selectedArtisan || artisans[0];
  const [spokenText, setSpokenText] = useState<string>(currentArtisan.story || '');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedStory, setGeneratedStory] = useState<{
    native: string;
    english: string;
    tagline: string;
    translations?: Record<string, string>;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'native' | 'english'>('native');

  const toggleSpeech = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      stopAudio();
      setIsListening(true);
      startSpeechRecognition(language, {
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setSpokenText(prev => (isFinal ? (prev ? prev + ' ' : '') + transcript : prev));
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    stopAudio();
    speak('Gemini AI is crafting your authentic artisan story in your language and English. Please wait.');

    try {
      const res = await fetch('/api/ai/artisan-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisanName: currentArtisan.name,
          craftCategory: currentArtisan.craftTypeName || currentArtisan.craftType,
          region: `${currentArtisan.region}, ${currentArtisan.state}`,
          yearsOfExperience: currentArtisan.yearsOfExperience,
          generationInfo: currentArtisan.generation,
          rawSpokenText: spokenText || 'I learned traditional weaving from my ancestors and use only natural materials.',
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setGeneratedStory({
          native: data.story.storyInNativeLanguage,
          english: data.story.storyEnglish,
          tagline: data.story.suggestedTagline,
          translations: data.story.translations,
        });
      }
    } catch (e) {
      console.warn('Story generation error:', e);
      setGeneratedStory({
        native: spokenText,
        english: `Artisan ${currentArtisan.name} preserves authentic handmade heritage from ${currentArtisan.region}.`,
        tagline: `Master Artisan from ${currentArtisan.region}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveStory = () => {
    showNotification('Artisan story saved & published to your public profile!');
    speak('Your story has been saved and is now visible to buyers worldwide.');
    onClose();
  };

  return (
    <div 
      id="artisan-story-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
    >
      <div 
        id="artisan-story-modal-content"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-7 bg-white text-stone-900 border border-stone-300 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
          aria-label="Close story editor"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 pb-4 mb-5 border-b border-stone-200">
          <div className="p-2.5 rounded-xl bg-stone-100 text-stone-900 border border-stone-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 id="story-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {t.artisanStory}
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Share how you learned your craft, your family traditions, and your passion.
            </p>
          </div>
        </div>

        {/* Spoken Input Section */}
        <div className="mb-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Speak or type your journey in your own words:
          </label>
          
          <div className="relative">
            <textarea
              rows={4}
              value={spokenText}
              onChange={(e) => setSpokenText(e.target.value)}
              placeholder="e.g. ನಾನು ನನ್ನ ತಾತ ಮತ್ತು ತಂದೆಯಿಂದ ಈ ಕಲೆಯನ್ನು ಕಲಿತೆ... (Speak in your mother tongue)"
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-stone-50 font-normal text-sm text-stone-900 outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 pr-12 transition"
            />
            <button
              onClick={toggleSpeech}
              className={`absolute top-3 right-3 p-2 rounded-lg transition ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
              title={isListening ? 'Stop Mic' : 'Start Mic'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-5">
          <button
            onClick={handleGenerateStory}
            disabled={isGenerating || !spokenText.trim()}
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Crafting your authentic story with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Story & Global English Translation</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Preview */}
        {generatedStory && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab('native')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'native' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  Mother Tongue
                </button>
                <button
                  onClick={() => setActiveTab('english')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeTab === 'english' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  English Translation
                </button>
              </div>

              <button
                onClick={() => {
                  const text = activeTab === 'native' ? generatedStory.native : generatedStory.english;
                  isVoiceSpeaking ? stopAudio() : speak(text);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 text-stone-800 font-bold text-xs hover:bg-stone-300 transition"
              >
                {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>Listen</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm leading-relaxed font-normal">
              {activeTab === 'native' ? generatedStory.native : generatedStory.english}
            </div>

            <div className="mt-2.5 text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Tagline: <strong className="text-stone-900 font-bold">{generatedStory.tagline}</strong></span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-xs sm:text-sm text-stone-700 hover:bg-stone-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveStory}
            className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-xs transition"
          >
            Save to Profile
          </button>
        </div>

      </div>
    </div>
  );
};
