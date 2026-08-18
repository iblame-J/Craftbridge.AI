import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { DEMO_ARTISANS, DEMO_PRODUCTS } from './src/data/demoData.ts';
import { 
  generateProductListing, 
  calculateSmartPricing, 
  generateArtisanStory, 
  talkToCraftBridgeAssistant,
  translateArtisanText
} from './server/gemini.ts';
import { Product, Artisan, Order } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload size for base64 craft photos
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// In-memory persistent state (seeded with authentic demo artisans and crafts)
let productsStore: Product[] = [...DEMO_PRODUCTS];
let artisansStore: Artisan[] = [...DEMO_ARTISANS];
let ordersStore: Order[] = [
  {
    id: 'ord-101',
    buyerId: 'buyer-demo-1',
    buyerName: 'Priya Sharma (Bengaluru)',
    buyerEmail: 'priya@example.com',
    sellerId: 'artisan-1',
    sellerName: 'Basavanna Gowda',
    items: [
      {
        product: DEMO_PRODUCTS[0],
        quantity: 1,
        selectedLanguageTitle: DEMO_PRODUCTS[0].title,
        priceAtPurchase: DEMO_PRODUCTS[0].price,
      },
    ],
    totalAmount: DEMO_PRODUCTS[0].price,
    currency: 'INR',
    status: 'Confirmed',
    createdAt: '2026-08-16T15:20:00Z',
    shippingAddress: {
      fullName: 'Priya Sharma',
      addressLine: '42 Indiranagar 100ft Road',
      city: 'Bengaluru',
      postalCode: '560038',
      country: 'India',
    },
  },
  {
    id: 'ord-102',
    buyerId: 'buyer-intl-1',
    buyerName: 'Claire Laurent (Paris, France)',
    buyerEmail: 'claire.laurent@example.fr',
    sellerId: 'artisan-3',
    sellerName: 'Ratna Pathak',
    items: [
      {
        product: DEMO_PRODUCTS[2],
        quantity: 2,
        selectedLanguageTitle: DEMO_PRODUCTS[2].translations.en?.title || DEMO_PRODUCTS[2].title,
        priceAtPurchase: DEMO_PRODUCTS[2].price,
      },
    ],
    totalAmount: DEMO_PRODUCTS[2].price * 2,
    currency: 'INR',
    status: 'Shipped',
    createdAt: '2026-08-15T08:45:00Z',
    shippingAddress: {
      fullName: 'Claire Laurent',
      addressLine: '14 Rue de Rivoli',
      city: 'Paris',
      postalCode: '75004',
      country: 'France',
    },
  },
];

/* -------------------------------------------------------------
 * API ROUTES
 * ------------------------------------------------------------- */

// Health & System Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CraftBridge AI',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    productsCount: productsStore.length,
    artisansCount: artisansStore.length,
    ordersCount: ordersStore.length,
  });
});

// Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sellerId, verifiedOnly } = req.query;
  let results = [...productsStore];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }
  if (sellerId) {
    results = results.filter(p => p.sellerId === sellerId);
  }
  if (verifiedOnly === 'true') {
    results = results.filter(p => p.verification?.isVerified);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSeller = p.sellerName.toLowerCase().includes(q);
      const matchRegion = p.sellerRegion.toLowerCase().includes(q);
      const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
      const matchTrans = Object.values(p.translations).some(
        t => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
      return matchTitle || matchDesc || matchSeller || matchRegion || matchTags || matchTrans;
    });
  }

  res.json({ success: true, products: results });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = productsStore.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    inStock: req.body.inStock !== false,
    stockCount: req.body.stockCount || 10,
  };

  // Prepend to list so newly created items appear first
  productsStore.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const idx = productsStore.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  const deleted = productsStore.splice(idx, 1)[0];
  res.json({ success: true, deletedProduct: deleted });
});

// Artisans API
app.get('/api/artisans', (req: Request, res: Response) => {
  res.json({ success: true, artisans: artisansStore });
});

app.get('/api/artisans/:id', (req: Request, res: Response) => {
  const artisan = artisansStore.find(a => a.id === req.params.id);
  if (!artisan) {
    return res.status(404).json({ success: false, error: 'Artisan not found' });
  }
  res.json({ success: true, artisan });
});

app.put('/api/artisans/:id', (req: Request, res: Response) => {
  const idx = artisansStore.findIndex(a => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Artisan not found' });
  }
  artisansStore[idx] = { ...artisansStore[idx], ...req.body };
  res.json({ success: true, artisan: artisansStore[idx] });
});

// Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const { sellerId, buyerId } = req.query;
  let results = [...ordersStore];

  if (sellerId) {
    results = results.filter(o => o.sellerId === sellerId);
  }
  if (buyerId) {
    results = results.filter(o => o.buyerId === buyerId);
  }

  res.json({ success: true, orders: results });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const newOrder: Order = {
    ...req.body,
    id: `ord-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
  };
  ordersStore.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// AI Service: Describe Craft Product (Vision + Multilingual generation)
app.post('/api/ai/describe-product', async (req: Request, res: Response) => {
  try {
    const listing = await generateProductListing(req.body);
    res.json({ success: true, listing });
  } catch (err: any) {
    console.error('Error generating AI listing:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate product listing' });
  }
});

// AI Service: Smart Pricing Assistant
app.post('/api/ai/smart-pricing', async (req: Request, res: Response) => {
  try {
    const pricing = await calculateSmartPricing(req.body);
    res.json({ success: true, pricing });
  } catch (err: any) {
    console.error('Error in smart pricing:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to calculate smart price' });
  }
});

// AI Service: Artisan Story Generator ("Tell My Story")
app.post('/api/ai/artisan-story', async (req: Request, res: Response) => {
  try {
    const story = await generateArtisanStory(req.body);
    res.json({ success: true, story });
  } catch (err: any) {
    console.error('Error generating artisan story:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate artisan story' });
  }
});

// AI Service: Instant Text Translation (Artisan notes translation)
app.post('/api/ai/translate-text', async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;
    const result = await translateArtisanText(text || '', targetLanguage || 'en', sourceLanguage);
    res.json({ success: true, translatedText: result.translatedText });
  } catch (err: any) {
    console.error('Error translating text:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to translate text', translatedText: req.body?.text || '' });
  }
});

// AI Service: Conversational Voice & Text Assistant ("Talk to CraftBridge")
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  try {
    const { message, language, role, currentView } = req.body;
    const reply = await talkToCraftBridgeAssistant(
      message || '',
      language || 'en',
      role || 'seller',
      currentView
    );
    res.json({ success: true, ...reply });
  } catch (err: any) {
    console.error('Error in AI assistant:', err);
    res.status(500).json({ 
      success: false, 
      text: 'I encountered an error understanding your request. Please try again.' 
    });
  }
});

// AI Service: Seller Marketing Tips & Buyer Replies
app.post('/api/ai/marketing', async (req: Request, res: Response) => {
  const { craftCategory, language } = req.body;
  const tips = language === 'kn' ? [
    'ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುವನ್ನು ನೈಸರ್ಗಿಕ ಸೂರ್ಯನ ಬೆಳಕಿನಲ್ಲಿ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    'ವಸ್ತುವಿನ ನೈಸರ್ಗಿಕ ಮತ್ತು ಪರಿಸರ ಸ್ನೇಹಿ ಗುಣವನ್ನು ಖರೀದಿದಾರರಿಗೆ ತಿಳಿಸಿ.',
    'ನೀವು ಇದನ್ನು ಮಾಡಲು ಎಷ್ಟು ಪ್ರೀತಿ ಮತ್ತು ಸಮಯ ಹಾಕಿದ್ದೀರಿ ಎಂಬುದನ್ನು ಹೇಳಿ.'
  ] : language === 'hi' ? [
    'अपने हस्तशिल्प की तस्वीर प्राकृतिक रोशनी में लें।',
    'खरीदारों को बताएं कि यह 100% पर्यावरण-अनुकूल और टिकाऊ है।',
    'अपनी पुश्तैनी कला की विशेषता साझा करें।'
  ] : [
    'Take clear photos near a window in natural soft morning light.',
    'Highlight the plastic-free, 100% handmade authentic heritage value.',
    'Share how many days or hours of patient handcrafting went into this piece.'
  ];

  res.json({ success: true, tips });
});

/* -------------------------------------------------------------
 * VITE & SERVER STARTUP
 * ------------------------------------------------------------- */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ CraftBridge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
