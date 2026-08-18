import React from 'react';
import { 
  PlusCircle, 
  Package, 
  DollarSign, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EasyModeSeller: React.FC = () => {
  const {
    t,
    setActiveView,
    speak,
    stopAudio,
    isVoiceSpeaking,
    products,
    accessibility,
    setIsVoiceAssistantOpen
  } = useApp();

  return (
    <div id="easy-mode-seller-screen" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Banner with Big Audio Help */}
      <div className="mb-6 p-6 rounded-2xl bg-stone-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.easyMode} Active</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {t.artisanDashboard}
          </h1>
          <p className="text-sm text-stone-300 mt-1 font-medium">
            Choose what you want to do:
          </p>
        </div>

        <button
          onClick={() => {
            isVoiceSpeaking 
              ? stopAudio() 
              : speak('Easy mode active. Button 1: Add a product. Button 2: See your products. Button 3: Choose fair price. Button 4: Talk to voice assistant.');
          }}
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-xs transition active:scale-95"
        >
          {isVoiceSpeaking ? <VolumeX className="w-5 h-5 text-rose-700" /> : <Volume2 className="w-5 h-5" />}
          <span>{isVoiceSpeaking ? t.stopListening : 'Read Options Aloud'}</span>
        </button>
      </div>

      {/* 4 Accessible Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CARD 1: ADD PRODUCT */}
        <button
          id="easy-card-add-product"
          onClick={() => setActiveView('product-upload')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
              <PlusCircle className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">01</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.addProduct}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              Take a photo & speak to create a global listing.
            </p>
          </div>
        </button>

        {/* CARD 2: MY PRODUCTS */}
        <button
          id="easy-card-my-products"
          onClick={() => setActiveView('seller-dashboard')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
              <Package className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">02</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.myProducts}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              View your {products.length} live products and stock.
            </p>
          </div>
        </button>

        {/* CARD 3: SMART PRICING */}
        <button
          id="easy-card-smart-pricing"
          onClick={() => setActiveView('smart-pricing')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center border border-stone-300">
              <DollarSign className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">03</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.helpChoosePrice}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              AI calculates fair selling price respecting your time.
            </p>
          </div>
        </button>

        {/* CARD 4: VOICE ASSISTANT */}
        <button
          id="easy-card-voice-help"
          onClick={() => setIsVoiceAssistantOpen(true)}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center border border-purple-300">
              <HelpCircle className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">04</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.needHelp}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              Talk directly with CraftBridge Voice Assistant.
            </p>
          </div>
        </button>

      </div>

    </div>
  );
};
