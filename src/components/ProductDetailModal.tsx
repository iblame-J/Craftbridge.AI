import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ShoppingCart, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { CraftAuthenticationModal } from './CraftAuthenticationModal';
import { ArtisanStoryModal } from './ArtisanStoryModal';
import { getProductTranslation } from '../utils/translateHelper';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const {
    language,
    t,
    addToCart,
    speak,
    stopAudio,
    isVoiceSpeaking,
    formatPrice,
    artisans,
    setSelectedArtisan
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [activeLangTab, setActiveLangTab] = useState<string>(language);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);

  useEffect(() => {
    setActiveLangTab(language);
  }, [language]);

  const artisan = artisans.find(a => a.id === product.sellerId || a.name === product.sellerName) || artisans[0];

  const translated = getProductTranslation(product, activeLangTab as any);
  const currentTitle = translated.title;
  const currentDesc = translated.description;
  const currentHighlights = translated.highlights && translated.highlights.length > 0 ? translated.highlights : (product.highlights || []);
  const currentMaterials = product.materials && product.materials.length > 0 ? product.materials : ['Natural Materials'];

  const handleReadAloud = () => {
    if (isVoiceSpeaking) {
      stopAudio();
    } else {
      speak(`${currentTitle}. Made by ${product.sellerName} from ${product.sellerRegion}. ${currentDesc}. Price: ${formatPrice(product.price)}.`);
    }
  };

  return (
    <div 
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div 
        id="product-detail-modal-content"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 sm:p-7 bg-white text-stone-900 border border-stone-200 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition z-10"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Photos & Verification Badge */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 h-80 sm:h-96 relative">
              <img 
                src={product.images[selectedPhotoIdx] || product.images[0]} 
                alt={currentTitle} 
                className="w-full h-full object-cover"
              />
              {product.verification?.isVerified && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.craftVerified || 'Craft Verified Lineage'}</span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher if multiple photos */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      selectedPhotoIdx === idx ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Artisan Profile Box */}
            <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={artisan.photoUrl} 
                  alt={artisan.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0"
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{t.masterArtisan || 'Master Artisan'}</div>
                  <div className="font-bold text-sm sm:text-base text-stone-900">{artisan.name}</div>
                  <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{artisan.region}, {artisan.state}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    setSelectedArtisan(artisan);
                    setShowStoryModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-100 transition shadow-2xs"
                >
                  {t.readStory || 'Read Story'}
                </button>
                <button
                  onClick={() => {
                    setSelectedArtisan(artisan);
                    setShowAuthModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs hover:bg-emerald-100 transition"
                >
                  {t.verifyOrigin || 'Verify Origin'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Translation Tabs, Highlights, Buy */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Audio Listen */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {product.category}
                </span>

                <button
                  onClick={handleReadAloud}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                    isVoiceSpeaking 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isVoiceSpeaking ? t.stopListening : (t.listen || 'Read Aloud')}</span>
                </button>
              </div>

              <h1 id="product-detail-title" className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2 leading-tight">
                {currentTitle}
              </h1>

              {/* Language Switcher for Description */}
              <div className="my-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-stone-600">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.translateForBuyers || 'Language translation'}:</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLangTab(lang.code)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                        activeLangTab === lang.code ? 'bg-stone-900 text-white shadow-2xs' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 font-normal">
                {currentDesc}
              </p>

              {/* Key Highlights */}
              {currentHighlights.length > 0 && (
                <div className="mb-4 space-y-1">
                  <div className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">
                    {t.highlights || 'Highlights'}:
                  </div>
                  {currentHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Materials & Care */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs mb-4 font-medium">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">{t.materialsUsed || 'Materials'}:</span>
                  <span className="text-stone-800 font-semibold">{currentMaterials.join(', ')}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">{t.dimensions || 'Dimensions'}:</span>
                  <span className="text-stone-800 font-semibold">{product.dimensions || 'Handmade Standard'}</span>
                </div>
              </div>
            </div>

            {/* Price & Checkout Controls */}
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{t.fairPrice || 'Direct Fair Price'}:</div>
                  <div className="font-serif text-2xl font-bold text-stone-900">
                    {formatPrice(product.price * quantity)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">{t.quantity || 'Qty'}:</span>
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 font-bold hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-2.5 font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 font-bold hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  id="detail-add-to-cart-btn"
                  onClick={() => {
                    addToCart(product, quantity);
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {showAuthModal && (
        <CraftAuthenticationModal 
          artisan={artisan} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}

      {showStoryModal && (
        <ArtisanStoryModal 
          onClose={() => setShowStoryModal(false)} 
        />
      )}
    </div>
  );
};
