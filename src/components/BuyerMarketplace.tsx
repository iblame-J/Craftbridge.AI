import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Mic, 
  MicOff, 
  Volume2, 
  ShoppingCart, 
  CheckCircle, 
  Sparkles, 
  MapPin,
  DollarSign,
  Layers,
  ShoppingBag,
  Scissors,
  Flame,
  Smile,
  Hammer,
  Gem
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import { startSpeechRecognition } from '../utils/speech';
import { getProductTranslation } from '../utils/translateHelper';

export const BuyerMarketplace: React.FC = () => {
  const {
    language,
    t,
    products,
    addToCart,
    speak,
    stopAudio,
    isVoiceSpeaking,
    currency,
    setCurrency,
    formatPrice,
    setActiveView
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Voice Search
  const toggleVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      stopAudio();
      setIsListening(true);
      startSpeechRecognition(language, {
        onStart: () => setIsListening(true),
        onResult: (transcript, isFinal) => {
          setSearchQuery(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  // Filtered Products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'all' && !p.sellerRegion.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }
      // Verified only
      if (verifiedOnly && !p.verification?.isVerified) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const tr = getProductTranslation(p, language);
        const titleMatches = p.title.toLowerCase().includes(q) || tr.title.toLowerCase().includes(q);
        const descMatches = p.description.toLowerCase().includes(q) || tr.description.toLowerCase().includes(q);
        const sellerMatches = p.sellerName.toLowerCase().includes(q);
        const tagMatches = p.tags.some(t => t.toLowerCase().includes(q));
        return titleMatches || descMatches || sellerMatches || tagMatches;
      }
      return true;
    });
  }, [products, selectedCategory, selectedRegion, verifiedOnly, searchQuery, language]);

  const categories: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: t.allCrafts || 'All Crafts', icon: <Layers className="w-3.5 h-3.5" /> },
    { key: 'baskets', label: t.baskets || 'Baskets', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { key: 'textiles', label: t.textiles || 'Textiles', icon: <Scissors className="w-3.5 h-3.5" /> },
    { key: 'pottery', label: t.pottery || 'Pottery', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'toys', label: t.toys || 'Toys', icon: <Smile className="w-3.5 h-3.5" /> },
    { key: 'embroidery', label: t.embroidery || 'Embroidery', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: 'woodcraft', label: t.woodcraft || 'Woodcraft', icon: <Hammer className="w-3.5 h-3.5" /> },
    { key: 'jewellery', label: t.jewellery || 'Jewellery', icon: <Gem className="w-3.5 h-3.5" /> },
  ];

  return (
    <div id="buyer-marketplace-screen" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Hero Header for Marketplace */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.directFromArtisans || 'Direct from Certified Rural Artisans'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            {t.exploreCrafts || 'Explore Authentic Crafts'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium max-w-2xl">
            {t.directFromGenerational || 'Authentic handmade crafts from Karnataka, Varanasi, Jaipur, Kashmir, Andhra Pradesh, and Kutch.'}
          </p>
        </div>

        {/* Currency Selector & Meet Artisans shortcut */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-semibold shadow-xs">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent outline-none cursor-pointer pr-1 text-stone-800 font-bold"
              aria-label="Select display currency"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <button
            onClick={() => setActiveView('artisan-directory')}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs sm:text-sm border border-stone-300 transition"
          >
            {t.meetArtisans || 'Meet Artisans'}
          </button>
        </div>
      </div>

      {/* Search Bar & Voice Input */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="marketplace-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isListening ? (t.listen || 'Listening...') : (t.searchCrafts || 'Search crafts by name, material, artisan, or region in any language...')}
            className="w-full pl-11 pr-14 py-3 rounded-xl border border-stone-300 bg-white font-medium text-sm sm:text-base outline-none focus:border-stone-900 shadow-xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
            >
              {t.clear || 'Clear'}
            </button>
          )}
        </div>

        <button
          id="marketplace-voice-search-btn"
          onClick={toggleVoiceSearch}
          className={`p-3 rounded-xl transition shadow-xs flex items-center justify-center ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
          title="Voice Search"
          aria-label="Search by voice"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Category Pills */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === cat.key
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Secondary Region & Verified Filters */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">{t.origin || 'Origin'}:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-medium outline-none text-stone-800"
          >
            <option value="all">{t.allRegionsOption || 'All Heritage Regions'}</option>
            <option value="Karnataka">Mysuru, Karnataka</option>
            <option value="Varanasi">Varanasi, UP</option>
            <option value="Jaipur">Jaipur, Rajasthan</option>
            <option value="Andhra">Kondapalli, Andhra</option>
            <option value="Kashmir">Srinagar, Kashmir</option>
            <option value="Gujarat">Kutch, Gujarat</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-stone-300 shadow-xs">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-3.5 h-3.5 accent-emerald-700 rounded cursor-pointer"
          />
          <span className="text-stone-800 font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.showOnlyVerified || 'Show Only Craft Verified'}</span>
          </span>
        </label>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
          <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">{t.noCraftsFound || 'No crafts found'}</h3>
          <p className="text-xs text-stone-500 mt-1">{t.discoverMoreCrafts || 'Try changing your category filter or search keywords.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const translated = getProductTranslation(product, language);
            const displayTitle = translated.title;
            const displayDesc = translated.description;

            return (
              <div
                key={product.id}
                onClick={() => setActiveModalProduct(product)}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:border-stone-400 hover:shadow-md transition flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Photo with badges */}
                  <div className="relative h-52 bg-stone-100 overflow-hidden">
                    <img 
                      src={product.images[0]} 
                      alt={displayTitle} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold capitalize">
                      {product.category}
                    </div>

                    {product.verification?.isVerified && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{t.craftVerified || 'Verified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Artisan info */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-800" />
                      <span>{product.sellerRegion}</span>
                      <span>•</span>
                      <span className="font-semibold text-stone-700">{product.sellerName}</span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 line-clamp-1 mb-1 group-hover:text-amber-900 transition">
                      {displayTitle}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                      {displayDesc}
                    </p>

                    {/* Highlights tags */}
                    {translated.highlights && translated.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {translated.highlights.slice(0, 2).map((hl, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200">
                            ✓ {hl}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Price & Actions */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                      {t.fairPrice || 'Direct Fair Price'}
                    </div>
                    <div className="text-lg font-extrabold text-stone-900">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Audio Reader */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(`${displayTitle}. Crafted in ${product.sellerRegion} by artisan ${product.sellerName}. Price: ${formatPrice(product.price)}. ${displayDesc}`);
                      }}
                      className="p-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition"
                      title="Listen to description"
                      aria-label="Read description aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Add to Cart */}
                    <button
                      id={`buy-btn-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-98 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
        />
      )}

    </div>
  );
};
