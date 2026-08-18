import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Heart,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const CartAndCheckout: React.FC = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    formatPrice,
    setActiveView,
    t,
    speak,
    stopAudio,
    isVoiceSpeaking,
    language,
    showNotification
  } = useApp();

  const [fullName, setFullName] = useState<string>('Priya Sharma');
  const [addressLine, setAddressLine] = useState<string>('42 Indiranagar 100ft Road');
  const [city, setCity] = useState<string>('Bengaluru');
  const [postalCode, setPostalCode] = useState<string>('560038');
  const [country, setCountry] = useState<string>('India');
  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = subtotal > 0 ? (subtotal > 2000 ? 0 : 150) : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsOrdering(true);
    stopAudio();

    const orderPayload = {
      buyerId: 'buyer-user-1',
      buyerName: fullName,
      buyerEmail: 'buyer@example.com',
      sellerId: cart[0]?.product?.sellerId || 'artisan-1',
      sellerName: cart[0]?.product?.sellerName || 'Basavanna Gowda',
      items: cart.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedLanguageTitle: item.product.translations?.[language]?.title || item.product.title,
        priceAtPurchase: item.product.price,
      })),
      totalAmount: total,
      currency: 'INR',
      shippingAddress: {
        fullName,
        addressLine,
        city,
        postalCode,
        country,
      },
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
    } catch {
      // ignore
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsOrdering(false);
    setOrderComplete(true);
    clearCart();
    speak('Thank you! Your handmade craft order is placed. The artisan has been notified to pack your order.');
  };

  if (orderComplete) {
    return (
      <div id="order-complete-screen" className="max-w-2xl mx-auto py-12 px-4 text-center font-sans">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          {t.orderPlacedSuccess}
        </h1>
        <p className="text-sm font-semibold text-emerald-800 mb-6">
          {t.artisanWillPack}
        </p>

        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-left mb-8 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>{t.directArtisanImpact || 'Direct Artisan Impact'}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            100% of your product payment goes directly to the mastercraft artisan's rural banking account. Your parcel will include a signed Craft Authenticity Certificate with a verified QR code.
          </p>
          <div className="pt-2 text-xs font-semibold text-stone-500 border-t border-stone-200/60">
            Delivering to: <span className="text-stone-800">{fullName}, {addressLine}, {city} - {postalCode}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setOrderComplete(false);
            setActiveView('buyer-marketplace');
          }}
          className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-xs transition"
        >
          {t.continueExploring || 'Continue Exploring Crafts'}
        </button>
      </div>
    );
  }

  return (
    <div id="cart-checkout-screen" className="max-w-5xl mx-auto py-8 px-4 sm:px-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setActiveView('buyer-marketplace')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 font-bold text-xs sm:text-sm hover:bg-stone-200 text-stone-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.exploreCrafts || 'Continue Shopping'}</span>
        </button>

        <button
          onClick={() => {
            isVoiceSpeaking 
              ? stopAudio() 
              : speak(`Your cart has ${cart.length} craft items with a subtotal of ${formatPrice(subtotal)}.`);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm hover:bg-stone-200 transition"
        >
          {isVoiceSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isVoiceSpeaking ? t.stopListening : (t.listen || 'Read Cart Summary')}</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-amber-800" />
          <span>{t.myCart}</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
          Review your chosen crafts and proceed to direct artisan checkout.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">{t.emptyCart || 'Your basket is currently empty'}</h3>
          <p className="text-xs text-stone-500 mt-1 mb-6">{t.discoverMoreCrafts || 'Discover authentic handmade crafts from verified rural artisans.'}</p>
          <button
            onClick={() => setActiveView('buyer-marketplace')}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-stone-800 transition"
          >
            {t.exploreMarketplace || 'Explore Marketplace'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => {
              const itemTitle = item.product.translations?.[language]?.title || item.product.title;

              return (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product.images[0]} 
                      alt={itemTitle} 
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {item.product.category}
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 line-clamp-1">
                        {itemTitle}
                      </h3>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Artisan: <span className="font-semibold text-stone-700">{item.product.sellerName}</span> ({item.product.sellerRegion})
                      </div>
                      <div className="mt-1.5 text-xs sm:text-sm font-bold text-stone-900">
                        {formatPrice(item.product.price)} × {item.quantity} = <span className="text-stone-950 font-extrabold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove item"
                    aria-label="Remove item from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Checkout & Address Summary */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs h-fit">
            <h2 className="font-bold text-base text-stone-900 mb-4 pb-3 border-b border-stone-100">
              {t.shippingAddress || 'Shipping & Order Summary'}
            </h2>

            <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-stone-700 uppercase tracking-wider mb-1 text-[11px]">Full Name:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs sm:text-sm outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 uppercase tracking-wider mb-1 text-[11px]">Delivery Address:</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs sm:text-sm outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 uppercase tracking-wider mb-1 text-[11px]">City:</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs sm:text-sm outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 uppercase tracking-wider mb-1 text-[11px]">Postal Code:</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium text-xs sm:text-sm outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs font-semibold text-stone-600">
                <div className="flex justify-between">
                  <span>{t.subtotal || 'Subtotal'} ({cart.reduce((s, i) => s + i.quantity, 0)} items):</span>
                  <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.shipping || 'Eco-Packaging & Shipping'}:</span>
                  <span className="font-bold text-stone-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">{t.freeShipping || 'FREE'}</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-stone-200 text-sm font-extrabold text-stone-950">
                  <span>Total Amount:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                id="place-order-btn"
                type="submit"
                disabled={isOrdering}
                className="w-full mt-4 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-xs active:scale-98"
              >
                {isOrdering ? 'Confirming with Artisan...' : (t.checkout || 'Complete Order & Pay Artisan')}
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
