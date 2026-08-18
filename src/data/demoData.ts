import { Artisan, Product } from '../types';

export const DEMO_ARTISANS: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Basavanna Gowda',
    nativeName: 'ಬಸವಣ್ಣ ಗೌಡ',
    craftType: 'baskets',
    craftTypeName: 'Handwoven Bamboo & Cane Craft',
    region: 'Mysuru',
    state: 'Karnataka',
    language: 'kn',
    photoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 32,
    generation: '4th Generation Bamboo Artisan',
    verified: true,
    rating: 4.9,
    salesCount: 148,
    story: 'ನಾನು ಮೈಸೂರಿನ ಹುಣಸೂರು ಬಳಿಯ ಸಣ್ಣ ಹಳ್ಳಿಯಲ್ಲಿ ಹುಟ್ಟಿ ಬೆಳೆದವನು. ನನ್ನ ತಾತ ಮತ್ತು ತಂದೆಯಿಂದ ಬಿದಿರಿನ ಬುಟ್ಟಿ ನೇಯ್ಗೆ ಕಲಿತೆ. ಕಾಡಿನ ನೈಸರ್ಗಿಕ ಬಿದಿರು ಬಳಸಿ ಯಾವುದೇ ಪ್ಲಾಸ್ಟಿಕ್ ಇಲ್ಲದೆ ಪರಿಸರ ಸ್ನೇಹಿ ಗೃಹೋಪಯೋಗಿ ಬುಟ್ಟಿಗಳನ್ನು ಹೆಣೆಯುತ್ತೇವೆ.',
    storyOriginalLanguage: 'kn',
    storyTranslations: {
      en: 'I was born and raised near Hunsur, Mysuru. I learned the craft of bamboo weaving from my grandfather and father. We harvest natural bamboo to create 100% eco-friendly, plastic-free storage baskets and homeware built to last decades.',
      hi: 'मैं मैसूर के पास हुंसूर में पला-बढ़ा हूँ। मैंने अपने दादा और पिता से बांस की बुनाई सीखी। हम बिना किसी प्लास्टिक के 100% पर्यावरण-अनुकूल टिकाऊ टोकरियाँ बनाते हैं।',
      ta: 'நான் மைசூரு அருகே ஹுன்சூரில் வளர்ந்தேன். மூங்கில் கூடை நெசவை என் தாத்தாவிடமிருந்து கற்றுக்கொண்டேன். பிளாஸ்டிக் இல்லாத சூழல் நட்பு கூடைகளை உருவாக்குகிறோம்.',
      te: 'నేను మైసూరు సమీపంలో పెరిగాను. నా తాత, తండ్రి నుండి వెదురు బుట్టల నేత నేర్చుకున్నాను. సహజమైన వెదురుతో దృఢమైన పర్యావరణ హిత బుట్టలు తయారు చేస్తాం.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Traditional Mysuru Bamboo Split & Interlace Weave',
      yearsOfPractice: 32,
      regionOfOrigin: 'Mysuru, Karnataka, India',
      workshopAddress: 'Artisan Colony, Hunsur Taluk, Mysuru 571105',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Karnataka Handicrafts Development Board (KHDC)',
      verificationDate: '2025-11-14',
      verificationCriteriaMet: [
        'Physical workshop inspected and geo-verified',
        'Traditional raw material sourcing documented',
        '100% handmade mastercraft lineage confirmed',
        'Registered state handicraft artisan ID #KHDC-8842'
      ],
    },
  },
  {
    id: 'artisan-2',
    name: 'Sitara Devi & Rameshwar',
    nativeName: 'सितारा देवी और रामेश्वर',
    craftType: 'textiles',
    craftTypeName: 'Banarasi Handloom Silk Weaving',
    region: 'Varanasi',
    state: 'Uttar Pradesh',
    language: 'hi',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 38,
    generation: '5th Generation Kashi Weaver',
    verified: true,
    rating: 5.0,
    salesCount: 230,
    story: 'काशी की पुरानी गलियों में हमारा परिवार पिछले पांच पीढ़ियों से शुद्ध रेशम और सोने-चांदी के तारों से बनारसी साड़ियां तैयार करता आ रहा है। एक साड़ी बनाने में 15 से 25 दिन का अथक परिश्रम लगता है।',
    storyOriginalLanguage: 'hi',
    storyTranslations: {
      en: 'In the heritage alleys of sacred Kashi, our family has woven pure mulberry silk Banarasi sarees with real zari threads for five generations. Each saree takes 15 to 25 days of dedicated pit-loom handcrafting.',
      kn: 'ಕಾಶಿ ನಗರದಲ್ಲಿ ನಮ್ಮ ಕುಟುಂಬವು 5 ತಲೆಮಾರುಗಳಿಂದ ಶುದ್ಧ ರೇಷ್ಮೆ ಬನಾರಸಿ ಸೀರೆಗಳನ್ನು ಕೈಮಗ್ಗದಲ್ಲಿ ನೇಯ್ಯುತ್ತಿದೆ. ಒಂದು ಸೀರೆ ಮಾಡಲು 20 ದಿನಗಳ ಪರಿಶ್ರಮ ಬೇಕು.',
      ta: 'காசியில் 5 தலைமுறைகளாக எங்கள் குடும்பம் தூய பட்டு பனாரசி புடவைகளை நெய்கிறது. ஒரு புடவை செய்ய 20 நாட்கள் ஆகும்.',
      te: 'కాశీలో 5 తరాలుగా మా కుటుంబం చేనేత పట్టు బనారసీ చీరలను తయారు చేస్తోంది. ప్రతి చీరను నేయడానికి 20 రోజులు పడుతుంది.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Kadwa Pit-Loom Silk Jacquard Weaving',
      yearsOfPractice: 38,
      regionOfOrigin: 'Varanasi, Uttar Pradesh, India',
      workshopAddress: 'Madanpura Handloom Cluster, Varanasi 221001',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Silk Mark Organisation of India & Varanasi Weavers Guild',
      verificationDate: '2025-08-20',
      verificationCriteriaMet: [
        'Silk Mark & Handloom Mark Certified',
        'Master Weaver Guild Certificate #VAR-4412',
        'GI Tag Authenticated Banarasi Brocade Producer',
        'Zero synthetic yarn test certified'
      ],
    },
  },
  {
    id: 'artisan-3',
    name: 'Ratna Pathak',
    nativeName: 'रत्ना पाठक',
    craftType: 'pottery',
    craftTypeName: 'Traditional Jaipur Blue Pottery',
    region: 'Jaipur',
    state: 'Rajasthan',
    language: 'hi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 24,
    generation: 'Master Potter & Artisan Guild Lead',
    verified: true,
    rating: 4.85,
    salesCount: 185,
    story: 'जयपुर की नीली मिट्टी के बर्तन क्ले (मिट्टी) से नहीं, बल्कि पिसे हुए क्वार्ट्ज, गोंद और मुल्तानी मिट्टी के मिश्रण से बनते हैं। हमारे कोबाल्ट नीले रंग 100% प्राकृतिक खनिजों से आते हैं।',
    storyOriginalLanguage: 'hi',
    storyTranslations: {
      en: 'Jaipur Blue Pottery is unique because it is made without standard clay, using powdered quartz stone, glass, and natural gum. Hand-painted with cobalt blue mineral glaze and fired in wood kilns.',
      kn: 'ಜೈಪುರದ ಪ್ರಸಿದ್ಧ ನೀಲಿ ಕುಂಬಾರಿಕೆ ಮಣ್ಣಿನಿಂದಲ್ಲ, ನೈಸರ್ಗಿಕ ಕ್ವಾರ್ಟ್ಜ್ ಕಲ್ಲಿನ ಪುಡಿಯಿಂದ ತಯಾರಾಗುತ್ತದೆ. ನೈಸರ್ಗಿಕ ನೀಲಿ ಬಣ್ಣದಿಂದ ಕೈಯಲ್ಲೇ ಚಿತ್ರಿಸಲಾಗುತ್ತದೆ.',
      ta: 'ஜெய்ப்பூர் ப்ளூ பாட்டரி குவார்ட்ஸ் கல் மற்றும் இயற்கை தாதுக்களால் கைகளால் வரையப்பட்டு உருவாக்கப்படுகிறது.',
      te: 'జైపూర్ బ్లూ పాట్టీ ప్రత్యేకమైన క్వార్ట్జ్ రాతి పొడి మరియు సహజ రంగులతో తయారు చేస్తారు.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Turko-Persian Glazed Quartz Blue Pottery',
      yearsOfPractice: 24,
      regionOfOrigin: 'Jaipur, Rajasthan, India',
      workshopAddress: 'Sanganer Crafts Enclave, Jaipur 302029',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Rajasthan State Handicrafts Development Corporation',
      verificationDate: '2025-09-12',
      verificationCriteriaMet: [
        'Geographical Indication (GI) Registered Artisan #RAJ-GI-POT-102',
        'Lead-free food-safe glaze certified',
        'Hand-turned pottery workshop inspected'
      ],
    },
  },
  {
    id: 'artisan-4',
    name: 'Venkat Rao',
    nativeName: 'వెంకట రావు',
    craftType: 'toys',
    craftTypeName: 'Kondapalli Traditional Wooden Toys',
    region: 'Kondapalli, Vijayawada',
    state: 'Andhra Pradesh',
    language: 'te',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 29,
    generation: '3rd Generation Toy Carver',
    verified: true,
    rating: 4.95,
    salesCount: 310,
    story: 'కొండపల్లి అడవుల్లో దొరికే తేలికపాటి తెల్ల పొనికి చెక్కతో మేము ఈ సాంప్రదాయ బొమ్మలను చెక్కుతాము. సహజమైన చింతపిక్కల జిగురు మరియు కూరగాయల రంగులు పూస్తాము. ఇది పిల్లలకు 100% సురక్షితం.',
    storyOriginalLanguage: 'te',
    storyTranslations: {
      en: 'We hand-carve Kondapalli wooden toys using soft, lightweight Tella Poniki wood sustainably harvested from local hills. Joined with tamarind seed glue and painted with non-toxic herbal colors.',
      kn: 'ಕೊಂಡಪಲ್ಲಿಯ ಸಾಂಪ್ರದಾಯಿಕ ಮರದ ಆಟಿಕೆಗಳನ್ನು ನೈಸರ್ಗಿಕ ಮರ ಮತ್ತು ಗಿಡಮೂಲಿಕೆಗಳ ಬಣ್ಣಗಳಿಂದ ಕೈಯಲ್ಲೇ ಕೆತ್ತುತ್ತೇವೆ. ಮಕ್ಕಳಿಗೆ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ.',
      hi: 'कोंडापल्ली लकड़ी के खिलौने नरम तेल्ला पोनिकी लकड़ी से तराशे जाते हैं और प्राकृतिक वनस्पति रंगों से रंगे जाते हैं।',
      ta: 'கொண்டபல்லி மர பொம்மைகள் இலகுவான மரத்தால் செதுக்கப்பட்டு இயற்கை வண்ணங்களால் வரையப்படுகின்றன.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Kondapalli Bommalu Indigenous Wood Carving',
      yearsOfPractice: 29,
      regionOfOrigin: 'Kondapalli, Andhra Pradesh, India',
      workshopAddress: 'Killa Street, Kondapalli 521228',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Andhra Pradesh Handicrafts Development Corporation (LEPAKSHI)',
      verificationDate: '2025-10-05',
      verificationCriteriaMet: [
        'Registered Kondapalli Wooden Toy GI Producer #AP-GI-KND-55',
        'Certified non-toxic natural herbal dyes',
        'Heritage woodcraft guild membership'
      ],
    },
  },
  {
    id: 'artisan-5',
    name: 'Fatima Begum',
    nativeName: 'فاطمہ بیگم',
    craftType: 'embroidery',
    craftTypeName: 'Kashmiri Sozni Fine Needle Embroidery',
    region: 'Srinagar',
    state: 'Jammu & Kashmir',
    language: 'ur',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 27,
    generation: 'Master Needlewoman',
    verified: true,
    rating: 5.0,
    salesCount: 162,
    story: 'سری نگر کے پرانے شہر میں میں باریک سوئی سے کشمیری شالوں پر سوزنی کڑھائی کرتی ہوں۔ ایک پشمینہ شال کو روایتی چنار اور بادام کے نقش و نگار سے سجانے میں مہینوں لگتے ہیں۔',
    storyOriginalLanguage: 'ur',
    storyTranslations: {
      en: 'In old Srinagar, I practice fine single-needle Sozni embroidery on handspun mountain Pashmina wool. Rendering delicate Chinar leaves and paisley motifs takes months of patient, microscopic needlework.',
      kn: 'ಶ್ರೀನಗರದ ಸಾಂಪ್ರದಾಯಿಕ ಪಶ್ಮಿನಾ ಶಾಲುಗಳ ಮೇಲೆ ಸೂಕ್ಷ್ಮ ಸೂಜಿ ಕಸೂತಿ ಮಾಡುತ್ತೇನೆ. ನೈಸರ್ಗಿಕ ರೇಷ್ಮೆ ದಾರಗಳಿಂದ ತಿಂಗಳುಗಟ್ಟಲೆ ಕಷ್ಟಪಟ್ಟು ಮಾಡಲಾಗುತ್ತದೆ.',
      hi: 'श्रीनगर में मैं बारीक सुई से पश्मीना शॉल पर सोज़नी कढ़ाई करती हूँ। यह हाथ की बारीक कला महीनों में पूरी होती है।',
      ta: 'ஸ்ரீநகரின் மெல்லிய ஊசி எம்பிராய்டரி மூலம் பஷ்மினா சால்வைகளை உருவாக்குகிறேன்.',
      te: 'శ్రీనగర్ సాంప్రదాయ పష్మినా శాలువలపై సన్నని సూదితో అందమైన ఎంబ్రాయిడరీ చేస్తాను.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Kashmir Sozni Single-Needle Fine Craft',
      yearsOfPractice: 27,
      regionOfOrigin: 'Srinagar, Jammu & Kashmir, India',
      workshopAddress: 'Zadibal Craft Quarter, Srinagar 190011',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Craft Development Institute (CDI) Srinagar & Handloom Dept',
      verificationDate: '2025-07-19',
      verificationCriteriaMet: [
        'Certified Authentic 100% Handspun Pashmina GI Tested',
        'Direct Artisan Guild Membership #JK-CDI-311',
        'Zero Machine Embroidery Laboratory Audit'
      ],
    },
  },
  {
    id: 'artisan-6',
    name: 'Devubhai Vankar',
    nativeName: 'દેવુભાઈ વણકર',
    craftType: 'textiles',
    craftTypeName: 'Kutch Natural Ajrakh Block Print',
    region: 'Bhuj, Kutch',
    state: 'Gujarat',
    language: 'gu',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    yearsOfExperience: 35,
    generation: '6th Generation Block Printer',
    verified: true,
    rating: 4.9,
    salesCount: 275,
    story: 'અજરખ એ ૧૬ તબક્કાની પ્રાકૃતિક છાપકામ પદ્ધતિ છે. અમે કુદરતી ગળી (ઇન્ડિગો), હરડે અને દાડમની છાલમાંથી બનાવેલા રંગો વાપરીએ છીએ. હાથથી કોતરેલા લાકડાના બ્લોક વડે છાપીએ છીએ.',
    storyOriginalLanguage: 'gu',
    storyTranslations: {
      en: 'Ajrakh is an ancient 16-step resist dyeing craft using hand-carved teakwood blocks and 100% natural vegetable dyes like indigo, madder, and pomegranate peel.',
      kn: 'ಕಚ್‌ನ ಅಜ್ರಖ್ ಬ್ಲಾಕ್ ಪ್ರಿಂಟ್ 16 ಹಂತಗಳ ನೈಸರ್ಗಿಕ ಮುದ್ರಣ ಕಲೆಯಾಗಿದೆ. ಸಂಪೂರ್ಣ ನೈಸರ್ಗಿಕ ಗಿಡಮೂಲಿಕೆ ಬಣ್ಣಗಳನ್ನು ಬಳಸುತ್ತೇವೆ.',
      hi: 'अजरख 16 चरणों वाली प्राकृतिक ब्लॉक प्रिंटिंग है जो हाथ से बने लकड़ी के ठप्पों और प्राकृतिक नील से की जाती है।',
      ta: 'கட்ச் அஜ்ரக் இயற்கை வண்ணங்கள் மற்றும் மர அச்சு மூலம் துணிகளில் அச்சிடப்படுகிறது.',
      te: 'కచ్ అజ్రఖ్ సాంప్రదాయ చెక్క బ్లాక్ ప్రింటింగ్ మరియు సహజ రంగులతో తయారవుతుంది.',
    },
    verificationData: {
      isVerified: true,
      heritageTradition: 'Kutch Khatri Ajrakh Resist Dyeing',
      yearsOfPractice: 35,
      regionOfOrigin: 'Kutch, Gujarat, India',
      workshopAddress: 'Ajrakhpur Craft Village, Bhuj 370105',
      verificationBadge: 'Craft Verified',
      verifiedBy: 'Kutch Weavers & Artisans Association #GUJ-KTC-722',
      verificationDate: '2025-10-18',
      verificationCriteriaMet: [
        'Certified 100% Natural Dye Zero Synthetic Chemical Audit',
        'GI Registered Kutch Ajrakh Producer',
        'River & Sun Cured Verification on Site'
      ],
    },
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'artisan-1',
    sellerName: 'Basavanna Gowda',
    sellerRegion: 'Mysuru, Karnataka',
    sellerLanguage: 'kn',
    title: 'Handwoven Mysore Bamboo Storage Basket with Cane Lid',
    originalLanguage: 'kn',
    category: 'baskets',
    price: 1100,
    suggestedPriceMin: 950,
    suggestedPriceMax: 1250,
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'ಕೈಯಿಂದ ಸೀಳಿದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಹೆಣೆದ ಸುಂದರವಾದ ಶೇಖರಣಾ ಬುಟ್ಟಿ. ಹಣ್ಣುಗಳು, ಬಟ್ಟೆಗಳು ಅಥವಾ ಅಡುಗೆ ಮನೆಯ ವಸ್ತುಗಳನ್ನು ಇಡಲು ಅತ್ಯಂತ ಉಪಯುಕ್ತ ಮತ್ತು ಪರಿಸರ ಸ್ನೇಹಿ.',
    materials: ['Natural Forest Bamboo', 'Wild Cane Fiber', 'Natural Herbal Varnish'],
    dimensions: '12" Diameter x 10" Height',
    highlights: [
      '100% Biodegradable & Plastic-Free',
      'Interlaced double-wall strength lasting 15+ years',
      'Comfortable matching woven cane lid'
    ],
    careInstructions: 'Wipe with dry or damp cotton cloth. Keep away from continuous standing water.',
    shippingInfo: 'Packed in biodegradable corrugated straw box. Ships internationally in 4-7 days.',
    tags: ['Bamboo', 'Mysore Craft', 'Eco-friendly', 'Handwoven', 'Storage Basket'],
    inStock: true,
    stockCount: 14,
    createdAt: '2026-08-10T10:00:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[0].verificationData,
    translations: {
      en: {
        title: 'Handwoven Mysore Bamboo Storage Basket with Cane Lid',
        description: 'Exquisitely crafted handmade storage basket woven from fine split forest bamboo by master weaver Basavanna Gowda. Features an interlocking woven lid, perfect for organic fruit storage, pantry organization, or artisanal home decor.',
        highlights: [
          'Handmade from sustainably harvested forest bamboo',
          'Tight criss-cross weave provides sturdy structural support',
          'Naturally ventilated and resistant to indoor humidity'
        ],
        careInstructions: 'Wipe clean with a dry or lightly damp cloth. Air dry in shade if washed.'
      },
      hi: {
        title: 'मैसूर हस्तनिर्मित बांस की मजबूत स्टोरेज टोकरी (ढक्कन सहित)',
        description: 'प्राकृतिक जंगली बांस से हाथ से बुनी गई टिकाऊ और सुंदर टोकरी। फल, कपड़े या घरेलू सामान रखने के लिए एकदम उपयुक्त।',
        highlights: ['100% पर्यावरण-अनुकूल', 'मजबूत दोहरी बुनाई', 'प्राकृतिक बांस की खुशबू'],
        careInstructions: 'सूखे कपड़े से साफ करें।'
      },
      ta: {
        title: 'மைசூர் கைவினை மூங்கில் கூடை (மூடியுடன்)',
        description: 'இயற்கை மூங்கிலால் கைவினைஞரால் நெய்யப்பட்ட அழகான கூடைகள்.',
        highlights: ['சுற்றுச்சூழல் நட்பு', 'நீடித்து உழைக்கும் தரம்'],
        careInstructions: 'துணியால் துடைத்து பராமரிக்கவும்.'
      },
      te: {
        title: 'మైసూరు సాంప్రదాయ చేతితో అల్లిన వెదురు బుట్ట',
        description: 'సహజమైన వెదురుతో దృఢంగా అల్లిన బుట్ట. నిల్వ కోసం మరియు అలంకరణకు చాలా మంచిది.',
        highlights: ['100% పర్యావరణ హితం', 'బలమైన అల్లిక'],
        careInstructions: 'పొడి గుడ్డతో శుభ్రం చేయండి.'
      },
      fr: {
        title: 'Panier de Rangement en Bambou Tressé à la Main avec Couvercle',
        description: 'Fabriqué à la main à partir de bambou naturel par des artisans du Karnataka. Robuste, écologique et durable pour une décoration naturelle.',
        highlights: ['100% naturel et sans plastique', 'Tressage artisanal serré'],
        careInstructions: 'Nettoyer avec un chiffon sec ou légèrement humide.'
      },
      es: {
        title: 'Cesta de Almacenamiento de Bambú Hecha a Mano con Tapa',
        description: 'Cesta artesanal tejida con bambú natural de Mysore. Perfecta para decoración y almacenamiento sostenible.',
        highlights: ['100% ecológico y biodegradable', 'Tejido resistente de doble pared'],
        careInstructions: 'Limpiar con paño seco o húmedo.'
      }
    },
    pricingBreakdown: {
      materialCost: 350,
      hoursSpent: 6,
      hourlyRateEstimate: 120,
      recommendedMin: 950,
      recommendedMax: 1250,
      explanation: 'Materials cost ₹350, with 6 hours of skilled split-weaving labor (₹720) + master finishing margin. Fair suggested price is ₹1,100.'
    }
  },
  {
    id: 'prod-2',
    sellerId: 'artisan-2',
    sellerName: 'Sitara Devi & Rameshwar',
    sellerRegion: 'Varanasi, Uttar Pradesh',
    sellerLanguage: 'hi',
    title: 'Heritage Pure Katan Silk Banarasi Saree in Royal Crimson',
    originalLanguage: 'hi',
    category: 'textiles',
    price: 9500,
    suggestedPriceMin: 8800,
    suggestedPriceMax: 11000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'शुद्ध कातान रेशम पर हाथ से काढ़वा तकनीक से तैयार की गई शाही लाल बनारसी साड़ी। पारंपरिक मोर और बेल बूटी का काम।',
    materials: ['100% Pure Mulberry Katan Silk', 'Tested Metallic Zari Weft', 'Natural Botanical Dyes'],
    dimensions: '6.5 Meters (Includes unstitched blouse piece)',
    highlights: [
      'Silk Mark Certified Pure Mulberry Silk',
      'Authentic Kadwa handloom technique (no floating threads)',
      'Rich intricate floral zari pallu'
    ],
    careInstructions: 'Dry clean only. Store in soft breathable muslin cloth with camphor.',
    shippingInfo: 'Packed in traditional padded silk pouch inside rigid archival gift box. Insured global shipping.',
    tags: ['Banarasi Saree', 'Silk Mark', 'Handloom', 'Wedding Wear', 'Varanasi Weave'],
    inStock: true,
    stockCount: 5,
    createdAt: '2026-08-12T14:30:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[1].verificationData,
    translations: {
      en: {
        title: 'Heritage Pure Katan Silk Banarasi Saree in Royal Crimson',
        description: 'Handcrafted over 22 days on a traditional pit loom in Varanasi. Woven from 100% pure Mulberry Katan silk featuring exquisite Kadwa floral jaal motifs and an opulent zari border.',
        highlights: [
          'Certified Silk Mark 100% Pure Natural Mulberry Silk',
          'Kadwa bootis individually hand-woven without loose floats',
          'Passed down as a timeless bridal heirloom'
        ],
        careInstructions: 'Dry clean only. Air occasionally in shade; wrap in cotton or muslin cloth.'
      },
      kn: {
        title: 'ಶುದ್ಧ ರೇಷ್ಮೆ ಬನಾರಸಿ ರಾಯಲ್ ಕೆಂಪು ಸೀರೆ',
        description: 'ಕಾಶಿಯಲ್ಲಿ 22 ದಿನಗಳ ಕೈಮಗ್ಗದ ಪರಿಶ್ರಮದಿಂದ ನೇಯ್ದ ಶುದ್ಧ ರೇಷ್ಮೆ ಬನಾರಸಿ ಸೀರೆ. ಜರಿ ಬಾರ್ಡರ್ ಮತ್ತು ಸಿಲ್ಕ್ ಮಾರ್ಕ್ ದೃಢೀಕರಣ.',
        highlights: ['100% ಶುದ್ಧ ಸಿಲ್ಕ್ ಮಾರ್ಕ್ ರೇಷ್ಮೆ', 'ಪರಂಪರೆ ಕೈಮಗ್ಗ ವಿನ್ಯಾಸ'],
        careInstructions: 'ಡ್ರೈ ಕ್ಲೀನ್ ಮಾತ್ರ.'
      },
      ta: {
        title: 'பாரம்பரிய தூய பட்டு பனாரசி புடவை',
        description: 'வாரணாசியில் 22 நாட்கள் கைத்தறியில் நெய்யப்பட்ட தூய பட்டு புடவை.',
        highlights: ['சில்க் மார்க் சான்றிதழ்', 'உயர்தர ஜரி வேலைப்பாடு'],
        careInstructions: 'டிரை கிளீன் மட்டும்.'
      }
    },
    pricingBreakdown: {
      materialCost: 4200,
      hoursSpent: 48,
      hourlyRateEstimate: 95,
      recommendedMin: 8800,
      recommendedMax: 11000,
      explanation: 'Pure Katan silk yarn & zari cost ₹4,200, representing 48 hours of master artisan loom time. Recommended selling price is ₹9,500.'
    }
  },
  {
    id: 'prod-3',
    sellerId: 'artisan-3',
    sellerName: 'Ratna Pathak',
    sellerRegion: 'Jaipur, Rajasthan',
    sellerLanguage: 'hi',
    title: 'Jaipur Hand-Painted Cobalt Blue Pottery Floral Urn Vase',
    originalLanguage: 'hi',
    category: 'pottery',
    price: 1850,
    suggestedPriceMin: 1600,
    suggestedPriceMax: 2200,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'जयपुर की पारंपरिक नीली मिट्टी की कला से बना खूबसूरत फूलदान। प्राकृतिक कोबाल्ट और तांबे के रंगों से हाथ से सजाया गया।',
    materials: ['Quartz Stone Powder', 'Natural Gum', 'Cobalt Oxide Pigment', 'Lead-Free Glaze'],
    dimensions: '9.5" Height x 5" Diameter',
    highlights: [
      'Authentic non-clay quartz blue pottery technique',
      'Hand-painted botanical arabesque patterns',
      'Lead-free, watertight glazed interior'
    ],
    careInstructions: 'Wash gently with mild soap and sponge. Do not use abrasive scrubbers.',
    shippingInfo: 'Custom double-foam cocoon packaging for zero breakage guarantee worldwide.',
    tags: ['Blue Pottery', 'Jaipur Craft', 'Ceramics', 'Vase', 'Hand-painted'],
    inStock: true,
    stockCount: 18,
    createdAt: '2026-08-14T09:15:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[2].verificationData,
    translations: {
      en: {
        title: 'Jaipur Hand-Painted Cobalt Blue Pottery Floral Urn Vase',
        description: 'Authentic Jaipur Blue Pottery vase crafted from quartz powder and mineral frits. Hand-painted with traditional Persian-Rajasthani floral arabesques and high-fired to achieve its glass-like cobalt sheen.',
        highlights: [
          'Crafted through heritage non-clay quartz formulation',
          'Lead-free glazed finish, waterproof for fresh florals',
          'GI-tagged authentic Jaipur craft certification'
        ],
        careInstructions: 'Clean with lukewarm water and a soft sponge. Avoid abrasive cleansers.'
      },
      kn: {
        title: 'ಜೈಪುರ ಕೈಚಿತ್ರಿತ ನೀಲಿ ಕುಂಬಾರಿಕೆ ಹೂದಾನಿ',
        description: 'ನೈಸರ್ಗಿಕ ಕ್ವಾರ್ಟ್ಜ್ ಕಲ್ಲಿನ ಪುಡಿಯಿಂದ ಮಾಡಿದ ನೀಲಿ ಕುಂಬಾರಿಕೆ ಹೂದಾನಿ. ಸುಂದರ ಹೂವಿನ ಚಿತ್ತಾರ.',
        highlights: ['ನೈಸರ್ಗಿಕ ನೀಲಿ ಬಣ್ಣ', '100% ಕೈಯಲ್ಲೇ ಚಿತ್ರಿಸಿದ್ದು'],
        careInstructions: 'ಮೃದುವಾದ ನೀರಿನಿಂದ ತೊಳೆಯಿರಿ.'
      }
    },
    pricingBreakdown: {
      materialCost: 550,
      hoursSpent: 8,
      hourlyRateEstimate: 140,
      recommendedMin: 1600,
      recommendedMax: 2200,
      explanation: 'Ground quartz material & cobalt mineral glaze cost ₹550 + 8 hours intricate hand-painting and kiln firing. Suggested price ₹1,850.'
    }
  },
  {
    id: 'prod-4',
    sellerId: 'artisan-4',
    sellerName: 'Venkat Rao',
    sellerRegion: 'Kondapalli, Andhra Pradesh',
    sellerLanguage: 'te',
    title: 'Kondapalli Hand-Carved Wooden Ambari Elephant Procession',
    originalLanguage: 'te',
    category: 'toys',
    price: 1450,
    suggestedPriceMin: 1200,
    suggestedPriceMax: 1700,
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'తేలికపాటి తెల్ల పొనికి చెక్కతో చేతితో చెక్కిన సాంప్రదాయ కొండపల్లి ఏనుగు అంబారీ బొమ్మ. సహజమైన కూరగాయల రంగులతో రంగులు వేయబడింది.',
    materials: ['Tella Poniki Softwood', 'Tamarind Seed Makku Paste', 'Non-toxic Natural Vegetable Pigments'],
    dimensions: '8" Length x 4" Width x 7" Height',
    highlights: [
      '100% Non-toxic herbal vegetable colors safe for all ages',
      'Lightweight yet sturdy heritage Tella Poniki wood',
      'Famous 400-year Kondapalli artisan lineage'
    ],
    careInstructions: 'Dust with soft dry brush. Keep away from direct moisture.',
    shippingInfo: 'Cushioned in shockproof molded box. Dispatched within 24 hours.',
    tags: ['Kondapalli', 'Wooden Toys', 'Heritage Craft', 'Eco Toys', 'Andhra Craft'],
    inStock: true,
    stockCount: 22,
    createdAt: '2026-08-15T11:00:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[3].verificationData,
    translations: {
      en: {
        title: 'Kondapalli Hand-Carved Wooden Ambari Elephant Procession',
        description: 'Iconic Kondapalli wooden sculpture hand-carved from sacred Tella Poniki softwood. Illustrates a royal elephant carrying a golden ambari carriage, finished with vibrant non-toxic tamarind and vegetable pigments.',
        highlights: [
          'Eco-friendly toy sculpture certified non-toxic',
          'Traditional hand-carved joinery using natural tamarind binder',
          'Registered Geographical Indication toy craft'
        ],
        careInstructions: 'Keep dry. Dust gently using a dry paintbrush or lint-free microfiber.'
      },
      kn: {
        title: 'ಕೊಂಡಪಲ್ಲಿ ಕೈಕೆತ್ತನೆಯ ಮರದ ಆನೆ ಅಂಬಾರಿ ಬೊಂಬೆ',
        description: 'ನೈಸರ್ಗಿಕ ತೇಲುವ ಮರದಿಂದ ಕೈಯಲ್ಲೇ ಕೆತ್ತಿದ ಸುಂದರವಾದ ಸಾಂಪ್ರದಾಯಿಕ ಆನೆ ಬೊಂಬೆ. ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಬಣ್ಣಗಳು.',
        highlights: ['ಮಕ್ಕಳಿಗೆ ಸುರಕ್ಷಿತ ಬಣ್ಣಗಳು', 'ಸಾಂಪ್ರದಾಯಿಕ ಕಲೆ'],
        careInstructions: 'ಒಣ ಬಟ್ಟೆಯಿಂದ ಧೂಳು ಒರೆಸಿ.'
      },
      hi: {
        title: 'कोंडापल्ली हस्तनिर्मित लकड़ी का हाथी अंबारी खिलौना',
        description: 'नरम पोनिकी लकड़ी से हाथ से तराशी गई पारंपरिक राजसी हाथी की मूर्ति। गैर-विषैले प्राकृतिक रंग।',
        highlights: ['100% प्राकृतिक वनस्पति रंग', 'सुरक्षित और पर्यावरण अनुकूल'],
        careInstructions: 'सूखे कपड़े से साफ करें।'
      }
    },
    pricingBreakdown: {
      materialCost: 380,
      hoursSpent: 7,
      hourlyRateEstimate: 130,
      recommendedMin: 1200,
      recommendedMax: 1700,
      explanation: 'Tella Poniki softwood & herbal pigments cost ₹380, plus 7 hours of delicate carving and fine painting. Fair price is ₹1,450.'
    }
  },
  {
    id: 'prod-5',
    sellerId: 'artisan-5',
    sellerName: 'Fatima Begum',
    sellerRegion: 'Srinagar, Kashmir',
    sellerLanguage: 'ur',
    title: 'Fine Hand-Spun Kashmiri Pashmina Shawl with Sozni Needlework',
    originalLanguage: 'ur',
    category: 'embroidery',
    price: 14200,
    suggestedPriceMin: 13000,
    suggestedPriceMax: 16500,
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'اصلی کشمیری پشمینہ اون پر باریک ہاتھ کی سوئی سے چنار کے پتوں کی سوزنی کڑھائی۔ انتہائی ہلکی اور گرم۔',
    materials: ['100% Changthangi Goat Mountain Pashmina Cashmere', 'Pure Mulberry Silk Embroidery Floss'],
    dimensions: '200 cm x 100 cm (Full Stole/Shawl)',
    highlights: [
      'Passes the legendary ring test (under 220 grams)',
      'Microscopic single-needle Sozni threadwork took 4 months',
      'Naturally insulating feather-light warmth'
    ],
    careInstructions: 'Professional dry clean or gentle hand wash in cold water with wool shampoo.',
    shippingInfo: 'Comes in handmade cedarwood presentation box with authenticity certificate.',
    tags: ['Kashmiri Pashmina', 'Sozni Embroidery', 'Cashmere', 'Luxury Handloom', 'Srinagar Craft'],
    inStock: true,
    stockCount: 3,
    createdAt: '2026-08-08T16:00:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[4].verificationData,
    translations: {
      en: {
        title: 'Fine Hand-Spun Kashmiri Pashmina Shawl with Sozni Needlework',
        description: 'Supreme-grade authentic Kashmiri Pashmina cashmere shawl, handspun from high-altitude Changthangi fleece. Adorned with delicate Sozni needle embroidery along the four borders (Chahar-Bagh motif).',
        highlights: [
          '100% Certified pure mountain Pashmina cashmere',
          'Single-needle master Sozni hand embroidery',
          'Weight: only 195 grams yet deeply thermal'
        ],
        careInstructions: 'Dry clean only. Store wrapped in cotton muslin with natural cedar balls.'
      },
      kn: {
        title: 'ಶುದ್ಧ ಕಾಶ್ಮೀರಿ ಪಶ್ಮಿನಾ ಶಾಲು (ಸೂಜಿ ಕಸೂತಿ)',
        description: 'ನೈಸರ್ಗಿಕ ಪಶ್ಮಿನಾ ಉಣ್ಣೆಯಿಂದ ತಯಾರಿಸಿದ ಅತ್ಯಂತ ಹಗುರವಾದ ಮತ್ತು ಬೆಚ್ಚಗಿನ ಕಾಶ್ಮೀರಿ ಶಾಲು.',
        highlights: ['100% ನೈಜ ಪಶ್ಮಿನಾ', 'ಕೈ ಸೂಜಿ ಕಸೂತಿ'],
        careInstructions: 'ಡ್ರೈ ಕ್ಲೀನ್ ಮಾತ್ರ.'
      },
      hi: {
        title: 'कश्मीरी शुद्ध पश्मीना शॉल - महीन सोज़नी कढ़ाई',
        description: 'हाथ से काती गई शुद्ध पश्मीना ऊन पर बारीक सुई से तैयार की गई खूबसूरत शॉल।',
        highlights: ['100% शुद्ध पश्मीना', 'महीनों की सुई की कारीगरी'],
        careInstructions: 'केवल ड्राई क्लीन।'
      }
    },
    pricingBreakdown: {
      materialCost: 5800,
      hoursSpent: 90,
      hourlyRateEstimate: 85,
      recommendedMin: 13000,
      recommendedMax: 16500,
      explanation: 'Certified raw Changthangi Pashmina yarn costs ₹5,800 + 90+ hours of micro needle embroidery. Fair price is ₹14,200.'
    }
  },
  {
    id: 'prod-6',
    sellerId: 'artisan-6',
    sellerName: 'Devubhai Vankar',
    sellerRegion: 'Bhuj, Kutch, Gujarat',
    sellerLanguage: 'gu',
    title: 'Natural Indigo & Madder Ajrakh Hand-Block Printed Cotton Throw',
    originalLanguage: 'gu',
    category: 'textiles',
    price: 2400,
    suggestedPriceMin: 2100,
    suggestedPriceMax: 2800,
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'શુદ્ધ દેશી સુતરાઉ કાપડ પર ૧૬ તબક્કાની કુદરતી અજરખ પ્રિન્ટ. કુદરતી ગળી અને હળદરના પાકા રંગો.',
    materials: ['100% Handloom Organic Desi Cotton', 'Natural Fermented Indigo', 'Madder Root Red'],
    dimensions: '90" x 60" (Single Bed / Couch Throw)',
    highlights: [
      '100% Natural herbally fermented vegetable dyes',
      'Hand-carved Sheesham wood blocks aligned with millimeter precision',
      'Skin-friendly breathable all-weather cotton'
    ],
    careInstructions: 'Hand wash separately in cold water with mild eco-detergent. Line dry in shade.',
    shippingInfo: 'Recycled craft paper packaging. Shipped via carbon-neutral postal service.',
    tags: ['Ajrakh', 'Block Print', 'Kutch Textiles', 'Organic Cotton', 'Indigo Dye'],
    inStock: true,
    stockCount: 16,
    createdAt: '2026-08-11T12:00:00Z',
    aiGenerated: true,
    verification: DEMO_ARTISANS[5].verificationData,
    translations: {
      en: {
        title: 'Natural Indigo & Madder Ajrakh Hand-Block Printed Cotton Throw',
        description: 'Authentic 16-stage resist-printed Ajrakh textile on handloom organic cotton. Dyed with naturally fermented blue indigo, red madder root, and iron black. Features the sacred stars and jewel geometry of Kutch.',
        highlights: [
          'Created without any synthetic chemical chemicals or mordants',
          'Double-sided block printed alignment',
          'Softens and blooms in rich hue with every gentle wash'
        ],
        careInstructions: 'First wash separately in cold water. Dry in shade.'
      },
      kn: {
        title: 'ನೈಸರ್ಗಿಕ ಇಂಡಿಗೋ ಅಜ್ರಖ್ ಬ್ಲಾಕ್ ಪ್ರಿಂಟ್ ಹತ್ತಿ ಹೊದಿಕೆ',
        description: 'ಕಚ್‌ನ ಸಾಂಪ್ರದಾಯಿಕ ಮರದ ಅಚ್ಚುಗಳಿಂದ ಮುದ್ರಿಸಿದ ನೈಸರ್ಗಿಕ ಗಿಡಮೂಲಿಕೆ ಬಣ್ಣಗಳ ಹತ್ತಿ ಹೊದಿಕೆ.',
        highlights: ['100% ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳು', 'ಆರ್ಗ್ಯಾನಿಕ್ ಹತ್ತಿ'],
        careInstructions: 'ತಣ್ಣೀರಿನಲ್ಲಿ ಪ್ರತ್ಯೇಕವಾಗಿ ತೊಳೆಯಿರಿ.'
      },
      hi: {
        title: 'कच्छ अजरख प्राकृतिक ब्लॉक प्रिंट कॉटन चादर/थ्रो',
        description: '16 चरणों वाली पारंपरिक अजरख छपाई, जिसमें केवल प्राकृतिक नील और मजीठ का प्रयोग किया गया है।',
        highlights: ['100% जैविक सूती कपड़ा', 'हाथ से नक्काशीदार लकड़ी के ठप्पे'],
        careInstructions: 'ठंडे पानी में धोएं।'
      }
    },
    pricingBreakdown: {
      materialCost: 750,
      hoursSpent: 12,
      hourlyRateEstimate: 125,
      recommendedMin: 2100,
      recommendedMax: 2800,
      explanation: 'Handloom Desi cotton fabric & pure organic indigo/madder cost ₹750 + 12 hours of multi-step resist washing and printing. Recommended price ₹2,400.'
    }
  }
];

export const SAMPLE_CRAFT_PRESETS = [
  {
    category: 'baskets' as const,
    title: 'Handwoven Bamboo Fruit Basket with Handle',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    materials: ['Natural Split Bamboo', 'Wild Cane Tendrils'],
    estimatedHours: 5,
    materialCost: 300,
    notes: 'ಕೈಯಿಂದ ಸೀಳಿದ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನ ಹಣ್ಣಿನ ಬುಟ್ಟಿ. ಸುಲಭವಾಗಿ ಹಿಡಿಯಲು ಗಟ್ಟಿ ಹ್ಯಾಂಡಲ್ ಇದೆ. ಅಡುಗೆ ಮನೆಗೆ ತುಂಬಾ ಉಪಯುಕ್ತ.'
  },
  {
    category: 'pottery' as const,
    title: 'Terracotta Handcrafted Water Pitcher with Clay Cup',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    materials: ['Riverbed Red Clay', 'Natural Wood Ash Glaze'],
    estimatedHours: 4,
    materialCost: 200,
    notes: 'नदी की लाल मिट्टी से चाक पर बना प्राकृतिक मटका और कुल्हड़। पानी को प्राकृतिक रूप से ठंडा और मीठा रखता है।'
  },
  {
    category: 'textiles' as const,
    title: 'Handloom Cotton Ikat Dupatta with Tassels',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    materials: ['Organic Handspun Cotton', 'Natural Vegetable Dyes'],
    estimatedHours: 14,
    materialCost: 650,
    notes: 'చేనేత మగ్గంపై నేసిన సహజ రంగుల ఇక్కత్ దుపట్టా. మృదువైన మరియు అందమైన అంచులు.'
  },
  {
    category: 'toys' as const,
    title: 'Wooden Dancing Doll (Thanjavur Style) / Kondapalli Toy',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    materials: ['Soft Wood', 'Organic Tamarind Gum', 'Herbal Colors'],
    estimatedHours: 6,
    materialCost: 280,
    notes: 'பாரம்பரிய மர பொம்மை, ஆடும் நடன மங்கை. குழந்தைகளுக்கு பாதுகாப்பான இயற்கை வண்ணங்கள்.'
  }
];
