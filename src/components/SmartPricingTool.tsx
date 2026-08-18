import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Clock, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AiPricingResponse } from '../types';

export const SmartPricingTool: React.FC = () => {
  const {
    language,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    setActiveView,
    accessibility
  } = useApp();

  const [materialCost, setMaterialCost] = useState<number>(350);
  const [hoursSpent, setHoursSpent] = useState<number>(6);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
  const [isOneOfAKind, setIsOneOfAKind] = useState<boolean>(true);
  const [isHeritageCraft, setIsHeritageCraft] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [pricingResult, setPricingResult] = useState<AiPricingResponse | null>(null);

  const fetchPricing = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/ai/smart-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialCost,
          hoursSpent,
          size,
          isOneOfAKind,
          isHeritageCraft,
          language,
        }),
      });
      const data = await res.json();
      if (data.success && data.pricing) {
        setPricingResult(data.pricing);
      }
    } catch (e) {
      console.warn('Smart pricing fallback:', e);
      const labor = hoursSpent * 120;
      const base = Math.round((materialCost + labor) * 1.3 / 50) * 50;
      setPricingResult({
        fairPrice: base,
        minPrice: Math.round(base * 0.88),
        maxPrice: Math.round(base * 1.2),
        explanation: `Based on your material cost of ₹${materialCost} and ${hoursSpent} hours of work, a fair selling price is ₹${Math.round(base * 0.88)} – ₹${Math.round(base * 1.2)}.`,
        breakdownSummary: [
          `Raw materials: ₹${materialCost}`,
          `Artisan skilled labor: ${hoursSpent} hours`,
          `Living wage included`
        ]
      });
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [materialCost, hoursSpent, size, isOneOfAKind, isHeritageCraft, language]);

  const handleAudioExplain = () => {
    if (isVoiceSpeaking) {
      stopAudio();
    } else {
      const text = pricingResult 
        ? `${t.smartPricingTitle}. Recommended fair price is ₹${pricingResult.fairPrice}. ${pricingResult.explanation}` 
        : `${t.helpChoosePrice}`;
      speak(text);
    }
  };

  return (
    <div id="smart-pricing-tool-screen" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setActiveView('seller-dashboard')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 font-bold text-xs sm:text-sm hover:bg-stone-200 text-stone-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.dashboard}</span>
        </button>

        <button
          onClick={handleAudioExplain}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition shadow-xs ${
            isVoiceSpeaking 
              ? 'bg-rose-600 text-white' 
              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
          }`}
        >
          {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isVoiceSpeaking ? t.stopListening : 'Listen to Pricing Advice'}</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
          <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
          <span>Fair Artisan Wages Guaranteed</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          {t.smartPricingTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-1 font-medium">
          {t.helpChoosePrice} — Answer 5 simple questions to get your recommended price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: 5 Questions */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          
          {/* Question 1: Material Cost */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. Raw Material Cost (₹)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="50"
                step="50"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-28 p-2.5 rounded-xl border border-stone-300 bg-white font-extrabold text-lg text-center outline-none focus:border-stone-900"
              />
              <div className="flex flex-wrap gap-1.5">
                {[150, 350, 700, 1500].map(val => (
                  <button
                    key={val}
                    onClick={() => setMaterialCost(val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                      materialCost === val ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 2: Hours Spent */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. Crafting Hours
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="200"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(Number(e.target.value))}
                className="w-24 p-2.5 rounded-xl border border-stone-300 bg-white font-extrabold text-lg text-center outline-none focus:border-stone-900"
              />
              <span className="text-xs font-bold text-stone-500">Hours</span>
              <div className="flex flex-wrap gap-1.5">
                {[2, 6, 12, 24].map(h => (
                  <button
                    key={h}
                    onClick={() => setHoursSpent(h)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                      hoursSpent === h ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {h} hrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question 3: Size */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              3. Physical Size of Craft
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['small', 'medium', 'large', 'extra-large'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs sm:text-sm capitalize transition ${
                    size === s ? 'bg-stone-900 text-white border-stone-900 shadow-xs' : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: One of a kind? */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <div className="font-bold text-xs sm:text-sm text-stone-900">
                4. Unique One-of-a-Kind Piece?
              </div>
              <div className="text-[11px] text-stone-500">Not mass produced in batches</div>
            </div>
            <button
              onClick={() => setIsOneOfAKind(!isOneOfAKind)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                isOneOfAKind ? 'bg-stone-900 text-white' : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              {isOneOfAKind ? 'Yes ✓' : 'No'}
            </button>
          </div>

          {/* Question 5: Heritage Craft? */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <div className="font-bold text-xs sm:text-sm text-stone-900">
                5. Traditional Heritage Lineage?
              </div>
              <div className="text-[11px] text-stone-500">Generational technique / GI tagged</div>
            </div>
            <button
              onClick={() => setIsHeritageCraft(!isHeritageCraft)}
              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition ${
                isHeritageCraft ? 'bg-amber-800 text-white' : 'bg-white border border-stone-300 text-stone-700'
              }`}
            >
              {isHeritageCraft ? 'Yes ✓' : 'No'}
            </button>
          </div>

        </div>

        {/* Right Column: AI Calculated Fair Recommendation */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wide">
                AI Suggested Price
              </span>
              {isCalculating && (
                <span className="text-xs font-bold text-emerald-800 animate-pulse">
                  Updating...
                </span>
              )}
            </div>

            {/* Big Fair Price Display */}
            <div className="my-6 text-center">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-widest mb-1">
                Fair Suggested Price
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-stone-900">
                ₹{pricingResult?.fairPrice?.toLocaleString() || 1100}
              </div>
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                Fair Selling Range: ₹{pricingResult?.minPrice?.toLocaleString() || 950} – ₹{pricingResult?.maxPrice?.toLocaleString() || 1250}
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-xl bg-white border border-emerald-200/80 mb-6">
              <div className="font-bold text-xs text-stone-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Why this price is fair:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {pricingResult?.explanation || 'Ensures fair compensation for all materials and master artisan time.'}
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm font-semibold text-stone-700 mb-6">
              <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                <span>Raw Materials Cost:</span>
                <span className="font-bold text-stone-900">₹{materialCost}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                <span>Artisan Labor ({hoursSpent} hrs @ ₹120/hr):</span>
                <span className="font-bold text-stone-900">₹{hoursSpent * 120}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-200/60">
                <span>Heritage & Uniqueness Margin:</span>
                <span className="font-bold text-emerald-800">Included ✓</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveView('product-upload');
            }}
            className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition shadow-xs"
          >
            Use this Price in Product Listing →
          </button>
        </div>

      </div>

    </div>
  );
};
