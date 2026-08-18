import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { WelcomeLanding } from './components/WelcomeLanding';
import { SellerDashboard } from './components/SellerDashboard';
import { EasyModeSeller } from './components/EasyModeSeller';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { EasyModeBuyer } from './components/EasyModeBuyer';
import { ProductUploader } from './components/ProductUploader';
import { SmartPricingTool } from './components/SmartPricingTool';
import { CartAndCheckout } from './components/CartAndCheckout';
import { ArtisanDirectory } from './components/ArtisanDirectory';
import { LoginPage } from './components/LoginPage';
import { BottomNavBar } from './components/BottomNavBar';
import { AccessibilityModal } from './components/AccessibilityModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { Bot, Sparkles, CheckCircle2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    accessibility,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    notificationMessage,
    role
  } = useApp();

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        accessibility.highContrast 
          ? 'bg-black text-white selection:bg-yellow-400 selection:text-black' 
          : 'bg-stone-100/60 text-stone-900 selection:bg-amber-700 selection:text-white'
      } ${
        accessibility.largeText ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Global Navigation Header */}
      <Header />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-20">
        {activeView === 'welcome' && <WelcomeLanding />}
        {activeView === 'login' && <LoginPage />}
        {activeView === 'seller-dashboard' && <SellerDashboard />}
        {activeView === 'easy-seller' && <EasyModeSeller />}
        {activeView === 'buyer-marketplace' && <BuyerMarketplace />}
        {activeView === 'easy-buyer' && <EasyModeBuyer />}
        {activeView === 'product-upload' && <ProductUploader />}
        {activeView === 'smart-pricing' && <SmartPricingTool />}
        {activeView === 'cart' && <CartAndCheckout />}
        {activeView === 'artisan-directory' && <ArtisanDirectory />}
      </main>

      {/* Mobile App Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Global Accessibility Modal */}
      <AccessibilityModal />

      {/* Global Conversational AI Voice Assistant */}
      <VoiceAssistantModal />

      {/* Notification Toast */}
      {notificationMessage && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs shadow-lg flex items-center gap-2 border border-stone-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs font-normal text-stone-400 border-t border-stone-200 bg-white">
        <p>CraftBridge • Authentic Indian Handicrafts Direct from Master Artisans</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
