import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  PlusCircle, 
  Bot, 
  User, 
  Calculator, 
  ShoppingCart,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNavBar: React.FC = () => {
  const {
    role,
    currentUser,
    activeView,
    setActiveView,
    cart,
    setIsVoiceAssistantOpen,
    accessibility
  } = useApp();

  return (
    <div 
      id="mobile-bottom-app-bar"
      className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t px-3 py-1.5 transition font-sans ${
        accessibility.highContrast 
          ? 'bg-black border-yellow-400 text-yellow-300' 
          : 'bg-white/95 backdrop-blur-md border-stone-200 text-stone-700 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => setActiveView('welcome')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
            activeView === 'welcome'
              ? 'text-stone-950 font-bold' 
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Shop Crafts */}
        <button
          onClick={() => {
            setActiveView('buyer-marketplace');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
            activeView === 'buyer-marketplace' || activeView === 'easy-buyer' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Market</span>
        </button>

        {/* Voice AI Assistant button */}
        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="flex flex-col items-center -mt-3 p-2.5 rounded-full bg-stone-900 text-white shadow-md active:scale-95 transition"
        >
          <Bot className="w-5 h-5 text-amber-300" />
          <span className="text-[9px] font-bold mt-0.5">Voice</span>
        </button>

        {/* Add Craft / Sell */}
        <button
          onClick={() => {
            setActiveView('product-upload');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
            activeView === 'product-upload' || activeView === 'seller-dashboard' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span>List Craft</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setActiveView('cart')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold relative transition ${
            activeView === 'cart' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute 0 right-1 w-4 h-4 rounded-full bg-amber-800 text-white text-[9px] font-bold flex items-center justify-center">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
