import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  PackageCheck, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EasyModeBuyer: React.FC = () => {
  const {
    t,
    setActiveView,
    speak,
    stopAudio,
    isVoiceSpeaking,
    cart,
    accessibility,
    setIsVoiceAssistantOpen
  } = useApp();

  return (
    <div id="easy-mode-buyer-screen" className="max-w-4xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Banner with Big Audio Help */}
      <div className="mb-6 p-6 rounded-2xl bg-stone-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.easyMode} Active</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {t.exploreCrafts}
          </h1>
          <p className="text-sm text-stone-300 mt-1 font-medium">
            Discover handmade treasures directly from Indian artisans:
          </p>
        </div>

        <button
          onClick={() => {
            isVoiceSpeaking 
              ? stopAudio() 
              : speak('Buyer easy mode active. Tap 1 to browse handmade crafts. Tap 2 for your cart. Tap 3 for orders. Tap 4 for voice assistance.');
          }}
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-xs transition active:scale-95"
        >
          {isVoiceSpeaking ? <VolumeX className="w-5 h-5 text-rose-700" /> : <Volume2 className="w-5 h-5" />}
          <span>{isVoiceSpeaking ? t.stopListening : 'Read Options Aloud'}</span>
        </button>
      </div>

      {/* 4 Accessible Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CARD 1: BROWSE CRAFTS */}
        <button
          id="easy-buyer-card-browse"
          onClick={() => setActiveView('buyer-marketplace')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-300">
              <Search className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">01</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.findCraft}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              Browse authentic baskets, pottery, textiles, and wooden toys.
            </p>
          </div>
        </button>

        {/* CARD 2: MY CART */}
        <button
          id="easy-buyer-card-cart"
          onClick={() => setActiveView('cart')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300 relative">
              <ShoppingCart className="w-7 h-7" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-amber-900 text-white font-bold text-[10px]">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">02</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.myCart}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              {cart.length} item(s) in your basket ready for checkout.
            </p>
          </div>
        </button>

        {/* CARD 3: MEET ARTISANS */}
        <button
          id="easy-buyer-card-artisans"
          onClick={() => setActiveView('artisan-directory')}
          className={`p-6 rounded-2xl text-left transition border-2 flex flex-col justify-between min-h-[190px] shadow-xs group hover:border-stone-900 ${
            accessibility.highContrast
              ? 'bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
              : 'bg-white border-stone-200 text-stone-900 hover:bg-stone-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center border border-stone-300">
              <Heart className="w-7 h-7" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-400">03</span>
          </div>

          <div className="mt-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {t.meetArtisans}
            </h2>
            <p className="text-xs sm:text-sm font-normal text-stone-600 mt-1">
              Read stories & see verified workshops from mastercraft regions.
            </p>
          </div>
        </button>

        {/* CARD 4: VOICE ASSISTANT */}
        <button
          id="easy-buyer-card-voice-help"
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
              Speak in any language to search or ask questions.
            </p>
          </div>
        </button>

      </div>

    </div>
  );
};
