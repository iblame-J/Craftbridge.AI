import React from 'react';
import { 
  Bot, 
  ShoppingCart, 
  Globe,
  SlidersHorizontal,
  Sparkles,
  User,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    currentUser,
    logoutUser,
    accessibility,
    activeView,
    setActiveView,
    t,
    cart,
    setIsVoiceAssistantOpen,
    setIsAccessibilityModalOpen
  } = useApp();

  return (
    <header 
      id="main-app-header"
      className={`sticky top-0 z-40 w-full transition-colors border-b ${
        accessibility.highContrast 
          ? 'bg-black text-white border-yellow-400' 
          : 'bg-white/95 backdrop-blur-md text-stone-900 border-stone-200 shadow-2xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            id="header-home-btn"
            onClick={() => setActiveView('welcome')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Go to homepage"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif font-black text-base tracking-tight transition-transform group-hover:scale-105 ${
              accessibility.highContrast 
                ? 'bg-yellow-400 text-black' 
                : 'bg-stone-900 text-white'
            }`}>
              CB
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 tracking-tight leading-none">
                CraftBridge
              </span>
              <span className="text-[11px] text-stone-500 font-medium block">
                Handmade Heritage
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setRole('buyer');
                setActiveView('buyer-marketplace');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeView === 'buyer-marketplace' || activeView === 'easy-buyer'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.marketplace || t.exploreCrafts || 'Marketplace'}
            </button>

            <button
              onClick={() => setActiveView('artisan-directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeView === 'artisan-directory'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.artisanStories || 'Artisan Stories'}
            </button>

            <button
              onClick={() => {
                setRole('seller');
                setActiveView('seller-dashboard');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeView === 'seller-dashboard' || activeView === 'easy-seller'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.artisanStudio || t.dashboard || 'Artisan Studio'}
            </button>

            <button
              onClick={() => setActiveView('smart-pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeView === 'smart-pricing'
                  ? 'bg-stone-100 text-stone-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {t.fairPricing || t.myPrices || 'Fair Pricing'}
            </button>
          </nav>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector */}
          <div className="relative inline-flex items-center">
            <label htmlFor="header-language-select" className="sr-only">Language</label>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs font-medium text-stone-800 hover:bg-white transition">
              <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" aria-hidden="true" />
              <select
                id="header-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent font-medium outline-none cursor-pointer pr-1 text-xs"
                aria-label="Choose language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-zinc-900 bg-white">
                    [{lang.badge}] {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice AI Assistant */}
          <button
            id="header-voice-assistant-btn"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-2xs transition active:scale-98"
            aria-label={t.voiceAssistant || 'Voice Assistant'}
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">{t.voiceAssistant || 'Voice Assistant'}</span>
          </button>

          {/* Sell Craft Direct Action */}
          <button
            id="header-upload-craft-btn"
            onClick={() => {
              setRole('seller');
              setActiveView('product-upload');
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-2xs transition active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.listCraft || t.addProduct || 'List Craft'}</span>
          </button>

          {/* Cart button */}
          <button
            id="header-cart-btn"
            onClick={() => setActiveView('cart')}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition ${
              cart.length > 0
                ? 'border-stone-900 bg-stone-100 text-stone-900'
                : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
            }`}
            aria-label={`Cart with ${cart.reduce((acc, i) => acc + i.quantity, 0)} items`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">{t.myCart || 'Cart'}</span>
            {cart.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-800 text-white">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* User Account / Login State */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-stone-200">
              <button
                onClick={() => setActiveView('login')}
                className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-stone-100 text-stone-900 transition"
                title="Account Settings"
              >
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover border border-stone-300"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold hidden md:inline truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              <button
                onClick={logoutUser}
                className="text-[11px] font-bold text-stone-400 hover:text-rose-600 transition px-1"
                title="Sign Out"
              >
                {t.exit || 'Exit'}
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => setActiveView('login')}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs transition"
            >
              {t.signIn || 'Sign In'}
            </button>
          )}

          {/* Quick Accessibility settings */}
          <button
            id="header-accessibility-btn"
            onClick={() => setIsAccessibilityModalOpen(true)}
            className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-600 transition"
            title="Accessibility Settings"
            aria-label="Open accessibility options"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
