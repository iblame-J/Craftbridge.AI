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
 * Generates an accessible, rich craft product listing from photo or notes.
 */
export async function generateProductListing(
  req: AiListingGenerationRequest
): Promise<AiListingGenerationResponse> {
  const ai = getGeminiClient();
  const targetLang = req.language || 'en';
  const targetLangName = LANGUAGE_NAMES[targetLang] || 'English';

  if (!ai) {
    return getFallbackListing(req);
  }

  try {
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
      // Clean base64 prefix if present
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
      model: 'gemini-3.7-flash',
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
  } catch (error) {
    console.warn('Gemini listing generation failed, using fallback:', error);
    return getFallbackListing(req);
  }
}

/**
 * Smart Pricing Assistant calculation & explanation
 */
export async function calculateSmartPricing(req: AiPricingRequest): Promise<AiPricingResponse> {
  const ai = getGeminiClient();
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

  if (!ai) {
    return {
      fairPrice: fairBase,
      minPrice,
      maxPrice,
      explanation: `Based on your material cost of ₹${req.materialCost} and ${req.hoursSpent} hours of craftsmanship, a fair selling price is ₹${minPrice} – ₹${maxPrice}. This ensures you earn a respectful living wage plus materials.`,
      breakdownSummary: [
        `Raw Materials: ₹${req.materialCost}`,
        `Artisan Time: ${req.hoursSpent} hrs @ ₹${baseLaborRatePerHour}/hr (₹${laborCost})`,
        `${req.isHeritageCraft ? 'Heritage Craft Value Multiplier included' : 'Standard Craft'}`
      ],
    };
  }

  try {
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
      model: 'gemini-3.7-flash',
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
  } catch (error) {
    console.warn('Smart pricing AI explanation failed, using fallback:', error);
    return {
      fairPrice: fairBase,
      minPrice,
      maxPrice,
      explanation: `Based on your material cost of ₹${req.materialCost} and ${req.hoursSpent} hours of work, a fair selling price is ₹${minPrice} – ₹${maxPrice}.`,
      breakdownSummary: [
        `Raw materials: ₹${req.materialCost}`,
        `Artisan labor: ${req.hoursSpent} hrs`,
        `Fair profit included`,
      ],
    };
  }
}

/**
 * Artisan Story Generator: transforms raw spoken transcript into authentic story.
 */
export async function generateArtisanStory(req: AiStoryRequest): Promise<AiStoryResponse> {
  const ai = getGeminiClient();
  const langName = LANGUAGE_NAMES[req.language] || 'English';

  if (!ai) {
    return {
      storyInNativeLanguage: req.rawSpokenText,
      storyEnglish: `Artisan ${req.artisanName} crafts traditional ${req.craftCategory} from ${req.region}. ${req.rawSpokenText}`,
      translations: {
        en: `Artisan ${req.artisanName} crafts traditional ${req.craftCategory} from ${req.region}. ${req.rawSpokenText}`,
        hi: `${req.artisanName} ${req.region} से पारंपरिक कारीगर हैं।`,
        kn: `${req.artisanName} ಅವರು ${req.region} ನ ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿ.`,
      },
      suggestedTagline: `Master Artisan from ${req.region}`,
    };
  }

  try {
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
      model: 'gemini-3.7-flash',
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
  } catch (error) {
    console.warn('Story generation error:', error);
    return {
      storyInNativeLanguage: req.rawSpokenText,
      storyEnglish: `Artisan ${req.artisanName} from ${req.region}: ${req.rawSpokenText}`,
      translations: { en: req.rawSpokenText },
      suggestedTagline: `Artisan from ${req.region}`,
    };
  }
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
  const ai = getGeminiClient();
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

  if (!ai) {
    return {
      text: userLanguage === 'kn'
        ? `ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು "ನನ್ನ ಉತ್ಪನ್ನಗಳನ್ನು ತೋರಿಸಿ", "ಹೊಸ ವಸ್ತು ಸೇರಿಸಿ", ಅಥವಾ "ಬೆಲೆ ನಿರ್ಧರಿಸಿ" ಎಂದು ಹೇಳಬಹುದು.`
        : userLanguage === 'hi'
        ? `मैं आपकी सहायता के लिए हूँ। आप "उत्पाद जोड़ें", "कीमत तय करें", या "ऑर्डर देखें" कह सकते हैं।`
        : `I'm here to help you! You can ask me to "Show my products", "Upload a new craft", "Help me choose a price", or search for crafts.`,
      actionSuggestion,
    };
  }

  try {
    const systemInstruction = `You are CraftBridge Assistant, a friendly, ultra-clear voice assistant for an accessible global artisan craft app.
The user is a ${userRole} speaking ${langName}.
Current screen: ${currentView || 'Home'}.
Always reply in ${langName}.
Keep responses under 3 short sentences.
Avoid complicated technical or e-commerce jargon.
Explain things simply and warmly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: message,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: 1 as any },
      },
    });

    return {
      text: response.text || 'I am here to guide you through CraftBridge.',
      actionSuggestion,
    };
  } catch (error) {
    console.warn('AI Assistant error:', error);
    return {
      text: `I heard: "${message}". Let me help you navigate!`,
      actionSuggestion,
    };
  }
}

// Deterministic fallback listing helper
function getFallbackListing(req: AiListingGenerationRequest): AiListingGenerationResponse {
  const isBaskets = req.craftCategory === 'baskets' || req.rawArtisanNotes?.includes('ಬುಟ್ಟಿ') || req.rawArtisanNotes?.includes('टोकरी');
  const isPottery = req.craftCategory === 'pottery' || req.rawArtisanNotes?.includes('मिट्टी') || req.rawArtisanNotes?.includes('ಪಾತ್ರೆ');
  const isSilk = req.craftCategory === 'textiles' || req.rawArtisanNotes?.includes('ಸೀರೆ') || req.rawArtisanNotes?.includes('साड़ी');

  if (isBaskets) {
    return {
      title: req.language === 'kn' ? 'ಕೈಯಿಂದ ಹೆಣೆದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನ ಬುಟ್ಟಿ' : req.language === 'hi' ? 'हस्तनिर्मित प्राकृतिक बांस की टोकरी' : 'Handwoven Forest Bamboo Basket',
      category: 'baskets',
      description: req.language === 'kn' 
        ? 'ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಕೈಯಲ್ಲೇ ಸೀಳಿ ಹೆಣೆದ ಪರಿಸರ ಸ್ನೇಹಿ ಬುಟ್ಟಿ. ಹಣ್ಣು ತರಕಾರಿ ಅಥವಾ ಗೃಹ ಸಾಮಗ್ರಿ ಇಡಲು ಅತ್ಯುತ್ತಮ.' 
        : 'Natural split bamboo handcrafted basket woven with traditional interlocking cane technique.',
      materials: ['Forest Bamboo', 'Natural Cane Fibers'],
      dimensions: '11" Diameter x 8" Height',
      highlights: ['100% Eco-Friendly & Plastic-Free', 'Durable Multi-weave', 'Traditional Handcraft'],
      careInstructions: 'Wipe with dry cloth. Air dry in shade.',
      suggestedTags: ['Bamboo Basket', 'Handmade', 'Eco-friendly', 'Traditional Craft'],
      suggestedPriceMin: 850,
      suggestedPriceMax: 1200,
      translations: {
        en: {
          title: 'Handwoven Forest Bamboo Basket',
          description: 'Authentic split bamboo storage basket hand-woven by rural artisans using sustainably harvested natural bamboo.',
          highlights: ['100% Biodegradable', 'Reinforced Weave Structure'],
          careInstructions: 'Wipe with dry cloth.'
        },
        hi: {
          title: 'हस्तनिर्मित प्राकृतिक बांस की टोकरी',
          description: 'प्राकृतिक बांस से हाथ से बुनी गई टिकाऊ टोकरी।',
        },
        kn: {
          title: 'ಕೈಯಿಂದ ಹೆಣೆದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನ ಬುಟ್ಟಿ',
          description: 'ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಹೆಣೆದ ಪರಿಸರ ಸ್ನೇಹಿ ಗೃಹೋಪಯೋಗಿ ಬುಟ್ಟಿ.',
        }
      }
    };
  }

  return {
    title: req.language === 'kn' ? 'ನೈಜ ಕೈಯಿಂದ ಮಾಡಿದ ಕಲಾಕೃತಿ' : req.language === 'hi' ? 'पारंपरिक हस्तनिर्मित कला उत्पाद' : 'Traditional Handcrafted Artisan Item',
    category: req.craftCategory || 'other',
    description: req.rawArtisanNotes || 'Authentic handmade craft lovingly created using traditional generational skills.',
    materials: ['Natural raw materials', 'Herbal dyes'],
    dimensions: 'Standard Handmade Dimensions',
    highlights: ['100% Handmade', 'Empowering Rural Artisans', 'Cultural Heritage'],
    careInstructions: 'Handle with care. Clean with soft cloth.',
    suggestedTags: ['Handmade', 'Authentic', 'Artisan Craft', 'Eco-friendly'],
    suggestedPriceMin: 900,
    suggestedPriceMax: 1300,
    translations: {
      en: {
        title: 'Traditional Handcrafted Artisan Item',
        description: 'Authentic handmade item crafted with traditional artisanal techniques.',
      },
      hi: {
        title: 'पारंपरिक हस्तनिर्मित कला उत्पाद',
        description: 'कारीगर द्वारा प्रेमपूर्वक तैयार किया गया असली हस्तशिल्प।',
      },
      kn: {
        title: 'ನೈಜ ಕೈಯಿಂದ ಮಾಡಿದ ಕಲಾಕೃತಿ',
        description: 'ಕುಶಲಕರ್ಮಿಗಳು ತಮ್ಮ ಕೈಯಾರೆ ತಯಾರಿಸಿದ ನೈಜ ಕರಕುಶಲ ವಸ್ತು.',
      }
    }
  };
}
