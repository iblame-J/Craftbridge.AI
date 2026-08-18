import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  DollarSign, 
  ShieldCheck, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Bot, 
  Trash2, 
  CheckCircle,
  Lightbulb,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CraftAuthenticationModal } from './CraftAuthenticationModal';
import { ArtisanStoryModal } from './ArtisanStoryModal';
import { getProductTranslation, getArtisanTranslation } from '../utils/translateHelper';

export const SellerDashboard: React.FC = () => {
  const {
    language,
    t,
    products,
    artisans,
    orders,
    setActiveView,
    speak,
    stopAudio,
    isVoiceSpeaking,
    setSelectedProduct,
    setSelectedArtisan,
    setIsVoiceAssistantOpen,
    showNotification
  } = useApp();

  const currentArtisan = artisans[0]; // Basavanna Gowda as demo active seller
  const translatedArtisan = getArtisanTranslation(currentArtisan, language);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'tips'>('products');

  const artisanProducts = products.filter(p => p.sellerId === currentArtisan.id || p.sellerName === currentArtisan.name || !p.sellerId);

  const handleDeleteProduct = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    showNotification('Product removed from listing.');
  };

  return (
    <div id="seller-dashboard-screen" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Artisan Greeting & Profile Card with Realistic Workshop Image */}
      <div 
        id="artisan-profile-banner"
        className="relative overflow-hidden mb-8 p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-stone-800"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-900/80" />

        <div className="relative z-10 flex items-center gap-5">
          <img 
            src={currentArtisan.photoUrl} 
            alt={currentArtisan.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/40 shadow-sm shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold mb-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.craftVerified || 'Craft Verified'} • KHDC Registered</span>
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              {currentArtisan.name} <span className="text-stone-400 text-lg font-sans font-normal">({currentArtisan.nativeName})</span>
            </h1>
            <p className="text-sm sm:text-base text-amber-200/90 font-medium mt-0.5">
              {translatedArtisan.generation} • {currentArtisan.region}, {currentArtisan.state}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            id="seller-voice-guide-btn"
            onClick={() => {
              isVoiceSpeaking 
                ? stopAudio() 
                : speak(`Welcome ${currentArtisan.name}. You have ${artisanProducts.length} crafts listed on CraftBridge.`);
            }}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-700 transition"
          >
            {isVoiceSpeaking ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
            <span>{isVoiceSpeaking ? t.stopListening : (t.voiceAssistant || 'Voice Guide')}</span>
          </button>

          <button
            id="seller-quick-upload-btn"
            onClick={() => setActiveView('product-upload')}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addProduct || 'List Craft'}</span>
          </button>
        </div>
      </div>

      {/* 4 Feature Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Action 1: Upload Product */}
        <button
          onClick={() => setActiveView('product-upload')}
          className="p-5 rounded-2xl bg-white border border-stone-200 text-left hover:border-stone-900 hover:shadow-xs transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-900 text-white flex items-center justify-center mb-3 shadow-xs">
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            {t.addProduct || 'List Craft'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.step1UploadPhoto || 'Voice-guided camera listing'}
          </p>
        </button>

        {/* Action 2: Smart Pricing */}
        <button
          onClick={() => setActiveView('smart-pricing')}
          className="p-5 rounded-2xl bg-white border border-stone-200 text-left hover:border-stone-900 hover:shadow-xs transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-3 shadow-xs">
            <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            {t.helpChoosePrice || 'Smart Pricing'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.fairWageCalculation || 'Fair wage calculation'}
          </p>
        </button>

        {/* Action 3: Verify My Craft */}
        <button
          onClick={() => {
            setSelectedArtisan(currentArtisan);
            setShowAuthModal(true);
          }}
          className="p-5 rounded-2xl bg-white border border-stone-200 text-left hover:border-stone-900 hover:shadow-xs transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-stone-800 text-white flex items-center justify-center mb-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            {t.verifyCraft || 'Verify My Craft'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.digitalAuthenticityQr || 'Digital Authenticity & QR'}
          </p>
        </button>

        {/* Action 4: Tell My Story */}
        <button
          onClick={() => {
            setSelectedArtisan(currentArtisan);
            setShowStoryModal(true);
          }}
          className="p-5 rounded-2xl bg-white border border-stone-200 text-left hover:border-stone-900 hover:shadow-xs transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-900 text-white flex items-center justify-center mb-3 shadow-xs">
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900">
            {t.artisanStory || 'Artisan Story'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.aiVoiceBiography || 'AI Voice Biography'}
          </p>
        </button>

      </div>

      {/* Tabs: My Products vs Orders vs Marketing Tips */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 pb-2 font-bold text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'products' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.myProducts || 'My Products'} ({artisanProducts.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'orders' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t.orders || 'Orders'} ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'tips' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>{t.sellerAdviceTips || 'Seller Advice & Tips'}</span>
        </button>
      </div>

      {/* TAB 1: MY PRODUCTS */}
      {activeTab === 'products' && (
        <div>
          {artisanProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <Package className="w-14 h-14 text-stone-300 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-stone-800">{t.noProductsYet || 'No products uploaded yet'}</h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5">Use the AI wizard to upload your first craft in 60 seconds.</p>
              <button
                onClick={() => setActiveView('product-upload')}
                className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm shadow-xs"
              >
                + {t.addFirstProduct || 'Add First Product'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisanProducts.map((prod) => {
                const translatedProd = getProductTranslation(prod, language);
                const titleToDisplay = translatedProd.title;
                const descToDisplay = translatedProd.description;

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        <img 
                          src={prod.images[0]} 
                          alt={titleToDisplay} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold capitalize">
                          {prod.category}
                        </div>
                        {prod.verification?.isVerified && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-800 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>{t.craftVerified || 'Verified'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-base text-stone-900 line-clamp-1 mb-1">
                          {titleToDisplay}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 mb-3">
                          {descToDisplay}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <div>
                            <span className="text-[11px] text-stone-400 font-semibold uppercase">{t.fairPrice || 'Price'}</span>
                            <div className="text-lg font-extrabold text-stone-900">
                              ₹{prod.price.toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => speak(`${titleToDisplay}. Price: ₹${prod.price}. ${descToDisplay}`)}
                            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
                            title="Listen to description"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(prod);
                          setActiveView('buyer-marketplace');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-stone-200 hover:bg-stone-300 font-bold text-xs text-stone-800 transition"
                      >
                        {t.previewAsBuyer || 'Preview as Buyer'}
                      </button>
                      <button
                        onClick={(e) => handleDeleteProduct(prod.id, e)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div 
              key={ord.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {ord.status}
                  </span>
                  <span className="text-xs font-semibold text-stone-400">#{ord.id}</span>
                </div>
                <h4 className="font-bold text-base text-stone-900">
                  Buyer: {ord.buyerName}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Shipping to: {ord.shippingAddress?.addressLine}, {ord.shippingAddress?.city}, {ord.shippingAddress?.country}
                </p>
                <div className="mt-2 text-xs font-bold text-stone-700">
                  Item: {ord.items[0]?.product?.title} (Qty: {ord.items[0]?.quantity})
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="text-xl font-bold text-stone-900">
                  ₹{ord.totalAmount.toLocaleString()}
                </div>
                <span className="text-xs font-semibold text-emerald-700">Paid & Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MARKETING & SELLER TIPS */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-stone-200">
            <div className="w-9 h-9 rounded-lg bg-amber-800 text-white flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">Photography Tip</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Take photos near a sunny window in the morning. Natural soft sunlight highlights the authentic textures of bamboo, terracotta, and handloom silk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">Packaging Advice</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Wrap ceramics and woven items in sustainable craft paper straw. Include the printed QR Authenticity Certificate so international buyers can view your workshop lineage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-stone-200">
            <div className="w-9 h-9 rounded-lg bg-purple-900 text-white flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">Need Help Replying?</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3">
              Ask CraftBridge AI to write polite, culturally nuanced replies in English, French, or Japanese to buyer inquiries.
            </p>
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="text-xs font-bold text-purple-900 hover:underline inline-flex items-center gap-1"
            >
              Ask AI Assistant →
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAuthModal && (
        <CraftAuthenticationModal 
          artisan={currentArtisan} 
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
