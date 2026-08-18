import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  MapPin,
  Bot,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, PrimaryLanguageCode } from '../i18n/translations';
import { getProductTranslation } from '../utils/translateHelper';

export const WelcomeLanding: React.FC = () => {
  const {
    language,
    setLanguage,
    setRole,
    setActiveView,
    t,
    products,
    formatPrice,
    addToCart
  } = useApp();

  const handleLanguageSelect = (code: PrimaryLanguageCode) => {
    setLanguage(code);
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <div id="welcome-landing-screen" className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      
      {/* Hero Section with Authentic Photographic Backdrop */}
      <div className="relative rounded-3xl overflow-hidden mb-12 border border-stone-200 bg-stone-900 text-white shadow-md">
        {/* Authentic Background Workshop Image with Subtle Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/60" />

        <div className="relative z-10 p-8 sm:p-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.directFromArtisans || 'Direct from Certified Rural Indian Artisans'}</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {t.handmadeHeritage || t.heroMission || 'Handmade Heritage, Directly Connected to the World.'}
          </h1>
          
          <p className="text-sm sm:text-base text-stone-300 mt-4 leading-relaxed max-w-2xl mx-auto font-normal">
            {t.heroSub || t.tagline || 'CraftBridge connects generational artisans with conscious buyers globally.'}
          </p>

          {/* Language selector chip row */}
          <div className="mt-8 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-stone-300 mr-1">{t.chooseLanguage || 'Language'}:</span>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  language === lang.code
                    ? 'bg-amber-400 text-stone-950 shadow-sm ring-2 ring-amber-300/50'
                    : 'bg-stone-800/80 text-stone-200 hover:bg-stone-700 border border-stone-700'
                }`}
              >
                <span className="text-[10px] font-mono opacity-75">{lang.badge}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2 Clear Portals: Buyer & Artisan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        
        {/* BUYER PORTAL */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-stone-400 hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              {t.forBuyersAndCollectors || 'For Buyers & Collectors'}
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              {t.exploreHandcrafted || t.iAmBuyer || 'Explore Handcrafted Crafts'}
            </h2>
            
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed font-normal">
              {t.buyerPortalDesc || t.iAmBuyerSub || 'Discover authentic handmade textiles, pottery, woodcraft, and baskets directly from verified workshops.'}
            </p>

            <ul className="space-y-2.5 text-xs text-stone-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.craftVerified || '100% genuine mastercrafts direct from artisan hands'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.verifyCraft || 'Certified handmade heritage badge on every craft'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.suggestedPriceRange || 'Transparent fair pricing with zero middleman markup'}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                setRole('buyer');
                setActiveView('buyer-marketplace');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-98"
            >
              <span>{t.exploreMarketplace || t.exploreCrafts || 'Explore Marketplace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveView('artisan-directory');
              }}
              className="py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm transition"
            >
              {t.meetArtisans || 'Meet Artisans'}
            </button>
          </div>
        </div>

        {/* ARTISAN PORTAL */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-stone-400 hover:shadow-xs transition flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center mb-4">
              <Plus className="w-5 h-5" />
            </div>
            
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 mb-1">
              {t.forArtisansAndCrafters || 'For Artisans & Crafters'}
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              {t.artisanSellingTitle || t.iAmSeller || 'Artisan Studio & Selling'}
            </h2>
            
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed font-normal">
              {t.artisanPortalDesc || t.iAmSellerSub || 'List your handmade items simply by speaking in your mother tongue. AI generates titles, descriptions, and calculates fair living prices.'}
            </p>

            <ul className="space-y-2.5 text-xs text-stone-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.speakInMotherTongue || 'Voice-guided listing in your mother tongue'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.helpChoosePrice || 'Smart fair wage calculator based on hours and materials'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>{t.myOrders || 'Manage orders and payments in simple, accessible views'}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-stone-100">
            <button
              onClick={() => {
                setRole('seller');
                setActiveView('product-upload');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-98"
            >
              <span>{t.addProduct || 'List a Craft (AI Wizard)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setRole('seller');
                setActiveView('seller-dashboard');
              }}
              className="py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm transition"
            >
              {t.dashboard || 'Artisan Dashboard'}
            </button>
          </div>
        </div>

      </div>

      {/* Featured Live Crafts Preview */}
      <div className="mb-14">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              {t.featuredHandcrafted || 'Featured Handcrafted Treasures'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              {t.directFromGenerational || 'Direct from generational crafters in Karnataka, Varanasi, and Jaipur'}
            </p>
          </div>

          <button
            onClick={() => {
              setRole('buyer');
              setActiveView('buyer-marketplace');
            }}
            className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-1"
          >
            <span>{t.viewAll || 'View All'} ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const translated = getProductTranslation(product, language);

            return (
              <div
                key={product.id}
                onClick={() => {
                  setRole('buyer');
                  setActiveView('buyer-marketplace');
                }}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-400 hover:shadow-xs transition flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={translated.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/80 text-white text-[10px] font-bold capitalize">
                      {product.category}
                    </div>
                    {product.verification?.isVerified && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t.craftVerified || 'Verified'}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                      <MapPin className="w-3 h-3 text-amber-800" />
                      <span>{product.sellerRegion}</span>
                      <span>•</span>
                      <span className="font-semibold text-stone-700">{product.sellerName}</span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 line-clamp-1 mb-1 group-hover:text-amber-900">
                      {translated.title}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {translated.description}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase">{t.fairPrice || 'Fair Price'}</div>
                    <div className="text-base font-bold text-stone-900">{formatPrice(product.price)}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition active:scale-98"
                  >
                    {t.addToCart || 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Pillars */}
      <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">{t.directFromArtisans || '100% Direct from Artisans'}</h4>
            <p className="text-xs text-stone-500 mt-0.5">Every rupee directly supports the traditional master crafters and their families.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">{t.voiceAssistant || 'Voice-Powered AI'}</h4>
            <p className="text-xs text-stone-500 mt-0.5">List, translate, and search in Indian regional languages with no typing required.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-stone-800" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900">{t.verifyCraft || 'Certified Heritage Lineage'}</h4>
            <p className="text-xs text-stone-500 mt-0.5">Authenticity certificates ensuring verified materials, technique, and GI provenance.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

