import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Mock Amazon Database with realistic data and generated local assets
export interface AmazonProduct {
  asin: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  currency: string;
  rating: number;
  reviewCount: number;
  prime: boolean;
  stock: string;
  imageUrl: string;
  badge?: string;
  features: string[];
  affiliateUrl: string;
  commissionRate: number; // e.g. 0.04 = 4%
}

const initialAmazonProducts: AmazonProduct[] = [
  {
    asin: 'B0CHX19W5K',
    title: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Black',
    category: 'Elektronik & Audio',
    price: 328.00,
    originalPrice: 399.99,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 14820,
    prime: true,
    stock: 'In Stock',
    imageUrl: '/src/assets/images/amazon_product_anc_headphones_1790382436963.jpg',
    badge: 'Best Seller · 18% OFF',
    features: [
      'Two processors and 8 microphones for industry-leading noise cancellation',
      'Up to 30-hour battery life with quick charge (3 min for 3 hours)',
      'Ultra-comfortable, lightweight design with soft fit leather'
    ],
    affiliateUrl: 'https://amazon.com/dp/B0CHX19W5K?tag=amzsync-20',
    commissionRate: 0.04
  },
  {
    asin: 'B0BDHWDR12',
    title: 'Apple Watch Ultra 2 [GPS + Cellular 49mm] Rugged Titanium Smartwatch with Ocean Band',
    category: 'Wearable Tech',
    price: 749.00,
    originalPrice: 799.00,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 9230,
    prime: true,
    stock: 'Only 4 left in stock',
    imageUrl: '/src/assets/images/amazon_product_smart_watch_1790382451088.jpg',
    badge: 'Amazon\'s Choice · Flash Deal',
    features: [
      'Corrosion-resistant 49mm titanium case with sapphire front crystal',
      'Dual-frequency GPS provides remarkable accuracy for distance and pace',
      'Up to 36 hours of battery life, 72 hours in low power mode'
    ],
    affiliateUrl: 'https://amazon.com/dp/B0BDHWDR12?tag=amzsync-20',
    commissionRate: 0.03
  },
  {
    asin: 'B07VFNQ41Z',
    title: 'Breville Barista Touch Impress Espresso Machine with Precision Conical Burr Grinder',
    category: 'Dapur & Rumah Tangga',
    price: 999.95,
    originalPrice: 1199.95,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 5612,
    prime: true,
    stock: 'In Stock',
    imageUrl: '/src/assets/images/amazon_product_espresso_machine_1790382462909.jpg',
    badge: 'Limited Time Deal · $200 OFF',
    features: [
      'Touchscreen automation with real-time feedback for espresso dose and tamp',
      'Auto MilQ hands-free microfoam milk texturing with alternative milk settings',
      'ThermoJet heating system reaches optimum extraction temperature in 3 seconds'
    ],
    affiliateUrl: 'https://amazon.com/dp/B07VFNQ41Z?tag=amzsync-20',
    commissionRate: 0.045
  },
  {
    asin: 'B09Z4T5P7W',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard with Hot-Swappable Switches & PBT Caps',
    category: 'Komputer & Aksesoris',
    price: 198.00,
    originalPrice: 219.00,
    currency: 'USD',
    rating: 4.7,
    reviewCount: 3840,
    prime: true,
    stock: 'In Stock',
    imageUrl: '/src/assets/images/amazon_product_mechanical_keyboard_1790382475662.jpg',
    badge: 'Editor\'s Choice',
    features: [
      'Full aluminum CNC machined body with double-gasket dampening design',
      'Connects with up to 3 devices via Bluetooth 5.1 or wired Type-C',
      'QMK/VIA reprogrammable keymaps and macro rotary encoder knob'
    ],
    affiliateUrl: 'https://amazon.com/dp/B09Z4T5P7W?tag=amzsync-20',
    commissionRate: 0.05
  }
];

// In-Memory Campaign & Social Post Store
export interface ScheduledPost {
  id: string;
  asin: string;
  productTitle: string;
  productPrice: number;
  productImageUrl: string;
  affiliateUrl: string;
  platforms: ('twitter' | 'instagram' | 'facebook' | 'pinterest' | 'tiktok' | 'linkedin')[];
  copy: Record<string, string>;
  scheduledTime: string; // ISO date string
  status: 'scheduled' | 'publishing' | 'published' | 'failed' | 'draft';
  campaignName: string;
  createdAt: string;
  aiOptimized: boolean;
  aiReasoning?: string;
  targetAudience?: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
  };
}

const initialPosts: ScheduledPost[] = [
  {
    id: 'post-101',
    asin: 'B0CHX19W5K',
    productTitle: 'Sony WH-1000XM5 Wireless Headphones',
    productPrice: 328.00,
    productImageUrl: '/src/assets/images/amazon_product_anc_headphones_1790382436963.jpg',
    affiliateUrl: 'https://amazon.com/dp/B0CHX19W5K?tag=amzsync-20',
    platforms: ['twitter', 'instagram', 'facebook'],
    copy: {
      twitter: '🔥 PROMO ALERT: Sony WH-1000XM5 turun harga ke $328 (diskon 18%)! Noise-cancelling terbaik di kelasnya untuk kerja fokus atau traveling. Dapatkan sebelum kuota habis 👉 amzn.to/3SonyXM5 #AmazonDeals #AudioTech #Sony',
      instagram: 'Siapa yang butuh ketenangan total saat kerja di coffee shop? 🎧 Sony WH-1000XM5 sedang diskon besar 18% di Amazon!\n\n✨ Baterai 30 jam\n✨ 8 mikrofon noise cancelling mutakhir\n✨ Nyaman dipakai seharian\n\nLink pembelian langsung ada di bio! 🛒',
      facebook: 'Deal terbatas untuk pecinta audio! Headphone flagship Sony WH-1000XM5 turun harga dari $399.99 menjadi $328.00. Dilengkapi garansi resmi dan pengiriman cepat Amazon Prime.'
    },
    scheduledTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'published',
    campaignName: 'Flash Deal Audio Week',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiOptimized: true,
    aiReasoning: 'Diposting pada jam pulang kerja (18:45 WIB) saat retensi audiens mobile gadget meningkat 42%.',
    targetAudience: 'Audiens Tech Enthusiast & Remote Workers usia 24-38',
    metrics: {
      impressions: 4850,
      clicks: 342,
      conversions: 18,
      revenue: 236.16,
      ctr: 7.05
    }
  },
  {
    id: 'post-102',
    asin: 'B07VFNQ41Z',
    productTitle: 'Breville Barista Touch Impress',
    productPrice: 999.95,
    productImageUrl: '/src/assets/images/amazon_product_espresso_machine_1790382462909.jpg',
    affiliateUrl: 'https://amazon.com/dp/B07VFNQ41Z?tag=amzsync-20',
    platforms: ['instagram', 'pinterest'],
    copy: {
      instagram: 'Bikin latte art kelas kafe di rumah tanpa ribet ☕✨ Breville Barista Touch Impress dengan layar sentuh otomatis & tamping presisi. Hemat $200 hari ini!',
      pinterest: 'Inspirasi Coffee Corner Mewah: Review Breville Barista Touch Impress. Cara seduh espresso sempurna di rumah dengan sensor tamping pintar.'
    },
    scheduledTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    status: 'scheduled',
    campaignName: 'Home Lifestyle Luxury Promo',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    aiOptimized: true,
    aiReasoning: 'Dijadwalkan di slot puncak audiens Food & Home Decor (pukul 20:30 WIB) dengan prediksi konversi +28%.',
    targetAudience: 'Home Barista & Coffee Lovers',
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    }
  },
  {
    id: 'post-103',
    asin: 'B0BDHWDR12',
    productTitle: 'Apple Watch Ultra 2 Titanium',
    productPrice: 749.00,
    productImageUrl: '/src/assets/images/amazon_product_smart_watch_1790382451088.jpg',
    affiliateUrl: 'https://amazon.com/dp/B0BDHWDR12?tag=amzsync-20',
    platforms: ['twitter', 'linkedin', 'facebook'],
    copy: {
      twitter: 'Apple Watch Ultra 2 restock di Amazon dengan diskon $50! Casing titanium 49mm kokoh & baterai tahan 36 jam. Cek link: amzn.to/AppleUltra2 #AppleWatch #TechNews',
      linkedin: 'Teknologi wearable untuk produktivitas dan endurance: Studi singkat mengapa Apple Watch Ultra 2 menjadi pilihan para eksekutif dan atlet.',
      facebook: 'Kabar gembira buat pengguna Apple! Apple Watch Ultra 2 kini tersedia dengan pengiriman gratis Amazon Prime.'
    },
    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    campaignName: 'Smart Gadget Sprint Q3',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    aiOptimized: true,
    aiReasoning: 'Waktu posting direkomendasikan AI untuk pagi hari pukul 08:15 WIB saat traffic LinkedIn & X tertinggi.',
    targetAudience: 'Professional & Sports Fitness Trackers',
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    }
  }
];

export interface ServerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: string;
  read: boolean;
  campaignId?: string;
}

let catalog: AmazonProduct[] = [...initialAmazonProducts];
let posts: ScheduledPost[] = [...initialPosts];
let notifications: ServerNotification[] = [
  {
    id: 'notif-1',
    title: 'Postingan Terbit Sukses',
    message: 'Kampanye "Flash Deal Audio Week" untuk Sony WH-1000XM5 berhasil diposting ke X, Instagram, dan Facebook.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'success',
    read: false,
    campaignId: 'post-101'
  },
  {
    id: 'notif-2',
    title: 'AI Optimal Time Detected',
    message: 'AI telah mengkalkulasi waktu posting optimal untuk Breville Barista Touch pada pukul 20:30 WIB (+28% CTR).',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    type: 'info',
    read: true,
    campaignId: 'post-102'
  },
  {
    id: 'notif-3',
    title: 'Penurunan Harga Amazon Terdeteksi',
    message: 'ASIN B0CHX19W5K mengalami penurunan harga 18%. Rekomendasi auto-kampanye telah disiapkan.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    type: 'alert',
    read: true,
    campaignId: 'post-101'
  }
];

// API: Search & Fetch Amazon Products
app.get('/api/amazon/products', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const category = (req.query.category as string || '').toLowerCase();
  
  let filtered = catalog;
  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.asin.toLowerCase().includes(query) ||
      p.features.some(f => f.toLowerCase().includes(query))
    );
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase().includes(category));
  }

  res.json({
    success: true,
    count: filtered.length,
    products: filtered
  });
});

// API: Import new Amazon Product by ASIN or URL
app.post('/api/amazon/import', async (req, res) => {
  const { asinOrUrl, affiliateTag = 'amzsync-20' } = req.body;
  if (!asinOrUrl) {
    return res.status(400).json({ success: false, message: 'ASIN atau URL Amazon wajib diisi' });
  }

  // Extract ASIN from URL or clean input
  let asin = asinOrUrl.trim().toUpperCase();
  const asinMatch = asinOrUrl.match(/(?:dp\/|gp\/product\/|asin\/)([A-Z0-9]{10})/i);
  if (asinMatch) {
    asin = asinMatch[1].toUpperCase();
  }

  // Check if product already exists
  const existing = catalog.find(p => p.asin === asin);
  if (existing) {
    return res.json({ success: true, product: existing, isExisting: true });
  }

  // Synthesize or scrape new Amazon product
  const defaultImages = [
    '/src/assets/images/amazon_product_anc_headphones_1790382436963.jpg',
    '/src/assets/images/amazon_product_smart_watch_1790382451088.jpg',
    '/src/assets/images/amazon_product_espresso_machine_1790382462909.jpg',
    '/src/assets/images/amazon_product_mechanical_keyboard_1790382475662.jpg'
  ];
  const chosenImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];

  // Create new rich product
  const newProduct: AmazonProduct = {
    asin: asin,
    title: `Amazon Imported Item: ${asin}`,
    category: 'Elektronik & Gadget',
    price: parseFloat((49.99 + Math.random() * 250).toFixed(2)),
    originalPrice: parseFloat((79.99 + Math.random() * 300).toFixed(2)),
    currency: 'USD',
    rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
    reviewCount: Math.floor(500 + Math.random() * 8500),
    prime: true,
    stock: 'In Stock',
    imageUrl: chosenImage,
    badge: 'Amazon Verified',
    features: [
      'Authentic Amazon Product Advertising API synced item',
      'Eligible for Prime Free Two-Day Shipping',
      'Auto-synced price & deal tracking'
    ],
    affiliateUrl: `https://amazon.com/dp/${asin}?tag=${affiliateTag}`,
    commissionRate: 0.04
  };

  // Try to use Gemini to generate a realistic product title & description based on ASIN keyword context if provided
  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `User imported Amazon ASIN: "${asin}". Generate a realistic e-commerce product name and category in Indonesian/English. Return JSON format: { "title": string, "category": string, "features": string[] }`;
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      const parsed = JSON.parse(aiResponse.text || '{}');
      if (parsed.title) newProduct.title = parsed.title;
      if (parsed.category) newProduct.category = parsed.category;
      if (parsed.features && Array.isArray(parsed.features)) newProduct.features = parsed.features;
    }
  } catch (err) {
    console.error('Gemini product enrichment error (falling back to generated defaults):', err);
  }

  catalog.unshift(newProduct);
  res.json({ success: true, product: newProduct, isExisting: false });
});

// API: AI Auto-Scheduling Optimizer
app.post('/api/ai/optimize-schedule', async (req, res) => {
  const { product, targetAudience = 'General Social Media Shoppers', platforms = ['twitter', 'instagram'] } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Deterministic intelligent schedule fallback
      const recommendedDate = new Date(Date.now() + 3600000 * 3);
      return res.json({
        success: true,
        bestTimeISO: recommendedDate.toISOString(),
        bestTimeString: recommendedDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        dayOfWeek: 'Kamis / Jumat',
        peakHourReasoning: `Analisis algoritma menunjukkan audiens untuk kategori "${product?.category || 'Elektronik'}" paling responsif pada pukul 19:30 - 21:00 WIB setelah jam kerja.`,
        expectedCtrBoost: '+34.5%',
        audienceInsights: [
          'Tingkat engagement tertinggi terjadi saat pengguna aktif di feed visual mobile.',
          'Postingan dengan harga diskon dan badge Prime memiliki konversi 2.4x lebih cepat.',
          'Hashtag rekomendasi: #AmazonDeals #TechReview #FlashSale'
        ],
        platformTiming: {
          twitter: '18:45 WIB (Peak Retweet velocity)',
          instagram: '20:15 WIB (High Story & Carousel dwell time)',
          facebook: '12:30 WIB & 19:00 WIB (Lunch & Leisure feed)',
          pinterest: '21:00 WIB (Late evening shopping boards)',
          tiktok: '20:00 WIB (Peak FYP consumption)'
        }
      });
    }

    const prompt = `Anda adalah AI Social Media Optimization Director untuk platform affiliate marketing Amazon.
Analisis produk berikut dan rekomendasikan WAKTU TERBAIK UNTUK POSTING (Best Time to Post) secara otomatis untuk memaksimalkan Click-Through Rate (CTR) dan konversi afiliasi:
- Produk: "${product?.title}"
- Kategori: "${product?.category}"
- Harga: $${product?.price} (Diskon dari $${product?.originalPrice})
- Target Platform: ${platforms.join(', ')}
- Target Audiens: "${targetAudience}"

Kembalikan jawaban HANYA dalam format JSON dengan struktur:
{
  "recommendedHoursFromNow": number (antara 2 hingga 48),
  "bestTimeString": string (contoh: "19:45 WIB"),
  "dayOfWeek": string (contoh: "Kamis Malam"),
  "peakHourReasoning": string (penjelasan mendalam mengenai perilaku audiens dan algoritma platform),
  "expectedCtrBoost": string (contoh: "+36.8%"),
  "audienceInsights": string[] (3 poin penting perilaku audiens),
  "platformTiming": {
    "twitter": string,
    "instagram": string,
    "facebook": string,
    "pinterest": string,
    "tiktok": string
  }
}`;

    const aiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(aiRes.text || '{}');
    const hours = parsed.recommendedHoursFromNow || 4;
    const bestDate = new Date(Date.now() + 3600000 * hours);

    res.json({
      success: true,
      bestTimeISO: bestDate.toISOString(),
      bestTimeString: parsed.bestTimeString || bestDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      dayOfWeek: parsed.dayOfWeek || 'Hari Ini',
      peakHourReasoning: parsed.peakHourReasoning,
      expectedCtrBoost: parsed.expectedCtrBoost || '+32%',
      audienceInsights: parsed.audienceInsights || [],
      platformTiming: parsed.platformTiming || {}
    });

  } catch (error: any) {
    console.error('Error optimizing schedule with Gemini:', error);
    const fallbackDate = new Date(Date.now() + 3600000 * 3);
    res.json({
      success: true,
      bestTimeISO: fallbackDate.toISOString(),
      bestTimeString: '19:30 WIB',
      dayOfWeek: 'Optimal Peak Window',
      peakHourReasoning: 'Algoritma mendeteksi jam santai malam adalah momen dengan conversion rate tertinggi untuk gadget dan lifestyle.',
      expectedCtrBoost: '+29.4%',
      audienceInsights: ['Audiens lebih sering checkout saat browsing santai malam hari'],
      platformTiming: {
        twitter: '18:30 WIB',
        instagram: '20:00 WIB',
        facebook: '19:15 WIB',
        pinterest: '21:00 WIB'
      }
    });
  }
});

// API: AI Auto-Generate Copy for Multi-Platform
app.post('/api/ai/generate-copy', async (req, res) => {
  const { product, tone = 'engaging_deal', platforms = ['twitter', 'instagram', 'facebook'] } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      // High quality deterministic copy
      const copy: Record<string, string> = {
        twitter: `🔥 PROMO TERBAIK: ${product.title.slice(0, 70)}... Kini cuma $${product.price}! Diskon terbatas di Amazon Prime. Cek sebelum kehabisan 🛒👇 ${product.affiliateUrl} #AmazonFinds #Diskon #TechDeals`,
        instagram: `Siap upgrade setup harianmu? ✨\n\n${product.title}\n\nKelebihan utama:\n- ${product.features?.[0] || 'Kualitas premium terjamin'}\n- Rating ${product.rating}⭐ dari ribuan ulasan pembeli!\n- Harga spesial: $${product.price} (Hemat hemat!)\n\n📌 Link pembelian ada di link bio kami! Klik dan amankan promonya sekarang.`,
        facebook: `Peluang hemat belanja di Amazon! ${product.title} sedang diskon hari ini menjadi $${product.price}. Sangat direkomendasikan dengan ulasan ${product.rating} bintang. Dapatkan garansi resmi dan bebas ongkir Amazon Prime via tautan berikut: ${product.affiliateUrl}`,
        pinterest: `${product.title} - Ide belanja terbaik untuk wishlist kamu! Temukan review lengkap, harga promo terendah, dan inspirasi produk. Klik tautan pin untuk beli di Amazon.`,
        tiktok: `Unboxing & Review singkat: Kenapa produk ini wajib punya di 2026? Harga cuma $${product.price} dengan fitur ${product.features?.[0] || 'canggih'}! Link di bio profile!`,
        linkedin: `Analisis produk tren e-commerce: Mengapa ${product.title} mencapai rating ${product.rating}/5 dengan performa penjualan tinggi di kuartal ini. Simak ulasan detailnya di tautan berikut.`
      };
      return res.json({ success: true, copy });
    }

    const prompt = `Anda adalah copywriter spesialis social media marketing untuk produk e-commerce Amazon.
Buatkan variasi caption yang menarik, berorientasi konversi (high-converting), natural, dan sesuai gaya khas masing-masing platform untuk produk berikut:
- Judul: ${product.title}
- Kategori: ${product.category}
- Harga Promo: $${product.price} (Harga asli: $${product.originalPrice})
- Rating: ${product.rating} bintang (${product.reviewCount} ulasan)
- Fitur Utama: ${product.features?.join(', ')}
- Link Afiliasi: ${product.affiliateUrl}
- Nada Suara (Tone): ${tone}

Kembalikan HANYA format JSON berikut (hanya untuk platform: ${platforms.join(', ')}):
{
  "twitter": "copy tweet maksimal 260 karakter termasuk hashtag relevan dan link afiliasi",
  "instagram": "copy instagram engaging dengan hook menarik, bullet point fitur, call to action jelas, dan hashtag",
  "facebook": "copy facebook yang persuasif dan informatif",
  "pinterest": "copy pin yang SEO-friendly dan berorientasi inspirasi visual",
  "tiktok": "skrip/caption tiktok hook cepat dan ajakan klik bio",
  "linkedin": "copy profesional relevan"
}`;

    const aiRes = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(aiRes.text || '{}');
    res.json({ success: true, copy: parsed });
  } catch (error) {
    console.error('Error generating copy with Gemini:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat caption AI' });
  }
});

// API: Scheduled Posts CRUD
app.get('/api/posts', (req, res) => {
  res.json({ success: true, posts });
});

app.post('/api/posts', (req, res) => {
  const {
    asin,
    productTitle,
    productPrice,
    productImageUrl,
    affiliateUrl,
    platforms,
    copy,
    scheduledTime,
    campaignName,
    aiOptimized,
    aiReasoning,
    targetAudience
  } = req.body;

  const newPost: ScheduledPost = {
    id: `post-${Date.now()}`,
    asin,
    productTitle,
    productPrice,
    productImageUrl,
    affiliateUrl,
    platforms: platforms || ['twitter', 'instagram'],
    copy: copy || {},
    scheduledTime: scheduledTime || new Date(Date.now() + 3600000).toISOString(),
    status: 'scheduled',
    campaignName: campaignName || 'Kampanye Terjadwal',
    createdAt: new Date().toISOString(),
    aiOptimized: Boolean(aiOptimized),
    aiReasoning,
    targetAudience,
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0
    }
  };

  posts.unshift(newPost);

  // Add notification
  const newNotif = {
    id: `notif-${Date.now()}`,
    title: 'Kampanye Baru Berhasil Dijadwalkan',
    message: `Kampanye "${newPost.campaignName}" untuk ${newPost.productTitle.slice(0, 40)}... dijadwalkan ke ${newPost.platforms.join(', ')}.`,
    timestamp: new Date().toISOString(),
    type: 'info',
    read: false,
    campaignId: newPost.id
  };
  notifications.unshift(newNotif);

  res.json({ success: true, post: newPost, notification: newNotif });
});

// API: Instantly Publish a Scheduled Post
app.post('/api/posts/:id/publish-now', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: 'Post tidak ditemukan' });
  }

  posts[postIndex].status = 'published';
  // generate initial simulated engagement metrics
  posts[postIndex].metrics.impressions += Math.floor(150 + Math.random() * 450);
  posts[postIndex].metrics.clicks += Math.floor(12 + Math.random() * 45);
  posts[postIndex].metrics.ctr = parseFloat(((posts[postIndex].metrics.clicks / posts[postIndex].metrics.impressions) * 100).toFixed(2));

  // Add push notification
  const notif = {
    id: `notif-${Date.now()}`,
    title: 'Postingan Terbit Real-time!',
    message: `Kampanye "${posts[postIndex].campaignName}" baru saja dipublikasikan ke ${posts[postIndex].platforms.join(', ')}.`,
    timestamp: new Date().toISOString(),
    type: 'success',
    read: false,
    campaignId: id
  };
  notifications.unshift(notif);

  res.json({ success: true, post: posts[postIndex], notification: notif });
});

// API: Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  posts = posts.filter(p => p.id !== id);
  res.json({ success: true });
});

// API: Notifications
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  notifications = notifications.map(n => ({ ...n, read: true }));
  res.json({ success: true });
});

app.post('/api/notifications/test-push', (req, res) => {
  const { title = 'Tes Notifikasi Push', message = 'Sistem auto-post AmzSync berfungsi optimal.' } = req.body;
  const notif = {
    id: `notif-${Date.now()}`,
    title,
    message,
    timestamp: new Date().toISOString(),
    type: 'info',
    read: false
  };
  notifications.unshift(notif);
  res.json({ success: true, notification: notif });
});

// API: Real-time Analytics Summary
app.get('/api/analytics', (req, res) => {
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  
  const totalImpressions = posts.reduce((sum, p) => sum + p.metrics.impressions, 0);
  const totalClicks = posts.reduce((sum, p) => sum + p.metrics.clicks, 0);
  const totalConversions = posts.reduce((sum, p) => sum + p.metrics.conversions, 0);
  const totalRevenue = posts.reduce((sum, p) => sum + p.metrics.revenue, 0);
  const avgCtr = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0;

  // Platform breakdown
  const platformStats = {
    twitter: { posts: 0, clicks: 0, share: '38%' },
    instagram: { posts: 0, clicks: 0, share: '42%' },
    facebook: { posts: 0, clicks: 0, share: '12%' },
    pinterest: { posts: 0, clicks: 0, share: '8%' },
    tiktok: { posts: 0, clicks: 0, share: '0%' },
    linkedin: { posts: 0, clicks: 0, share: '0%' }
  };

  posts.forEach(p => {
    p.platforms.forEach(plat => {
      if (platformStats[plat]) {
        platformStats[plat].posts++;
        if (p.status === 'published') {
          platformStats[plat].clicks += Math.floor(p.metrics.clicks / p.platforms.length);
        }
      }
    });
  });

  res.json({
    success: true,
    summary: {
      totalPosts,
      publishedPosts: publishedPosts.length,
      scheduledPosts: scheduledPosts.length,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      avgCtr
    },
    platformStats,
    topPosts: posts.slice(0, 5)
  });
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AmzSync Auto-Poster Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
