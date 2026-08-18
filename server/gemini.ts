import { GoogleGenAI, Type } from '@google/genai';
import { 
  AiListingGenerationRequest, 
  AiListingGenerationResponse, 
  AiPricingRequest, 
  AiPricingResponse, 
  AiStoryRequest, 
  AiStoryResponse,
  CraftCategory,
  PrimaryLanguageCode
} from '../src/types';

// Shared server-side Gemini client with User-Agent header
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Recommended fast models with fallback order
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
];

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिंदी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ml: 'Malayalam (മലയാളം)',
  bn: 'Bengali (বাংলা)',
  mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)',
  ur: 'Urdu (اردو)',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  ar: 'Arabic',
};

/**
 * Execute a Gemini request trying fallback models if quota (429) or rate limits occur.
 */
async function callGeminiWithFallback<T>(
  actionName: string,
  generatorFn: (ai: GoogleGenAI, modelName: string) => Promise<T>,
  fallbackFn: () => T
): Promise<T> {
  const ai = getGeminiClient();
  if (!ai) {
    return fallbackFn();
  }

  for (const modelName of CANDIDATE_MODELS) {
    try {
      return await generatorFn(ai, modelName);
    } catch (err: any) {
      const isQuotaOrRateLimit = 
        err?.status === 429 || 
        err?.message?.includes('429') || 
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');
      
      console.warn(`[Gemini ${actionName}] Model ${modelName} encountered issue: ${err?.message || err}.`);
      if (isQuotaOrRateLimit) {
        console.warn(`[Gemini ${actionName}] Attempting alternative model in fallback cascade...`);
      }
      // Continue to next model in cascade
    }
  }

  console.warn(`[Gemini ${actionName}] All models exhausted or unavailable. Using instant curated fallback.`);
  return fallbackFn();
}

/**
 * Generates an accessible, rich craft product listing from photo or notes.
 */
export async function generateProductListing(
  req: AiListingGenerationRequest
): Promise<AiListingGenerationResponse> {
  const targetLang = req.language || 'en';
  const targetLangName = LANGUAGE_NAMES[targetLang] || 'English';

  return callGeminiWithFallback(
    'generateProductListing',
    async (ai, modelName) => {
      const prompt = `You are CraftBridge AI, an expert cultural curator and e-commerce assistant helping rural and traditional handmade artisans sell globally.
The artisan speaks ${targetLangName} and may have low digital literacy.

Craft Category hinted: ${req.craftCategory || 'Detect from image/notes'}
Artisan Raw Voice Notes / Input: "${req.rawArtisanNotes || 'Handmade artisanal craft'}"

Please analyze this craft item and generate a structured listing.
Create:
1. Product title in ${targetLangName} and English.
2. Category: one of ["textiles", "pottery", "jewellery", "woodcraft", "baskets", "paintings", "toys", "metalcraft", "terracotta", "embroidery", "other"].
3. Rich, respectful, authentic description in ${targetLangName}.
4. Materials used (array of strings).
5. Approximate dimensions (e.g. '12" Diameter x 8" Height').
6. 3 key highlights in ${targetLangName}.
7. Care instructions in ${targetLangName}.
8. 4-6 search tags.
9. Estimated fair pricing range in Indian Rupees (INR) (suggestedPriceMin, suggestedPriceMax).
10. High-quality translated versions into English, Hindi, Kannada, Tamil, Telugu, French, and Spanish.

Return strictly a JSON object conforming to this schema.`;

      const contents: any[] = [];
      if (req.imageBase64) {
        const cleanBase64 = req.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64,
          },
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts: contents },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Title in artisan native language' },
              category: { type: Type.STRING, description: 'Standard category' },
              description: { type: Type.STRING, description: 'Authentic description in native language' },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } },
              dimensions: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              careInstructions: { type: Type.STRING },
              suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedPriceMin: { type: Type.NUMBER },
              suggestedPriceMax: { type: Type.NUMBER },
              translations: {
                type: Type.OBJECT,
                properties: {
                  en: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                      careInstructions: { type: Type.STRING },
                    },
                  },
                  hi: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                  kn: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                  ta: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                  te: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                  fr: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                  es: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                },
              },
            },
            required: ['title', 'category', 'description', 'materials', 'suggestedPriceMin', 'suggestedPriceMax'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        title: parsed.title || 'Handcrafted Heritage Art Piece',
        category: (parsed.category as CraftCategory) || req.craftCategory || 'other',
        description: parsed.description || 'Authentic handmade craft made with traditional techniques.',
        materials: parsed.materials || ['Natural materials', 'Eco-friendly dyes'],
        dimensions: parsed.dimensions || 'Standard artisanal size',
        highlights: parsed.highlights || ['100% Handmade', 'Eco-Friendly', 'Authentic Heritage'],
        careInstructions: parsed.careInstructions || 'Handle with care. Keep away from excessive moisture.',
        suggestedTags: parsed.suggestedTags || ['Handmade', 'Eco-friendly', 'Traditional'],
        suggestedPriceMin: Number(parsed.suggestedPriceMin) || 800,
        suggestedPriceMax: Number(parsed.suggestedPriceMax) || 1200,
        translations: parsed.translations || {},
      };
    },
    () => getFallbackListing(req)
  );
}

/**
 * Smart Pricing Assistant calculation & explanation
 */
export async function calculateSmartPricing(req: AiPricingRequest): Promise<AiPricingResponse> {
  const langName = LANGUAGE_NAMES[req.language] || 'English';

  const baseLaborRatePerHour = 120; // fair minimum artisan living wage ₹120/hr
  const laborCost = req.hoursSpent * baseLaborRatePerHour;
  const sizeMultiplier = req.size === 'small' ? 1.0 : req.size === 'medium' ? 1.25 : req.size === 'large' ? 1.5 : 1.8;
  const uniquenessBonus = req.isOneOfAKind ? 1.3 : 1.0;
  const heritageBonus = req.isHeritageCraft ? 1.25 : 1.0;

  const baseCost = (req.materialCost + laborCost) * sizeMultiplier;
  const fairBase = Math.round((baseCost * uniquenessBonus * heritageBonus) / 50) * 50;
  const minPrice = Math.max(req.materialCost * 2, Math.round((fairBase * 0.88) / 50) * 50);
  const maxPrice = Math.round((fairBase * 1.2) / 50) * 50;

  return callGeminiWithFallback(
    'calculateSmartPricing',
    async (ai, modelName) => {
      const prompt = `You are a Smart Pricing Assistant for CraftBridge AI.
Explain the recommended price to a traditional artisan who speaks ${langName} in very simple, respectful, jargon-free words.

Data:
- Material Cost: ₹${req.materialCost}
- Time Spent: ${req.hoursSpent} hours
- Size: ${req.size}
- One-of-a-kind: ${req.isOneOfAKind ? 'Yes' : 'No'}
- Traditional Heritage Lineage: ${req.isHeritageCraft ? 'Yes' : 'No'}
- Calculated Fair Price: ₹${fairBase} (Range: ₹${minPrice} - ₹${maxPrice})

Provide:
1. Short 2-sentence explanation in ${langName} that clearly values their time and materials.
2. 3 simple bullet points breaking down why this is fair.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              breakdownSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['explanation', 'breakdownSummary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        fairPrice: fairBase,
        minPrice,
        maxPrice,
        explanation: parsed.explanation || `Suggested fair price range is ₹${minPrice} - ₹${maxPrice}.`,
        breakdownSummary: parsed.breakdownSummary || [
          `Materials: ₹${req.materialCost}`,
          `Labor: ${req.hoursSpent} hours`,
          `Fair wage included`,
        ],
      };
    },
    () => {
      const isKn = req.language === 'kn';
      const isHi = req.language === 'hi';
      const isTa = req.language === 'ta';
      const isTe = req.language === 'te';

      const explanation = isKn
        ? `ನಿಮ್ಮ ಕಚ್ಚಾ ವಸ್ತುಗಳ ವೆಚ್ಚ ₹${req.materialCost} ಮತ್ತು ${req.hoursSpent} ಗಂಟೆಗಳ ನೈಪುಣ್ಯತೆಗೆ ₹${minPrice} ರಿಂದ ₹${maxPrice} ಸೂಕ್ತ ಬೆಲೆಯಾಗಿದೆ. ಇದು ನಿಮಗೆ ನ್ಯಾಯಯುತ ಕೂಲಿ ಮತ್ತು ಲಾಭವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.`
        : isHi
        ? `आपकी सामग्री लागत ₹${req.materialCost} और ${req.hoursSpent} घंटे की कड़ी मेहनत के अनुसार उचित मूल्य ₹${minPrice} - ₹${maxPrice} है। यह आपको सम्मानजनक मजदूरी और लाभ दिलाएगा।`
        : isTa
        ? `உங்கள் மூலப்பொருள் செலவு ₹${req.materialCost} மற்றும் ${req.hoursSpent} மணிநேர உழைப்பிற்கு ₹${minPrice} - ₹${maxPrice} நியாயமான விலையாகும்.`
        : isTe
        ? `మీ ముడిసరుకుల ఖర్చు ₹${req.materialCost} మరియు ${req.hoursSpent} గంటల నైపుణ్యానికి ₹${minPrice} - ₹${maxPrice} సరసమైన ధర.`
        : `Based on your material cost of ₹${req.materialCost} and ${req.hoursSpent} hours of craftsmanship, a fair selling price is ₹${minPrice} – ₹${maxPrice}. This ensures you earn a respectful living wage plus material reimbursement.`;

      return {
        fairPrice: fairBase,
        minPrice,
        maxPrice,
        explanation,
        breakdownSummary: [
          `Raw Materials: ₹${req.materialCost}`,
          `Artisan Time: ${req.hoursSpent} hrs @ ₹${baseLaborRatePerHour}/hr (₹${laborCost})`,
          `${req.isHeritageCraft ? 'Generational Heritage Craft value included' : 'Standard Handmade Quality'}`
        ],
      };
    }
  );
}

/**
 * Artisan Story Generator: transforms raw spoken transcript into authentic story.
 */
export async function generateArtisanStory(req: AiStoryRequest): Promise<AiStoryResponse> {
  const langName = LANGUAGE_NAMES[req.language] || 'English';

  return callGeminiWithFallback(
    'generateArtisanStory',
    async (ai, modelName) => {
      const prompt = `You are a cultural biographer for CraftBridge AI.
An artisan named ${req.artisanName} from ${req.region} has shared their background:
"${req.rawSpokenText}"

Craft: ${req.craftCategory}
Years of Experience: ${req.yearsOfExperience || 'Decades'}
Lineage: ${req.generationInfo || 'Generational Heritage'}
Artisan Mother Tongue: ${langName}

Write an authentic, respectful story preserving their true voice without inventing false facts.
Include:
1. Story in ${langName}.
2. English translation for international buyers.
3. Translations in Hindi, Kannada, Tamil, and Telugu.
4. A 1-line inspirational tagline.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              storyInNativeLanguage: { type: Type.STRING },
              storyEnglish: { type: Type.STRING },
              suggestedTagline: { type: Type.STRING },
              translations: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING },
                  hi: { type: Type.STRING },
                  kn: { type: Type.STRING },
                  ta: { type: Type.STRING },
                  te: { type: Type.STRING },
                },
              },
            },
            required: ['storyInNativeLanguage', 'storyEnglish', 'suggestedTagline'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        storyInNativeLanguage: parsed.storyInNativeLanguage || req.rawSpokenText,
        storyEnglish: parsed.storyEnglish || req.rawSpokenText,
        translations: parsed.translations || { en: parsed.storyEnglish },
        suggestedTagline: parsed.suggestedTagline || `Handmade Heritage from ${req.region}`,
      };
    },
    () => {
      const isKn = req.language === 'kn';
      const isHi = req.language === 'hi';
      const isTa = req.language === 'ta';
      const isTe = req.language === 'te';

      const nativeStory = isKn
        ? `${req.artisanName} ಅವರು ${req.region} ನ ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿ. ${req.rawSpokenText}`
        : isHi
        ? `${req.artisanName} ${req.region} से पारंपरिक कारीगर हैं। ${req.rawSpokenText}`
        : isTa
        ? `${req.artisanName} ${req.region} பகுதியைச் சேர்ந்த பாரம்பரிய கைவினைஞர். ${req.rawSpokenText}`
        : isTe
        ? `${req.artisanName} ${req.region} ప్రాంతానికి చెందిన సాంప్రదాయ కళాకారుడు. ${req.rawSpokenText}`
        : `Artisan ${req.artisanName} crafts traditional ${req.craftCategory} from ${req.region}. ${req.rawSpokenText}`;

      return {
        storyInNativeLanguage: nativeStory,
        storyEnglish: `Artisan ${req.artisanName} from ${req.region} practices authentic ${req.craftCategory} with generational heritage. "${req.rawSpokenText}"`,
        translations: {
          en: `Artisan ${req.artisanName} from ${req.region} practices authentic ${req.craftCategory} with generational heritage. "${req.rawSpokenText}"`,
          hi: `${req.artisanName} ${req.region} से पारंपरिक ${req.craftCategory} कारीगर हैं।`,
          kn: `${req.artisanName} ಅವರು ${req.region} ನ ${req.craftCategory} ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿ.`,
          ta: `${req.artisanName} ${req.region} பகுதியைச் சேர்ந்த ${req.craftCategory} கைவினைஞர்.`,
          te: `${req.artisanName} ${req.region} కు చెందిన ${req.craftCategory} కళాకారుడు.`,
        },
        suggestedTagline: `Master ${req.craftCategory} Artisan from ${req.region}`,
      };
    }
  );
}

/**
 * Conversational AI Assistant ("Talk to CraftBridge")
 */
export async function talkToCraftBridgeAssistant(
  message: string,
  userLanguage: PrimaryLanguageCode,
  userRole: string,
  currentView?: string
): Promise<{ text: string; actionSuggestion?: string }> {
  const langName = LANGUAGE_NAMES[userLanguage] || 'English';
  const lower = message.toLowerCase();
  let actionSuggestion: string | undefined = undefined;

  // Rule-based quick action triggers
  if (lower.includes('product') && (lower.includes('show') || lower.includes('see') || lower.includes('ನನ್ನ ಉತ್ಪನ್ನ') || lower.includes('मेरे उत्पाद'))) {
    actionSuggestion = 'NAVIGATE_PRODUCTS';
  } else if (lower.includes('upload') || lower.includes('add') || lower.includes('ಹೊಸ') || lower.includes('जोड़ें') || lower.includes('சேர்')) {
    actionSuggestion = 'OPEN_UPLOAD';
  } else if (lower.includes('price') || lower.includes('charge') || lower.includes('cost') || lower.includes('ಬೆಲೆ') || lower.includes('कीमत')) {
    actionSuggestion = 'OPEN_SMART_PRICING';
  } else if (lower.includes('order') || lower.includes('ಆರ್ಡರ್') || lower.includes('ऑर्डर')) {
    actionSuggestion = 'NAVIGATE_ORDERS';
  } else if (lower.includes('help') || lower.includes('understand') || lower.includes('ಸಹಾಯ') || lower.includes('मदद')) {
    actionSuggestion = 'EXPLAIN_PAGE';
  }

  return callGeminiWithFallback(
    'talkToCraftBridgeAssistant',
    async (ai, modelName) => {
      const systemInstruction = `You are CraftBridge Assistant, a friendly, ultra-clear voice assistant for an accessible global artisan craft app.
The user is a ${userRole} speaking ${langName}.
Current screen: ${currentView || 'Home'}.
Always reply in ${langName}.
Keep responses under 3 short sentences.
Avoid complicated technical or e-commerce jargon.
Explain things simply and warmly.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: message,
        config: {
          systemInstruction,
        },
      });

      return {
        text: response.text || 'I am here to guide you through CraftBridge.',
        actionSuggestion,
      };
    },
    () => {
      const replies: Record<string, string> = {
        kn: `ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು "ನನ್ನ ಉತ್ಪನ್ನಗಳನ್ನು ತೋರಿಸಿ", "ಹೊಸ ವಸ್ತು ಸೇರಿಸಿ", ಅಥವಾ "ಬೆಲೆ ನಿರ್ಧರಿಸಿ" ಎಂದು ಹೇಳಬಹುದು.`,
        hi: `मैं आपकी सहायता के लिए यहाँ हूँ। आप "उत्पाद जोड़ें", "कीमत तय करें", या "ऑर्डर देखें" कह सकते हैं।`,
        ta: `நான் உங்களுக்கு உதவ இங்கே இருக்கிறேன். "பொருட்களைக் காட்டு", "புதிய கைவினைப் பொருளைச் சேர்" என்று நீங்கள் கூறலாம்.`,
        te: `నేను మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు "ఉత్పత్తులను చూపించు", "కొత్త వస్తువును జోడించు" అని అడగవచ్చు.`,
        ml: `നിങ്ങളെ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്. ഉൽപ്പന്നങ്ങൾ ചേർക്കാനോ വില നിർണ്ണയിക്കാനോ എന്നോട് ചോദിക്കാം.`,
        bn: `আমি আপনাকে সাহায্য করতে প্রস্তুত। আপনি পণ্য যোগ করতে বা দাম নির্ধারণ করতে বলতে পারেন।`,
        mr: `मी तुम्हाला मदत करण्यासाठी येथे आहे. आपण नवीन वस्तू जोडू शकता किंवा योग्य किंमत तपासू शकता.`,
        gu: `હું તમારી મદદ માટે અહીં છું. તમે નવી વસ્તુ ઉમેરી શકો છો અથવા કિંમત નક્કી કરી શકો છો.`,
        ur: `میں آپ کی مدد کے لیے حاضر ہوں۔ آپ مصنوعات شامل کرنے یا قیمت معلوم کرنے کا کہہ سکتے ہیں۔`,
        en: `I'm here to help you! You can ask me to "Show my products", "Upload a new craft", "Help me choose a price", or search for crafts.`,
      };

      return {
        text: replies[userLanguage] || replies.en,
        actionSuggestion,
      };
    }
  );
}

/**
 * Category-aware, highly detailed fallback listings for all 10 craft types.
 */
function getFallbackListing(req: AiListingGenerationRequest): AiListingGenerationResponse {
  const cat = req.craftCategory || 'other';
  const raw = (req.rawArtisanNotes || '').toLowerCase();
  const lang = req.language || 'en';

  const categoryData: Record<string, {
    enTitle: string;
    knTitle: string;
    hiTitle: string;
    materials: string[];
    dimensions: string;
    highlights: string[];
    priceMin: number;
    priceMax: number;
    enDesc: string;
    knDesc: string;
    hiDesc: string;
  }> = {
    baskets: {
      enTitle: 'Handwoven Forest Bamboo Basket',
      knTitle: 'ಕೈಯಿಂದ ಹೆಣೆದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನ ಬುಟ್ಟಿ',
      hiTitle: 'हस्तनिर्मित प्राकृतिक बांस की टोकरी',
      materials: ['Forest Bamboo', 'Natural Cane Fibers'],
      dimensions: '11" Diameter x 8" Height',
      highlights: ['100% Biodegradable & Plastic-Free', 'Durable Multi-weave Interlock', 'Generational Handcraft'],
      priceMin: 850,
      priceMax: 1250,
      enDesc: 'Natural split bamboo handcrafted storage basket hand-woven by rural artisans using sustainably harvested bamboo.',
      knDesc: 'ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಕೈಯಲ್ಲೇ ಸೀಳಿ ಹೆಣೆದ ಪರಿಸರ ಸ್ನೇಹಿ ಬುಟ್ಟಿ. ಹಣ್ಣು ತರಕಾರಿ ಅಥವಾ ಗೃಹ ಸಾಮಗ್ರಿ ಇಡಲು ಅತ್ಯುತ್ತಮ.',
      hiDesc: 'प्राकृतिक बांस से हाथ से बुनी गई टिकाऊ और पर्यावरण-अनुकूल टोकरी।',
    },
    textiles: {
      enTitle: 'Handloom Pure Mulberry Silk Saree',
      knTitle: 'ಕೈಮಗ್ಗದ ಶುದ್ಧ ರೇಷ್ಮೆ ಸೀರೆ',
      hiTitle: 'हथकरघा शुद्ध शहतूत रेशम साड़ी',
      materials: ['100% Pure Mulberry Silk', 'Natural Zari Threads'],
      dimensions: '6.2 Meters with Blouse Piece',
      highlights: ['Woven on Traditional Pit Loom', 'Natural Vegetable Dyes', 'Authentic Silk Mark Quality'],
      priceMin: 4500,
      priceMax: 7200,
      enDesc: 'Exquisite handloom silk saree meticulously woven by master weavers over 8 days with generational pit-loom techniques.',
      knDesc: 'ಮಾಸ್ಟರ್ ನೇಕಾರರಿಂದ 8 ದಿನಗಳ ಕಾಲ ಕೈಮಗ್ಗದಲ್ಲಿ ನೇಯ್ದ ನೈಜ ಶುದ್ಧ ರೇಷ್ಮೆ ಸೀರೆ.',
      hiDesc: 'पारंपरिक हथकरघे पर कुशल बुनकरों द्वारा तैयार की गई शुद्ध रेशम की साड़ी।',
    },
    pottery: {
      enTitle: 'Wheel-Thrown Terracotta Water Pitcher',
      knTitle: 'ಚಕ್ರದಲ್ಲಿ ತಿರುಗಿಸಿದ ನೈಸರ್ಗಿಕ ಮಣ್ಣಿನ ಮಡಕೆ',
      hiTitle: 'कुम्हार के चाक पर बना मिट्टी का घड़ा',
      materials: ['Natural Riverbed Clay', 'Wood-Ash Glaze'],
      dimensions: '9" Diameter x 11" Height (3L Capacity)',
      highlights: ['Natural Evaporative Cooling', 'Lead-Free & Food-Safe', 'Wood-Fired Kiln Finish'],
      priceMin: 650,
      priceMax: 950,
      enDesc: 'Traditional wheel-thrown earthen pot crafted from river clay, offering natural water purification and cooling.',
      knDesc: 'ನದಿಯ ನೈಸರ್ಗಿಕ ಜೇಡಿಮಣ್ಣಿನಿಂದ ಚಕ್ರದಲ್ಲಿ ರೂಪಿಸಿ ಸುಟ್ಟ ಸಾಂಪ್ರದಾಯಿಕ ಮಣ್ಣಿನ ಮಡಕೆ.',
      hiDesc: 'नदी की शुद्ध मिट्टी से बना प्राकृतिक जल-शीतलन मटका।',
    },
    toys: {
      enTitle: 'Kinhal Lacquerware Wooden Folk Figurine',
      knTitle: 'ಕಿನ್ಹಾಳ ನೈಸರ್ಗಿಕ ಬಣ್ಣದ ಮರದ ಗೊಂಬೆ',
      hiTitle: 'किन्हाळ हस्तनिर्मित लकड़ी का खिलौना',
      materials: ['Sustainably Harvested Hale Wood', 'Non-Toxic Vegetable Lacquer'],
      dimensions: '7.5" Height x 3" Width',
      highlights: ['100% Child-Safe & Non-Toxic', 'Mirror Smooth Lacquer Finish', 'GI Tagged Craft Heritage'],
      priceMin: 750,
      priceMax: 1100,
      enDesc: 'Charming wooden figurine turned on traditional lathe and finished with lustrous, non-toxic organic vegetable lacquer.',
      knDesc: 'ಸುರಕ್ಷಿತ ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳಿಂದ ಕಟೆದ ಐತಿಹಾಸಿಕ ಕಿನ್ಹಾಳ ಶೈಲಿಯ ಮರದ ಕಲಾಕೃತಿ.',
      hiDesc: 'प्राकृतिक रंगों और सुरक्षित लकड़ी से बना पारंपरिक खिलौना।',
    },
    woodcraft: {
      enTitle: 'Carved Sandalwood & Teakwood Keepsake Box',
      knTitle: 'ಕೆತ್ತನೆಯ ಶ್ರೀಗಂಧ ಮತ್ತು ತೇಗದ ಮರದ ಪೆಟ್ಟಿಗೆ',
      hiTitle: 'नक्काशीदार सागवान की लकड़ी का डिब्बा',
      materials: ['Seasoned Teakwood', 'Natural Beeswax Polish'],
      dimensions: '8" Length x 5" Width x 3.5" Height',
      highlights: ['Intricate Hand-Chiseled Jali Lattice', 'Natural Wood Grain Pattern', 'Brass Inlay Hardware'],
      priceMin: 1400,
      priceMax: 2200,
      enDesc: 'Hand-carved solid wood treasure box featuring intricate floral jaali fretwork and smooth organic wax sheen.',
      knDesc: 'ಕುಶಲಕರ್ಮಿಗಳ ನುರಿತ ಕೈಗಳಿಂದ ಹೂವಿನ ಕೆತ್ತನೆ ಮಾಡಿದ ಗಟ್ಟಿ ಮರದ ಪೆಟ್ಟಿಗೆ.',
      hiDesc: 'हाथ की बारीक नक्काशी वाला मजबूत और सुंदर लकड़ी का बॉक्स।',
    },
    jewellery: {
      enTitle: 'Handcrafted Dokra Brass Tribal Necklace',
      knTitle: 'ಡೋಕ್ರಾ ಹಿತ್ತಾಳೆಯ ಸಾಂಪ್ರದಾಯಿಕ ನೆಕ್ಲೇಸ್',
      hiTitle: 'ढोकरा पारंपरिक पीतल का हार',
      materials: ['Recycled Bell Metal Brass', 'Natural Cotton Thread'],
      dimensions: 'Adjustable 16" - 20" Cord Length',
      highlights: ['4,000 Year Old Lost-Wax Casting', 'Unique One-of-a-Kind Motif', 'Hypoallergenic Finish'],
      priceMin: 1200,
      priceMax: 1900,
      enDesc: 'Ancient lost-wax cast bell metal jewellery created with ancestral tribal motifs and hand-spun thread cord.',
      knDesc: 'ಪುರಾತನ ಮೇಣದ ಅಚ್ಚಿನ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಎರಕಹೊಯ್ದ ನೈಜ ಹಿತ್ತಾಳೆಯ ಆಭರಣ.',
      hiDesc: 'प्राचीन ढोकरा तकनीक से हाथ से ढाला गया प्रामाणिक पीतल का आभूषण।',
    },
    embroidery: {
      enTitle: 'Kasuti Geometrical Hand-Embroidered Panel',
      knTitle: 'ಕಸೂತಿ ಜ್ಯಾಮಿತೀಯ ಕರಕುಶಲ ಕಸೂತಿ ಪಟ್ಟಿ',
      hiTitle: 'कसूती हस्तनिर्मित पारंपरिक कढ़ाई',
      materials: ['Pure Khadi Cotton Fabric', 'Silk Embroidery Floss'],
      dimensions: '18" x 18" Framed Panel / Cushion Cover',
      highlights: ['Reversible Double-Running Stitch', 'Zero Knots on Reverse', 'Ancestral Temple Motifs'],
      priceMin: 1100,
      priceMax: 1600,
      enDesc: 'Traditional Kasuti needlecraft created with count-thread stitching without any tracing or back knots.',
      knDesc: 'ದಾರವನ್ನು ಎಣಿಸಿ ಸೂಜಿಯಿಂದ ನಯವಾಗಿ ಹೆಣೆದ ವಿಶ್ವವಿಖ್ಯಾತ ಕರ್ನಾಟಕ ಕಸೂತಿ ಕಲೆ.',
      hiDesc: 'बिना किसी गांठ के हाथ की सुई से की गई बारीक़ कसूती कढ़ाई।',
    },
    terracotta: {
      enTitle: 'Handcrafted Terracotta Temple Diya Lamp',
      knTitle: 'ಕೈಯಿಂದ ಮಾಡಿದ ನೈಸರ್ಗಿಕ ಮಣ್ಣಿನ ದೀಪ',
      hiTitle: 'हस्तनिर्मित टेराकोटा पारंपरिक दिया',
      materials: ['Special Clay Mix', 'Natural Mineral Ochre'],
      dimensions: '6" Diameter x 4" Height',
      highlights: ['Traditional Hand-Molded Form', 'Eco-Friendly Festival Light', 'Hand-Painted Floral Accents'],
      priceMin: 450,
      priceMax: 750,
      enDesc: 'Decorative handcrafted clay diya lamp molded with auspicious floral patterns for sacred light and home decor.',
      knDesc: 'ನೈಸರ್ಗಿಕ ಜೇಡಿಮಣ್ಣಿನಲ್ಲಿ ಕೈಯಿಂದಲೇ ಆಕಾರ ನೀಡಿ ಸುಟ್ಟ ಪವಿತ್ರ ದೀಪ.',
      hiDesc: 'मिट्टी से हाथ से गढ़ा गया सुंदर और पर्यावरण-अनुकूल पारंपरिक दीया।',
    },
    paintings: {
      enTitle: 'Traditional Mysore Gold Foil Ganjifa Painting',
      knTitle: 'ಮೈಸೂರು ಸಾಂಪ್ರದಾಯಿಕ ಬಂಗಾರದ ಎಲೆಯ ಚಿತ್ರಕಲೆ',
      hiTitle: 'मैसूर पारंपरिक स्वर्ण पत्र चित्रकला',
      materials: ['Handmade Cotton Rag Paper', '24K Gold Leaf Foil', 'Mineral Pigments'],
      dimensions: '12" x 16" Framed Art',
      highlights: ['24K Real Gold Emboss Work', 'Mineral Earth Pigments', 'Collector Heritage Art Piece'],
      priceMin: 2800,
      priceMax: 4500,
      enDesc: 'Classical traditional painting rendered with gesso relief embossing and authentic gold leaf detailing.',
      knDesc: 'ನೈಸರ್ಗಿಕ ಖನಿಜ ಬಣ್ಣಗಳು ಮತ್ತು ಶುದ್ಧ ಬಂಗಾರದ ಎಲೆಯಿಂದ ರಚಿಸಿದ ಐತಿಹಾಸಿಕ ಮೈಸೂರು ಚಿತ್ರಕಲೆ.',
      hiDesc: 'प्राकृतिक रंगों और असली सोने के वर्क से सजी पारंपरिक मैसूर पेंटिंग।',
    },
    metalcraft: {
      enTitle: 'Bidriware Silver Inlay Ornamental Plate',
      knTitle: 'ಬಿದ್ರಿ ಕಲೆಯ ಬೆಳ್ಳಿಯ ಕೆತ್ತನೆಯ ಅಲಂಕಾರಿಕ ತಟ್ಟೆ',
      hiTitle: 'बिद्रीवेयर चांदी की नक्काशी वाली सजावटी थाली',
      materials: ['Zinc-Copper Alloy', 'Pure 99.9% Silver Wire'],
      dimensions: '8" Diameter Wall Plaque',
      highlights: ['Deep Velvety Black Patina', 'Pure Silver Inlay Craftsmanship', 'Exclusive GI Heritage of Bidar'],
      priceMin: 2400,
      priceMax: 3800,
      enDesc: 'Centuries-old Persian-Indian metal art with pure silver wire hand-hammered into blackened alloy surface.',
      knDesc: 'ಕಪ್ಪು ಬಣ್ಣದ ಮಿಶ್ರಲೋಹದ ಮೇಲೆ ಶುದ್ಧ ಬೆಳ್ಳಿಯ ತಂತಿಯನ್ನು ಕೆತ್ತಿ ಮಾಡಿದ ವಿಶ್ವವಿಖ್ಯಾತ ಬಿದ್ರಿ ಕಲೆ.',
      hiDesc: 'शुद्ध चांदी के तारों की बारीक जड़ाई वाली ऐतिहासिक बिद्री कलाकृति।',
    },
  };

  const selected = categoryData[cat] || categoryData.baskets;
  const isKn = lang === 'kn';
  const isHi = lang === 'hi';

  const title = isKn ? selected.knTitle : isHi ? selected.hiTitle : selected.enTitle;
  const description = isKn ? selected.knDesc : isHi ? selected.hiDesc : selected.enDesc;

  return {
    title,
    category: (cat as CraftCategory) || 'other',
    description: req.rawArtisanNotes ? `${description} (${req.rawArtisanNotes})` : description,
    materials: selected.materials,
    dimensions: selected.dimensions,
    highlights: selected.highlights,
    careInstructions: 'Handle with care. Clean gently with a soft dry cloth. Keep away from harsh chemicals.',
    suggestedTags: [cat, 'Handmade', 'Eco-friendly', 'Authentic Heritage', 'Artisan Craft'],
    suggestedPriceMin: selected.priceMin,
    suggestedPriceMax: selected.priceMax,
    translations: {
      en: {
        title: selected.enTitle,
        description: selected.enDesc,
        highlights: selected.highlights,
        careInstructions: 'Wipe with soft clean cloth. Avoid harsh chemicals.',
      },
      hi: {
        title: selected.hiTitle,
        description: selected.hiDesc,
      },
      kn: {
        title: selected.knTitle,
        description: selected.knDesc,
      },
      ta: {
        title: `${selected.enTitle} (பாரம்பரிய கைவினை)`,
        description: `பாரம்பரிய நுட்பங்களுடன் கைவினைஞர்களால் உருவாக்கப்பட்ட அசல் தயாரிப்பு.`,
      },
      te: {
        title: `${selected.enTitle} (సాంప్రదాయ కళారూపం)`,
        description: `సంప్రదాయ నైపుణ్యాలతో చేతితో తయారు చేయబడిన ప్రామాణిక కళాఖండం.`,
      },
      fr: {
        title: `${selected.enTitle} Artisanal`,
        description: `Pièce d'artisanat traditionnel authentique fabriquée à la main en Inde.`,
      },
      es: {
        title: `${selected.enTitle} Artesanal`,
        description: `Pieza artesanal tradicional auténtica hecha a mano en la India.`,
      },
    },
  };
}

/**
 * Translates artisan text into any chosen target language using Gemini.
 */
export async function translateArtisanText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<{ translatedText: string }> {
  if (!text || !text.trim()) {
    return { translatedText: '' };
  }

  const targetLangName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
  const sourceLangName = sourceLanguage ? (LANGUAGE_NAMES[sourceLanguage] || sourceLanguage) : 'any language';

  return callGeminiWithFallback(
    'translateArtisanText',
    async (ai, modelName) => {
      const prompt = `Translate the following craft notes accurately and naturally from ${sourceLangName} to ${targetLangName}. 
Preserve the artisanal, handmade craft terminology, tone, and cultural nuance.
Return strictly a JSON object with key "translatedText".

Text to translate:
"${text}"`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              translatedText: { type: Type.STRING },
            },
            required: ['translatedText'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return { translatedText: parsed.translatedText || text };
    },
    () => {
      return { translatedText: text };
    }
  );
}

