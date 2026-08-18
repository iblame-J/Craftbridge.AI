import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  DollarSign,
  Globe,
  Tag,
  Layers,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CraftCategory, AiListingGenerationResponse, Product } from '../types';
import { SAMPLE_CRAFT_PRESETS } from '../data/demoData';
import { startSpeechRecognition, SpeechRecognitionController } from '../utils/speech';

export const ProductUploader: React.FC = () => {
  const {
    language,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    saveNewProduct,
    setActiveView,
    accessibility,
    setSelectedProduct,
    showNotification
  } = useApp();

  // Wizard Steps: 1: Photo -> 2: Voice/Notes -> 3: AI Review -> 4: Success
  const [step, setStep] = useState<number>(1);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [voiceNotes, setVoiceNotes] = useState<string>('');
  const [craftCategory, setCraftCategory] = useState<CraftCategory>('baskets');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedListing, setGeneratedListing] = useState<AiListingGenerationResponse | null>(null);
  
  // Editable fields in Step 3
  const [finalTitle, setFinalTitle] = useState<string>('');
  const [finalDescription, setFinalDescription] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<number>(1100);
  const [finalMaterials, setFinalMaterials] = useState<string[]>([]);
  const [finalDimensions, setFinalDimensions] = useState<string>('12" x 10"');
  const [finalHighlights, setFinalHighlights] = useState<string[]>([]);
  const [finalCare, setFinalCare] = useState<string>('');
  const [selectedPreviewLang, setSelectedPreviewLang] = useState<string>('en');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechControllerRef = useRef<SpeechRecognitionController | null>(null);

  // Trigger voice guidance when step changes
  const announceStep = (stepNum: number) => {
    if (!accessibility.voiceGuidance) return;
    if (stepNum === 1) {
      speak(`${t.step1UploadPhoto}. You can take a photo with your camera or select an image file.`);
    } else if (stepNum === 2) {
      speak(`${t.step2VoiceDescription}. Press the microphone button and describe what you made in your own language.`);
    } else if (stepNum === 3) {
      speak(`${t.step3AiReview}. Gemini AI has created your product listing and translated it to global languages.`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_CRAFT_PRESETS[0]) => {
    setPhotoPreview(preset.image);
    setCraftCategory(preset.category);
    setVoiceNotes(preset.notes);
    setFinalPrice(preset.materialCost * 3);
    showNotification(`Selected demo preset: ${preset.title}`);
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechControllerRef.current) {
        speechControllerRef.current.stop();
        speechControllerRef.current = null;
      }
      setIsListening(false);
    } else {
      stopAudio();
      setIsListening(true);
      speechControllerRef.current = startSpeechRecognition(language, {
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setVoiceNotes(prev => {
            const separator = prev ? ' ' : '';
            return isFinal ? prev + separator + transcript : prev;
          });
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  const handleGenerateListing = async () => {
    setIsGenerating(true);
    stopAudio();
    speak('CraftBridge AI is generating your listing with descriptions and translations. Please wait.');

    try {
      const res = await fetch('/api/ai/describe-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoPreview,
          rawArtisanNotes: voiceNotes || 'Traditional handmade artisan craft',
          language,
          craftCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.listing) {
        const listing = data.listing as AiListingGenerationResponse;
        setGeneratedListing(listing);
        setFinalTitle(listing.title);
        setFinalDescription(listing.description);
        setFinalMaterials(listing.materials || ['Natural materials']);
        setFinalDimensions(listing.dimensions || 'Handcrafted Standard');
        setFinalHighlights(listing.highlights || ['100% Handmade', 'Eco-friendly']);
        setFinalCare(listing.careInstructions || 'Wipe gently with clean cloth');
        setFinalPrice(listing.suggestedPriceMin ? Math.round((listing.suggestedPriceMin + listing.suggestedPriceMax) / 2) : 1100);
        
        setStep(3);
        announceStep(3);
      }
    } catch (err) {
      console.warn('Listing generation error, using local fallback:', err);
      // Fallback local populate
      setFinalTitle(language === 'kn' ? 'ನೈಸರ್ಗಿಕ ಕೈಯಿಂದ ಹೆಣೆದ ಬುಟ್ಟಿ' : 'Handwoven Heritage Craft');
      setFinalDescription(voiceNotes || 'Authentic handmade craft lovingly made by artisan.');
      setFinalMaterials(['Natural Bamboo / Raw materials']);
      setFinalHighlights(['100% Eco-Friendly', 'Generational Handcraft']);
      setFinalCare('Wipe with dry cloth.');
      setFinalPrice(1150);
      setStep(3);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishProduct = async () => {
    const newProd = await saveNewProduct({
      title: finalTitle,
      description: finalDescription,
      price: Number(finalPrice) || 1000,
      category: craftCategory,
      images: [photoPreview || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80'],
      materials: finalMaterials,
      dimensions: finalDimensions,
      highlights: finalHighlights,
      careInstructions: finalCare,
      translations: generatedListing?.translations || {},
      pricingBreakdown: {
        materialCost: Math.round(finalPrice * 0.35),
        hoursSpent: 6,
        hourlyRateEstimate: 120,
        recommendedMin: Math.round(finalPrice * 0.85),
        recommendedMax: Math.round(finalPrice * 1.15),
        explanation: 'Fair pricing based on raw materials and skilled hours.'
      }
    });

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setSelectedProduct(newProd);
    showNotification('🎉 Product successfully published to Global Marketplace!');
    setStep(4);
    speak('Congratulations! Your product is now published and available to buyers worldwide.');
  };

  return (
    <div id="product-uploader-wizard" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Breadcrumb & Voice Reader */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => {
            if (step > 1 && step < 4) {
              setStep(step - 1);
            } else {
              setActiveView('seller-dashboard');
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 font-bold text-xs sm:text-sm hover:bg-stone-200 text-stone-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? t.dashboard : t.previousStep}</span>
        </button>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1 sm:gap-2 font-bold text-xs">
          <span className={`px-3 py-1 rounded-lg ${step >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
            1. Photo
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-3 py-1 rounded-lg ${step >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
            2. Voice / Notes
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-3 py-1 rounded-lg ${step >= 3 ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
            3. AI Review
          </span>
        </div>

        <button
          onClick={() => isVoiceSpeaking ? stopAudio() : announceStep(step)}
          className={`p-2 rounded-xl border transition ${
            isVoiceSpeaking ? 'bg-rose-600 text-white' : 'bg-stone-100 border-stone-200 text-stone-700'
          }`}
          title="Audio guidance"
        >
          {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* STEP 1: PHOTO UPLOAD */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {t.step1UploadPhoto}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              Take a clear picture of your handmade product.
            </p>
          </div>

          {/* Photo Dropzone or Preview */}
          <div className="mb-6">
            {photoPreview ? (
              <div className="relative rounded-2xl overflow-hidden max-h-96 border border-stone-300 shadow-xs flex items-center justify-center bg-stone-50">
                <img 
                  src={photoPreview} 
                  alt="Craft preview" 
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={() => setPhotoPreview('')}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900 text-white shadow-xs hover:bg-stone-800 transition"
                  title="Change photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-stone-800 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-stone-50/50 transition"
              >
                <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-stone-900 mb-0.5">
                  {t.takeOrUploadPhoto}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Tap to use Camera or choose from Photos
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Preset Sample Crafts for Instant Demo */}
          <div className="mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Or Choose a Sample Mastercraft for Quick Demo:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_CRAFT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-left hover:border-stone-800 transition group"
                >
                  <img 
                    src={preset.image} 
                    alt={preset.title} 
                    className="w-full h-16 object-cover rounded-lg mb-1.5"
                  />
                  <div className="text-xs font-bold truncate text-stone-900">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-amber-800 font-semibold uppercase">
                    {preset.category}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              {t.craftCategory}
            </label>
            <select
              value={craftCategory}
              onChange={(e) => setCraftCategory(e.target.value as CraftCategory)}
              className="w-full p-3 rounded-xl border border-stone-300 bg-white font-medium text-sm sm:text-base outline-none focus:border-stone-900"
            >
              <option value="baskets">{t.baskets} (Bamboo & Cane)</option>
              <option value="textiles">{t.textiles} (Handloom, Silk, Khadi)</option>
              <option value="pottery">{t.pottery} (Ceramics & Clay)</option>
              <option value="terracotta">{t.terracotta} (Clay & Tiles)</option>
              <option value="woodcraft">{t.woodcraft} (Carved Wood)</option>
              <option value="toys">{t.toys} (Kondapalli, Channapatna)</option>
              <option value="embroidery">{t.embroidery} (Sozni, Kantha, Phulkari)</option>
              <option value="jewellery">{t.jewellery} (Dokra, Tribal, Silver)</option>
              <option value="paintings">{t.paintings} (Madhubani, Pattachitra, Warli)</option>
              <option value="metalcraft">{t.metalcraft} (Bronze, Bell Metal, Brass)</option>
            </select>
          </div>

          {/* Next Button */}
          <button
            id="wizard-step1-next-btn"
            disabled={!photoPreview}
            onClick={() => {
              setStep(2);
              announceStep(2);
            }}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xs"
          >
            <span>{t.nextStep}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: VOICE DESCRIPTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {t.step2VoiceDescription}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
              {t.speakInMotherTongue} (Gemini AI will translate for world buyers).
            </p>
          </div>

          {/* Giant Microphone Button */}
          <div className="flex flex-col items-center justify-center my-6">
            <button
              id="wizard-mic-record-btn"
              onClick={toggleSpeechRecognition}
              className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-xs ${
                isListening
                  ? 'bg-rose-600 animate-pulse ring-4 ring-rose-200'
                  : 'bg-emerald-800 hover:bg-emerald-900 active:scale-95'
              }`}
              title={isListening ? 'Stop Recording' : 'Press to Speak'}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <div className="mt-3 text-center">
              <span className={`text-sm font-bold ${isListening ? 'text-rose-600' : 'text-stone-800'}`}>
                {isListening ? 'Listening in your spoken language...' : 'Tap the Microphone & Start Speaking'}
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                Say what materials you used, what it does, or how you made it.
              </p>
            </div>
          </div>

          {/* Voice Transcript / Text Area */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Your Words (Spoken or Typed):
            </label>
            <textarea
              rows={4}
              value={voiceNotes}
              onChange={(e) => setVoiceNotes(e.target.value)}
              placeholder="e.g. ಕೈಯಿಂದ ಸೀಳಿದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಹೆಣೆದ ಗಟ್ಟಿ ಬುಟ್ಟಿ..."
              className="w-full p-3.5 rounded-xl border border-stone-300 bg-white font-medium text-sm sm:text-base outline-none focus:border-stone-900"
            />
          </div>

          {/* Quick Voice Suggestions */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setVoiceNotes('ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಹೆಣೆದ ಪರಿಸರ ಸ್ನೇಹಿ ಗೃಹೋಪಯೋಗಿ ಬುಟ್ಟಿ. ಯಾವುದೇ ಪ್ಲಾಸ್ಟಿಕ್ ಇಲ್ಲ.')}
              className="px-3 py-1 rounded-lg bg-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              + "Kannada: ನೈಸರ್ಗಿಕ ಬಿದಿರು ಬುಟ್ಟಿ..."
            </button>
            <button
              onClick={() => setVoiceNotes('हाथ से कातान सिल्क पर तैयार की गई बनारसी साड़ी। शुद्ध रेशम और ज़री का काम।')}
              className="px-3 py-1 rounded-lg bg-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              + "Hindi: शुद्ध कातान सिल्क साड़ी..."
            </button>
            <button
              onClick={() => setVoiceNotes('సహజమైన చెక్కతో చేతితో చెక్కిన సాంప్రదాయ కొండపల్లి బొమ్మ. పిల్లలకు సురక్షితం.')}
              className="px-3 py-1 rounded-lg bg-stone-100 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              + "Telugu: కొండపల్లి చెక్క బొమ్మ..."
            </button>
          </div>

          {/* AI Generate Button */}
          <button
            id="wizard-generate-listing-btn"
            disabled={isGenerating}
            onClick={handleGenerateListing}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xs"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
                <span>Gemini AI is creating your global listing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.generateListingWithAi}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: AI REVIEW & MULTILINGUAL TRANSLATION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>AI Listing Generated</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {t.step3AiReview}
              </h2>
            </div>
            
            <button
              onClick={() => speak(`${finalTitle}. ${finalDescription}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm hover:bg-stone-200 transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Aloud</span>
            </button>
          </div>

          {/* Product Title Field */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Product Title:
            </label>
            <input
              type="text"
              value={finalTitle}
              onChange={(e) => setFinalTitle(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 bg-white font-bold text-base outline-none focus:border-stone-900"
            />
          </div>

          {/* Product Description */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Description in your language:
            </label>
            <textarea
              rows={3}
              value={finalDescription}
              onChange={(e) => setFinalDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-300 bg-white font-medium text-sm outline-none focus:border-stone-900"
            />
          </div>

          {/* Multilingual Translation Switcher & Preview */}
          <div className="mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-stone-700" />
                <span>{t.translateForBuyers} (Instant Preview)</span>
              </h4>
              <span className="text-xs font-medium text-stone-500">
                Auto-translated for global buyers
              </span>
            </div>

            {/* Language preview pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['en', 'hi', 'kn', 'ta', 'te', 'fr', 'es'].map((langKey) => (
                <button
                  key={langKey}
                  onClick={() => setSelectedPreviewLang(langKey)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    selectedPreviewLang === langKey
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {langKey.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-white border border-stone-200 text-sm">
              <div className="font-bold text-stone-900 mb-1">
                {generatedListing?.translations?.[selectedPreviewLang]?.title || finalTitle}
              </div>
              <div className="text-stone-600 text-xs sm:text-sm">
                {generatedListing?.translations?.[selectedPreviewLang]?.description || finalDescription}
              </div>
            </div>
          </div>

          {/* Materials & Care */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                {t.materialsUsed}:
              </label>
              <input
                type="text"
                value={finalMaterials.join(', ')}
                onChange={(e) => setFinalMaterials(e.target.value.split(',').map(s => s.trim()))}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                {t.dimensions}:
              </label>
              <input
                type="text"
                value={finalDimensions}
                onChange={(e) => setFinalDimensions(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-medium"
              />
            </div>
          </div>

          {/* Pricing & Fair Recommendation */}
          <div className="mb-8 p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-sm sm:text-base">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  <span>{t.smartPricingTitle}</span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Calculated fair price based on raw materials and skilled craft hours.
                </p>
                {generatedListing?.suggestedPriceMin && (
                  <div className="mt-1 text-xs font-bold text-emerald-800">
                    Recommended Range: ₹{generatedListing.suggestedPriceMin} – ₹{generatedListing.suggestedPriceMax}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700 text-xs sm:text-sm">Your Price (₹):</span>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(Number(e.target.value))}
                  className="w-28 p-2 rounded-xl border border-emerald-600 bg-white font-extrabold text-lg text-center outline-none"
                />
              </div>
            </div>
          </div>

          {/* Publish Button */}
          <button
            id="wizard-publish-product-btn"
            onClick={handlePublishProduct}
            className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-xs active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>Publish to Global Marketplace</span>
          </button>
        </div>
      )}

      {/* STEP 4: CELEBRATION / SUCCESS */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Your Craft is Live
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-600 mb-6 max-w-md mx-auto">
            Buyers across India and worldwide can now discover, read, and order your handmade creation.
          </p>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-stone-50 border border-stone-200 mb-8 text-left flex items-center gap-4">
            <img 
              src={photoPreview || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80'} 
              alt="Craft" 
              className="w-16 h-16 object-cover rounded-lg shrink-0"
            />
            <div>
              <div className="font-bold text-sm text-stone-900 line-clamp-1">{finalTitle}</div>
              <div className="text-[11px] text-stone-500 font-semibold uppercase">{craftCategory}</div>
              <div className="text-base font-extrabold text-stone-900 mt-0.5">₹{finalPrice}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('seller-dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-xs transition"
            >
              Go to My Products
            </button>
            <button
              onClick={() => {
                setStep(1);
                setPhotoPreview('');
                setVoiceNotes('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white font-bold text-xs sm:text-sm hover:bg-stone-50 text-stone-800 transition"
            >
              + Upload Another Craft
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
