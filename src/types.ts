export type LanguageCode = 
  | 'en' // English
  | 'kn' // Kannada
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'ur' // Urdu
  | 'fr' // French
  | 'es' // Spanish
  | 'de' // German
  | 'ar'; // Arabic

export type PrimaryLanguageCode = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml' | 'bn' | 'mr' | 'gu' | 'ur';

export type UserRole = 'seller' | 'buyer' | 'guest';

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  voiceGuidance: boolean;
  captionsEnabled: boolean;
  simplifiedMode: boolean; // Easy Mode
  screenReaderOptimized: boolean;
  keyboardAssistance: boolean;
  speechRate: number; // 0.8 to 1.2
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  language: PrimaryLanguageCode;
  email?: string;
  phone?: string;
  location?: string;
  accessibility: AccessibilitySettings;
  avatar?: string;
  isDemo?: boolean;
}

export type CraftCategory = 
  | 'textiles'
  | 'pottery'
  | 'jewellery'
  | 'woodcraft'
  | 'baskets'
  | 'paintings'
  | 'toys'
  | 'metalcraft'
  | 'terracotta'
  | 'embroidery'
  | 'other';

export type VerificationData = {
  isVerified: boolean;
  heritageTradition: string;
  yearsOfPractice: number;
  regionOfOrigin: string;
  workshopAddress?: string;
  verificationBadge: 'Craft Verified' | 'Pending Review' | 'Artisan Self-Attested';
  verifiedBy?: string;
  verificationDate?: string;
  verificationCriteriaMet: string[];
  qrCodeDataUrl?: string;
};

export type CraftVerification = VerificationData;

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRegion: string;
  sellerLanguage: PrimaryLanguageCode;
  title: string;
  originalLanguage: PrimaryLanguageCode;
  category: CraftCategory;
  price: number; // in INR
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
  images: string[];
  description: string;
  materials: string[];
  dimensions?: string;
  highlights?: string[];
  careInstructions?: string;
  shippingInfo?: string;
  tags: string[];
  inStock: boolean;
  stockCount: number;
  createdAt: string;
  verification: VerificationData;
  translations: Record<string, {
    title: string;
    description: string;
    highlights?: string[];
    careInstructions?: string;
  }>;
  aiGenerated: boolean;
  pricingBreakdown?: {
    materialCost: number;
    hoursSpent: number;
    hourlyRateEstimate: number;
    recommendedMin: number;
    recommendedMax: number;
    explanation: string;
  };
}

export interface Artisan {
  id: string;
  name: string;
  nativeName?: string;
  craftType: CraftCategory;
  craftTypeName: string;
  region: string;
  state: string;
  language: PrimaryLanguageCode;
  photoUrl: string;
  story: string;
  storyOriginalLanguage: PrimaryLanguageCode;
  storyTranslations: Record<string, string>;
  yearsOfExperience: number;
  generation: string; // e.g. "3rd generation weaver"
  verified: boolean;
  verificationData: VerificationData;
  rating: number;
  salesCount: number;
  badge?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedLanguageTitle: string;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AiPricingRequest {
  materialCost: number;
  hoursSpent: number;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  isOneOfAKind: boolean;
  isHeritageCraft: boolean;
  desiredProfitPercentage?: number;
  craftCategory: CraftCategory;
  language: LanguageCode;
}

export interface AiPricingResponse {
  minPrice: number;
  maxPrice: number;
  fairPrice: number;
  explanation: string;
  breakdownSummary: string[];
}

export interface AiListingGenerationRequest {
  imageBase64?: string;
  imageUrl?: string;
  craftCategory?: CraftCategory;
  rawArtisanNotes?: string;
  language: PrimaryLanguageCode;
  targetLanguages?: LanguageCode[];
}

export interface AiListingGenerationResponse {
  title: string;
  category: CraftCategory;
  description: string;
  materials: string[];
  dimensions: string;
  highlights: string[];
  careInstructions: string;
  suggestedTags: string[];
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  translations: Record<string, {
    title: string;
    description: string;
    highlights?: string[];
    careInstructions?: string;
  }>;
}

export interface AiStoryRequest {
  rawSpokenText: string;
  artisanName: string;
  craftCategory: CraftCategory;
  region: string;
  yearsOfExperience?: number;
  generationInfo?: string;
  language: PrimaryLanguageCode;
}

export interface AiStoryResponse {
  storyInNativeLanguage: string;
  storyEnglish: string;
  translations: Record<string, string>;
  suggestedTagline: string;
}
