import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PrimaryLanguageCode, 
  UserRole, 
  AccessibilitySettings, 
  Product, 
  Artisan, 
  Order, 
  CartItem,
  UserProfile
} from '../types';
import { TRANSLATIONS, TranslationDict } from '../i18n/translations';
import { DEMO_ARTISANS, DEMO_PRODUCTS } from '../data/demoData';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';

interface AppContextType {
  language: PrimaryLanguageCode;
  setLanguage: (lang: PrimaryLanguageCode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  loginUser: (user: UserProfile) => void;
  logoutUser: () => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  isEasyMode: boolean;
  toggleEasyMode: () => void;
  products: Product[];
  artisans: Artisan[];
  orders: Order[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  saveNewProduct: (productData: Partial<Product>) => Promise<Product>;
  activeView: string;
  setActiveView: (view: string) => void;
  isVoiceSpeaking: boolean;
  speak: (text: string) => void;
  stopAudio: () => void;
  t: TranslationDict;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  isAccessibilityModalOpen: boolean;
  setIsAccessibilityModalOpen: (open: boolean) => void;
  currency: string;
  setCurrency: (c: string) => void;
  formatPrice: (priceInInr: number) => string;
  selectedArtisan: Artisan | null;
  setSelectedArtisan: (artisan: Artisan | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  voiceGuidance: true,
  captionsEnabled: true,
  simplifiedMode: false,
  screenReaderOptimized: false,
  keyboardAssistance: false,
  speechRate: 0.95,
};

const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistent or stateful user preferences
  const [language, setLanguageState] = useState<PrimaryLanguageCode>(() => {
    const saved = safeGetItem('cb_lang') as PrimaryLanguageCode;
    return saved || 'en';
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = safeGetItem('cb_role') as UserRole;
    return saved || 'guest';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = safeGetItem('cb_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = safeGetItem('cb_access');
      return saved ? { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(saved) } : DEFAULT_ACCESSIBILITY;
    } catch {
      return DEFAULT_ACCESSIBILITY;
    }
  });

  const [activeView, setActiveViewState] = useState<string>('welcome');
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [artisans, setArtisans] = useState<Artisan[]>(DEMO_ARTISANS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = safeGetItem('cb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('INR');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (newLang: PrimaryLanguageCode) => {
    setLanguageState(newLang);
    safeSetItem('cb_lang', newLang);
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    safeSetItem('cb_user', JSON.stringify(user));
    setRoleState(user.role);
    safeSetItem('cb_role', user.role);
    if (user.language) {
      setLanguageState(user.language);
      safeSetItem('cb_lang', user.language);
    }
    if (user.accessibility) {
      updateAccessibility(user.accessibility);
    }
    showNotification(`Welcome, ${user.name}!`);
    if (user.role === 'seller') {
      setActiveViewState(accessibility.simplifiedMode ? 'easy-seller' : 'seller-dashboard');
    } else {
      setActiveViewState(accessibility.simplifiedMode ? 'easy-buyer' : 'buyer-marketplace');
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    safeRemoveItem('cb_user');
    setRoleState('guest');
    safeSetItem('cb_role', 'guest');
    setActiveViewState('welcome');
    showNotification('Logged out successfully');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    safeSetItem('cb_role', newRole);
    if (newRole === 'seller') {
      setActiveViewState(accessibility.simplifiedMode ? 'easy-seller' : 'seller-dashboard');
    } else if (newRole === 'buyer') {
      setActiveViewState(accessibility.simplifiedMode ? 'easy-buyer' : 'buyer-marketplace');
    } else {
      setActiveViewState('welcome');
    }
  };

  const updateAccessibility = (newSettings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => {
      const updated = { ...prev, ...newSettings };
      safeSetItem('cb_access', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleEasyMode = () => {
    const nextState = !accessibility.simplifiedMode;
    updateAccessibility({ simplifiedMode: nextState });
    if (role === 'seller') {
      setActiveViewState(nextState ? 'easy-seller' : 'seller-dashboard');
    } else if (role === 'buyer') {
      setActiveViewState(nextState ? 'easy-buyer' : 'buyer-marketplace');
    }
  };

  const setActiveView = (view: string) => {
    stopAudio();
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const speak = (text: string) => {
    if (!text) return;
    setIsVoiceSpeaking(true);
    speakText(text, language, {
      rate: accessibility.speechRate || 0.95,
      onStart: () => setIsVoiceSpeaking(true),
      onEnd: () => setIsVoiceSpeaking(false),
      onError: () => setIsVoiceSpeaking(false),
    });
  };

  const stopAudio = () => {
    stopSpeech();
    setIsVoiceSpeaking(false);
  };

  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn('API products fetch fallback:', e);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.warn('API orders fetch fallback:', e);
    }
  };

  const saveNewProduct = async (productData: Partial<Product>): Promise<Product> => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sellerId: 'artisan-1',
      sellerName: 'Basavanna Gowda',
      sellerRegion: 'Mysuru, Karnataka',
      sellerLanguage: language,
      title: productData.title || 'Handmade Craft',
      originalLanguage: language,
      category: productData.category || 'baskets',
      price: productData.price || 1000,
      suggestedPriceMin: productData.suggestedPriceMin || 850,
      suggestedPriceMax: productData.suggestedPriceMax || 1200,
      images: productData.images && productData.images.length > 0 
        ? productData.images 
        : ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80'],
      description: productData.description || 'Authentic handmade craft lovingly made by artisan.',
      materials: productData.materials || ['Natural materials'],
      dimensions: productData.dimensions || 'Standard dimensions',
      highlights: productData.highlights || ['100% Handmade', 'Eco-friendly'],
      careInstructions: productData.careInstructions || 'Wipe with clean dry cloth.',
      shippingInfo: 'Packed carefully and shipped with tracking.',
      tags: productData.tags || ['Handmade', 'Craft'],
      inStock: true,
      stockCount: 10,
      createdAt: new Date().toISOString(),
      aiGenerated: true,
      verification: DEMO_ARTISANS[0].verificationData,
      translations: productData.translations || {},
      pricingBreakdown: productData.pricingBreakdown,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        return data.product;
      }
    } catch (err) {
      console.warn('Fallback local store for new product:', err);
    }

    setProducts(prev => [newProd, ...prev]);
    return newProd;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      let updated;
      if (idx > -1) {
        updated = [...prev];
        updated[idx].quantity += quantity;
      } else {
        updated = [...prev, { product, quantity }];
      }
      safeSetItem('cb_cart', JSON.stringify(updated));
      return updated;
    });
    showNotification(`Added ${product.title} to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      safeSetItem('cb_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    safeRemoveItem('cb_cart');
  };

  const formatPrice = (priceInInr: number): string => {
    const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const converted = Math.round(priceInInr * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  // Initial load
  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        currentUser,
        loginUser,
        logoutUser,
        accessibility,
        updateAccessibility,
        isEasyMode: accessibility.simplifiedMode,
        toggleEasyMode,
        products,
        artisans,
        orders,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        refreshProducts,
        refreshOrders,
        saveNewProduct,
        activeView,
        setActiveView,
        isVoiceSpeaking,
        speak,
        stopAudio,
        t,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        isAccessibilityModalOpen,
        setIsAccessibilityModalOpen,
        currency,
        setCurrency,
        formatPrice,
        selectedArtisan,
        setSelectedArtisan,
        selectedProduct,
        setSelectedProduct,
        notificationMessage,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
