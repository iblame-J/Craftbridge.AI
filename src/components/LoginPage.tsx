import React, { useState } from 'react';
import { 
  Lock, 
  Phone, 
  User, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Mic, 
  MicOff, 
  ShoppingBag, 
  Heart, 
  Globe,
  KeyRound,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, PrimaryLanguageCode } from '../types';
import { startSpeechRecognition } from '../utils/speech';

export const LoginPage: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    loginUser,
    setActiveView,
    speak,
    stopAudio,
    isVoiceSpeaking,
    accessibility,
    showNotification
  } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState<'seller' | 'buyer'>('seller');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [isListeningPhone, setIsListeningPhone] = useState<boolean>(false);

  // Pre-configured authentic demo profiles
  const DEMO_USERS: Record<string, UserProfile[]> = {
    seller: [
      {
        id: 'artisan-1',
        name: 'Basavanna Gowda',
        role: 'seller',
        language: 'kn',
        location: 'Hunsur, Mysuru, Karnataka',
        phone: '+91 98450 12345',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
        accessibility: {
          ...accessibility,
          voiceGuidance: true,
          simplifiedMode: true,
        },
        isDemo: true,
      },
      {
        id: 'artisan-2',
        name: 'Rupa Devi',
        role: 'seller',
        language: 'hi',
        location: 'Madanpura, Varanasi, Uttar Pradesh',
        phone: '+91 94150 67890',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
        accessibility: {
          ...accessibility,
          voiceGuidance: true,
          simplifiedMode: false,
        },
        isDemo: true,
      },
      {
        id: 'artisan-3',
        name: 'Arjun Sharma',
        role: 'seller',
        language: 'hi',
        location: 'Kot Jewar, Jaipur, Rajasthan',
        phone: '+91 98290 54321',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        accessibility: {
          ...accessibility,
          voiceGuidance: true,
          simplifiedMode: false,
        },
        isDemo: true,
      }
    ],
    buyer: [
      {
        id: 'buyer-1',
        name: 'Priya Sharma',
        role: 'buyer',
        language: 'en',
        email: 'priya.sharma@example.com',
        location: 'Bengaluru, India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        accessibility: {
          ...accessibility,
          simplifiedMode: false,
        },
        isDemo: true,
      },
      {
        id: 'buyer-2',
        name: 'David Miller',
        role: 'buyer',
        language: 'en',
        email: 'david.miller@example.co.uk',
        location: 'London, United Kingdom',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        accessibility: {
          ...accessibility,
          simplifiedMode: false,
        },
        isDemo: true,
      }
    ]
  };

  const handleDemoLogin = (user: UserProfile) => {
    loginUser(user);
    speak(`Welcome to CraftBridge AI, ${user.name}!`);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 6) {
      showNotification('Please enter a valid phone number');
      return;
    }
    setOtpSent(true);
    setOtpCode('4829'); // simulated easy PIN
    showNotification('Voice OTP code sent: 4829');
    speak('Your CraftBridge verification code is 4 8 2 9. It has been auto-filled for you.');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: activeRoleTab === 'seller' ? 'Artisan Member' : 'Craft Enthusiast',
      role: activeRoleTab,
      phone: phoneNumber,
      language: language,
      accessibility: accessibility,
    };
    loginUser(newUser);
    speak(`Login successful. Welcome to CraftBridge AI!`);
  };

  const toggleSpeechPhone = () => {
    if (isListeningPhone) {
      setIsListeningPhone(false);
    } else {
      stopAudio();
      setIsListeningPhone(true);
      startSpeechRecognition(language, {
        onStart: () => setIsListeningPhone(true),
        onResult: (transcript, isFinal) => {
          // extract digits from speech
          const digits = transcript.replace(/\D/g, '');
          if (digits) {
            setPhoneNumber(prev => prev + digits);
          }
          if (isFinal) {
            setIsListeningPhone(false);
          }
        },
        onError: () => setIsListeningPhone(false),
        onEnd: () => setIsListeningPhone(false),
      });
    }
  };

  return (
    <div id="login-page-screen" className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl">
        
        {/* Top Actions: Back to Home & Audio Instructions */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setActiveView('welcome')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-xs text-stone-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToHome || 'Back to Home'}</span>
          </button>

          <button
            onClick={() => {
              isVoiceSpeaking 
                ? stopAudio() 
                : speak(t.signInSubtitle);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
          >
            {isVoiceSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isVoiceSpeaking ? t.stopListening : (t.readLoginHelp || 'Read Login Help')}</span>
          </button>
        </div>

        {/* Title & Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-white font-serif font-bold text-xl flex items-center justify-center mx-auto mb-2.5 shadow-xs">
            CB
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {t.signInTitle || 'Welcome to CraftBridge'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
            {t.signInSubtitle || 'Sign in to access your artisan dashboard or explore handmade crafts worldwide.'}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-stone-100 mb-6">
          <button
            onClick={() => setActiveRoleTab('seller')}
            className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
              activeRoleTab === 'seller'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <User className="w-4 h-4 text-stone-600" />
            <span>{t.artisanSeller || 'Artisan / Seller'}</span>
          </button>

          <button
            onClick={() => setActiveRoleTab('buyer')}
            className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition ${
              activeRoleTab === 'buyer'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-stone-600" />
            <span>{t.buyerCollector || 'Buyer / Collector'}</span>
          </button>
        </div>

        {/* SECTION 1: 1-CLICK INSTANT DEMO LOGIN (Easiest for Artisans & Reviewers) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>{t.instantDemoProfiles || 'Instant Demo Profiles'}</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {DEMO_USERS[activeRoleTab].map((user) => (
              <button
                key={user.id}
                onClick={() => handleDemoLogin(user)}
                className="w-full p-3 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-white transition flex items-center justify-between text-left group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-11 h-11 rounded-lg object-cover border border-stone-300 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-900 transition">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {user.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-200 group-hover:bg-stone-900 group-hover:text-white text-stone-800 font-bold text-xs transition">
                    {t.signIn || 'Sign In'} →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="relative flex py-3 items-center mb-5">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-stone-400">
            {t.orLoginWithMobile || 'Or Login with Mobile'}
          </span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        {/* SECTION 2: MOBILE NUMBER & OTP LOGIN */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {t.mobileNumber || 'Mobile Number:'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-stone-300 bg-white font-medium text-xs sm:text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
                <button
                  type="button"
                  onClick={toggleSpeechPhone}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                    isListeningPhone ? 'bg-rose-600 text-white animate-pulse' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title="Speak Mobile Number"
                >
                  {isListeningPhone ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>{t.sendVerificationCode || 'Send Verification Code'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
              PIN sent to {phoneNumber}. Code: <strong className="font-bold">4829</strong>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                {t.enterOtp || 'Enter 4-Digit Verification Code:'}
              </label>
              <input
                type="text"
                required
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-bold text-xl text-center tracking-widest outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="py-2.5 px-3.5 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-100"
              >
                {t.changePhone || 'Change'}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition shadow-xs"
              >
                {t.verifyAndEnter || 'Verify & Enter →'}
              </button>
            </div>
          </form>
        )}

        {/* Guest access option */}
        <div className="mt-6 pt-3.5 border-t border-stone-200 text-center">
          <button
            onClick={() => {
              setActiveView('buyer-marketplace');
              speak('Browsing as guest buyer. Enjoy exploring authentic handmade crafts.');
            }}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 underline transition"
          >
            {t.continueAsGuest || 'Continue as Guest Buyer without signing in →'}
          </button>
        </div>

      </div>
    </div>
  );
};
