/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, ProductColorOption, ProductReview } from '../types';

export const SHOP_INFO = {
  name: 'Bari Shawl House',
  nameUrdu: 'باری شال ہاؤس',
  tagline: 'Shawls, Rumaal & Laungi — Wholesale & Retail',
  taglineUrdu: 'ملتان کی مشہور مردانہ، زنانی اور بچگانہ شالیں، رومال اور لونگی',
  phone: '03136752048',
  phoneDisplay: '0313-6752048',
  phoneTel: '+923136752048',
  whatsapp: '03334947829',
  whatsappDisplay: '0333-4947829',
  whatsappIntl: '923334947829',
  jazzCash: '03136752048',
  jazzCashDisplay: '0313-6752048',
  easyPaisa: '03136752048',
  easyPaisaDisplay: '0313-6752048',
  bankName: 'Meezan Bank',
  bankAccountNumber: '050560100939410',
  bankAccountTitle: 'Bari Shawl House',
  address: 'Dukaan No. 44, Makki Block, Multan Wholesale Market, 14 No. Multan',
  addressUrdu: 'دکان نمبر 44، مکی بلاک، ملتان ہول سیل مارکیٹ، 14 نمبر ملتان',
  city: 'Multan, Punjab, Pakistan',
  timings: 'Monday to Saturday: 10:00 AM – 9:00 PM (Sunday Closed)',
  timingsUrdu: 'پیر تا ہفتہ: صبح 10 بجے سے رات 9 بجے تک (اتوار چھٹی)',
  shippingNote:
    'Cash on Delivery (COD) available across Pakistan. Free delivery on orders above Rs. 5,000.',
};

export const POPULAR_SHAWL_COLORS: ProductColorOption[] = [
  { name: 'Jet Black', nameUrdu: 'سیاہ (بلیک)', hex: '#18181B', inStock: true },
  { name: 'Natural Off-White', nameUrdu: 'آف وائٹ کریمی', hex: '#F3EFE6', inStock: true },
  { name: 'Camel Brown', nameUrdu: 'کیمل براؤن', hex: '#B88B58', inStock: true },
  { name: 'Crimson Red', nameUrdu: 'سرخ عنابی', hex: '#991B1B', inStock: true },
  { name: 'Royal Maroon', nameUrdu: 'شاہی میرون', hex: '#5C131E', inStock: true },
  { name: 'Charcoal Grey', nameUrdu: 'چارکول گرے', hex: '#374151', inStock: true },
  { name: 'Emerald Green', nameUrdu: 'زمرد سبز', hex: '#065F46', inStock: true },
  { name: 'Navy Blue', nameUrdu: 'نیوی بلیو', hex: '#1E3A8A', inStock: true },
  { name: 'Walnut Brown', nameUrdu: 'اخروٹی براؤن', hex: '#5D4037', inStock: true },
  { name: 'Mustard Gold', nameUrdu: 'مسٹرڈ گولڈ', hex: '#B45309', inStock: true },
];

export function getProductColors(product: Product): ProductColorOption[] {
  if (product.availableColors && product.availableColors.length > 0) {
    return product.availableColors;
  }
  return [
    {
      name: product.color || 'Classic Shade',
      hex: product.colorHex || '#1E293B',
      image: product.image,
      inStock: product.inStock,
    },
  ];
}

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // 1. LADIES' SHAWLS (زنانی شالیں)
  // ==========================================
  {
    id: 'bsh-l-01',
    code: 'BSH-101',
    name: 'Crimson Red Kashmiri Embroidered Shawl',
    nameUrdu: 'سرخ کشمیری کڑھائی والی زنانی شال',
    category: 'ladies',
    price: 4850,
    originalPrice: 5600,
    material: 'Pashmina Blend',
    style: 'Heavy Kashmiri Pallu & Floral Border with Bumble Tassels',
    color: 'Crimson Red & Gold',
    colorHex: '#991B1B',
    availableColors: [
      {
        name: 'Crimson Red & Gold',
        nameUrdu: 'سرخ اور گولڈن',
        hex: '#991B1B',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM_16c56f49.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Royal Bridal Maroon',
        nameUrdu: 'شاہی دلہن میرون',
        hex: '#58111A',
        inStock: true,
      },
      {
        name: 'Emerald Bottle Green',
        nameUrdu: 'زمرد باٹل گرین',
        hex: '#064E3B',
        inStock: true,
      },
      {
        name: 'Deep Velvet Black',
        nameUrdu: 'سیاہ گولڈ زری',
        hex: '#18181B',
        inStock: true,
      },
      {
        name: 'Warm Kashmiri Plum',
        nameUrdu: 'کشمیری فالسئی',
        hex: '#4A1D34',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.50 × 1.35 meters (Full Ladies Size)',
    weightGrams: 640,
    warmthLevel: 'Heavy Winter',
    rating: 4.9,
    reviewCount: 48,
    description:
      'Rich crimson red Pashmina-blend shawl featuring intricate Kashmiri paisley and floral thread embroidery along the four-sided border, finished with hand-knotted bumble tassels. Ideal for weddings, festive gatherings, and winter formal wear.',
    descriptionUrdu:
      'خوبصورت سرخ رنگ کی پشمینہ شال جس کے چاروں اطراف نفیس کشمیری پھولدار کڑھائی اور ہاتھ سے بنی جھالر موجود ہے۔ شادی بیاہ اور تقاریب کے لیے بہترین انتخاب۔',
    care: 'Dry clean recommended. Do not wring or bleach.',
    origin: 'Multan Artisan Loom',
    patternType: 'kashmiri',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM_16c56f49.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-l-02',
    code: 'BSH-102',
    name: 'Royal Black Silver & Gold Zari Border Shawl',
    nameUrdu: 'شاہی سیاہ چاندی و سنہری زری بارڈر شال',
    category: 'ladies',
    price: 5200,
    originalPrice: 6000,
    material: 'Royal Velvet',
    style: 'Silver & Gold Zardozi Pallu Border with Twisted Fringe',
    color: 'Jet Black & Metallic Zari',
    colorHex: '#18181B',
    availableColors: [
      {
        name: 'Jet Black & Metallic Zari',
        nameUrdu: 'سیاہ اور چاندی زری',
        hex: '#18181B',
        image: '/assets/aistudio/shawl_black_silver_gold_zari.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Midnight Navy & Silver',
        nameUrdu: 'نیوی بلیو زری',
        hex: '#172554',
        inStock: true,
      },
      {
        name: 'Deep Burgundy Maroon',
        nameUrdu: 'برگنڈی میرون زری',
        hex: '#4C0519',
        inStock: true,
      },
      {
        name: 'Royal Emerald Green',
        nameUrdu: 'شاہی سبز زری',
        hex: '#064E3B',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.50 × 1.35 meters (Full Formal Drape)',
    weightGrams: 720,
    warmthLevel: 'Heavy Winter',
    rating: 4.9,
    reviewCount: 62,
    description:
      'Elegant jet-black shawl adorned with a wide silver and antique-gold Zari woven border and fine geometric motifs, completed with traditional twisted bumble fringe at both ends.',
    descriptionUrdu:
      'شاندار سیاہ رنگ کی شال جس کے پلو پر چاندی اور سنہری تلے کا نفیس بارڈر اور خوبصورت جھالر بنی ہوئی ہے۔ شادی اور دعوتوں کے لیے شاہی انتخاب۔',
    care: 'Dry clean only. Store folded in a muslin cloth bag.',
    origin: 'Multan Zardozi Workshop',
    patternType: 'royal-velvet',
    image: '/assets/aistudio/shawl_black_silver_gold_zari.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-l-03',
    code: 'BSH-103',
    name: 'Mustard & Maroon Multani Bagh Kani Shawl',
    nameUrdu: 'مسٹرڈ اور میرون ملتانی باغ کانی شال',
    category: 'ladies',
    price: 3800,
    originalPrice: 4400,
    material: 'Pure Wool',
    style: 'All-Over Multani Floral Bagh Jaal with Tassel Fringe',
    color: 'Mustard Gold & Maroon',
    colorHex: '#B45309',
    availableColors: [
      {
        name: 'Mustard Gold & Maroon',
        nameUrdu: 'مسٹرڈ گولڈ اور میرون',
        hex: '#B45309',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.34_AM_48b5f5b4.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Rust Orange & Olive',
        nameUrdu: 'رسٹ اور زیتونی',
        hex: '#9A3412',
        inStock: true,
      },
      {
        name: 'Ruby Red & Gold Jaal',
        nameUrdu: 'روبی سرخ جال',
        hex: '#881337',
        inStock: true,
      },
      {
        name: 'Deep Teal & Amber',
        nameUrdu: 'فیروزی اور امبر',
        hex: '#115E59',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '2.45 × 1.35 meters',
    weightGrams: 590,
    warmthLevel: 'Heavy Winter',
    rating: 4.8,
    reviewCount: 39,
    description:
      'Warm woven wool shawl covered in a vibrant Multani Bagh floral jaal in mustard gold, deep maroon, and olive green threads, finished with soft braided bumble ends.',
    descriptionUrdu:
      'مسٹرڈ گولڈ اور میرون رنگوں کے حسین امتزاج میں مکمل پھولدار ملتانی باغ جال والی گرم اونی شال۔ سردیوں کے روزمرہ اور تقریبات دونوں کے لیے موزوں۔',
    care: 'Gentle cold hand wash with wool shampoo or dry clean.',
    origin: 'Multan Heritage Looms',
    patternType: 'paisley',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.34_AM_48b5f5b4.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-l-04',
    code: 'BSH-104',
    name: 'Ivory Cream Kashmiri Paisley Embroidered Shawl',
    nameUrdu: 'آف وائٹ کریمی کشمیری بوٹی کڑھائی شال',
    category: 'ladies',
    price: 3400,
    originalPrice: 3950,
    material: 'Soft Acrylic',
    style: 'Delicate Multi-Color Kashmiri Paisley & Vine Embroidery',
    color: 'Ivory Cream & Rose',
    colorHex: '#EAE0C8',
    availableColors: [
      {
        name: 'Ivory Cream & Rose',
        nameUrdu: 'آف وائٹ اور گلابی کڑھائی',
        hex: '#EAE0C8',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__1__00873d76.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Soft Blush Pink',
        nameUrdu: 'ہلکا گلابی (ٹی پنک)',
        hex: '#FBCFE8',
        inStock: true,
      },
      {
        name: 'Pistachio Mint',
        nameUrdu: 'پستہ سبز',
        hex: '#D1FAE5',
        inStock: true,
      },
      {
        name: 'Warm Sand Beige',
        nameUrdu: 'بادامی سینڈ',
        hex: '#D6C7B2',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '2.40 × 1.30 meters',
    weightGrams: 510,
    warmthLevel: 'Mid-Winter',
    rating: 4.8,
    reviewCount: 31,
    description:
      'Soft ivory-cream winter shawl decorated with fine colorful Kashmiri floral vines and paisley motifs across the border and body, complete with knotted fringe tassels.',
    descriptionUrdu:
      'نرم و ملائم آف وائٹ کریمی شال جس پر رنگا رنگ کشمیری بیل اور کیری ڈیزائن کی نفیس کڑھائی کی گئی ہے۔ ہلکی اور گرم شال۔',
    care: 'Hand wash in cold water; dry flat in shade.',
    origin: 'Multan Textile Market',
    patternType: 'kashmiri',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__1__00873d76.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },

  // ==========================================
  // 2. GENTS' SHAWLS (مردانہ شالیں)
  // ==========================================
  {
    id: 'bsh-g-01',
    code: 'BSH-201',
    name: "Men's Charcoal Grey Gold-Border Wool Shawl",
    nameUrdu: 'چارکول گرے گولڈن بارڈر مردانہ اونی شال',
    category: 'gents',
    price: 4200,
    originalPrice: 4900,
    material: 'Pure Wool',
    style: 'Classic Gents Woven Gold-Thread Border with Bumble Fringe',
    color: 'Charcoal Grey & Gold',
    colorHex: '#374151',
    availableColors: [
      {
        name: 'Charcoal Grey & Gold',
        nameUrdu: 'چارکول گرے',
        hex: '#374151',
        image: '/assets/aistudio/shawl_charcoal_gold_border.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Camel Brown & Gold',
        nameUrdu: 'کیمل براؤن',
        hex: '#B88B58',
        inStock: true,
      },
      {
        name: 'Jet Black & Gold',
        nameUrdu: 'سیاہ گولڈن بارڈر',
        hex: '#18181B',
        inStock: true,
      },
      {
        name: 'Dark Chocolate Brown',
        nameUrdu: 'ڈارک چاکلیٹ براؤن',
        hex: '#452719',
        inStock: true,
      },
      {
        name: 'Ash Silver Grey',
        nameUrdu: 'ایش سلور گرے',
        hex: '#9CA3AF',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.55 × 1.38 meters (Full Gents Size)',
    weightGrams: 690,
    warmthLevel: 'Heavy Winter',
    rating: 4.9,
    reviewCount: 54,
    description:
      'Dignified charcoal-grey pure wool gents shawl woven with a subtle golden geometric Pallu border and hand-twisted bumble tassels. Drapes gracefully over shalwar kameez and waistcoats.',
    descriptionUrdu:
      'باوقار چارکول گرے رنگ کی خالص اونی مردانہ شال جس کے کناروں پر نفیس گولڈن بارڈر اور روایتی جھالر بنی ہوئی ہے۔ شلوار قمیض اور واسکٹ کے ساتھ بہترین۔',
    care: 'Dry clean or gentle cold wool wash.',
    origin: 'Multan Master Weavers',
    patternType: 'herringbone',
    image: '/assets/aistudio/shawl_charcoal_gold_border.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-g-02',
    code: 'BSH-202',
    name: "Men's Off-White Swati Wool Lohi Shawl",
    nameUrdu: 'آف وائٹ سواتی اونی مردانہ لوئی شال',
    category: 'gents',
    price: 4500,
    originalPrice: 5200,
    material: 'Swati Wool',
    style: 'Authentic Swati Geometric Woven Pallu & Bumble Tassels',
    color: 'Natural Off-White & Brown Border',
    colorHex: '#F5F2EB',
    availableColors: [
      {
        name: 'Natural Off-White & Brown Border',
        nameUrdu: 'قدرتی آف وائٹ لوئی',
        hex: '#F5F2EB',
        image: '/assets/aistudio/shawl_offwhite_mens_lohi.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Warm Camel Desert',
        nameUrdu: 'کیمل ڈیزرٹ',
        hex: '#C19A6B',
        inStock: true,
      },
      {
        name: 'Natural Sheep Grey',
        nameUrdu: 'قدرتی سلیٹی گرے',
        hex: '#78716C',
        inStock: true,
      },
      {
        name: 'Obsidian Black Swati',
        nameUrdu: 'سواتی سیاہ',
        hex: '#1C1917',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.60 × 1.40 meters (Full Gents Lohi)',
    weightGrams: 740,
    warmthLevel: 'Heavy Winter',
    rating: 4.9,
    reviewCount: 44,
    description:
      'Authentic off-white men’s Swati wool Lohi shawl with a traditional earthy brown and gold geometric woven border and full hand-knotted bumble tassels at the designing ends.',
    descriptionUrdu:
      'اصلی آف وائٹ مردانہ سواتی اونی لوئی شال جس کے پلو پر روایتی ڈیزائننگ بارڈر اور مضبوط ہاتھ سے بنی جھالر موجود ہے۔ شدید سردی کے لیے شاندار گرم شال۔',
    care: 'Dry clean or cold hand wash; do not machine spin.',
    origin: 'Swat & Multan Handloom',
    patternType: 'geometric',
    image: '/assets/aistudio/shawl_offwhite_mens_lohi.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },

  // ==========================================
  // 3. CHILDREN'S SHAWLS / BECHGANA (بچگانہ شالیں)
  // ==========================================
  {
    id: 'bsh-b-01',
    code: 'BSH-301',
    name: 'Bechgana Maroon & Gold Woven Border Youth Shawl',
    nameUrdu: 'بچگانہ میرون اور گولڈن بارڈر شال',
    category: 'bechgana',
    price: 2250,
    originalPrice: 2700,
    material: 'Soft Acrylic',
    style: 'Lightweight Non-Itchy Youth Size with Bumble Tassels',
    color: 'Deep Maroon & Gold',
    colorHex: '#6B1D2F',
    availableColors: [
      {
        name: 'Deep Maroon & Gold',
        nameUrdu: 'ڈیپ میرون',
        hex: '#6B1D2F',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.31_AM_35943193.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Royal Navy Youth',
        nameUrdu: 'رائیل نیوی بلیو',
        hex: '#1E3A8A',
        inStock: true,
      },
      {
        name: 'Camel Fawn Youth',
        nameUrdu: 'کیمل بادامی',
        hex: '#B88B58',
        inStock: true,
      },
      {
        name: 'Classic Black Youth',
        nameUrdu: 'کلاسک بلیک',
        hex: '#18181B',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.10 × 1.10 meters (Youth / Under 16 Size)',
    weightGrams: 390,
    warmthLevel: 'Mid-Winter',
    rating: 4.8,
    reviewCount: 27,
    description:
      'Specially proportioned Bechgana shawl for boys and girls under 16. Woven from feather-soft, non-itchy acrylic wool with a festive maroon and gold border and neat bumble tassels.',
    descriptionUrdu:
      '15 سے 16 سال تک کے بچوں اور بچیوں کے لیے خصوصی سائز کی نرم اور آرام دہ شال۔ خارش سے پاک، ہلکی اور گرم۔',
    care: 'Easy hand or gentle machine wash at home.',
    origin: 'Multan Weavers',
    patternType: 'paisley',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.31_AM_35943193.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-b-02',
    code: 'BSH-302',
    name: 'Bechgana Walnut Brown Kashmiri Youth Shawl',
    nameUrdu: 'بچگانہ اخروٹی براؤن کشمیری شال',
    category: 'bechgana',
    price: 2400,
    originalPrice: 2850,
    material: 'Pashmina Blend',
    style: 'Youth Kashmiri Woven Pallu with Soft Fringe Ends',
    color: 'Walnut Brown & Amber',
    colorHex: '#5D4037',
    availableColors: [
      {
        name: 'Walnut Brown & Amber',
        nameUrdu: 'اخروٹی براؤن',
        hex: '#5D4037',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.32_AM__2__ea5af5ae.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Charcoal Slate Youth',
        nameUrdu: 'چارکول سلیٹی',
        hex: '#374151',
        inStock: true,
      },
      {
        name: 'Cream Off-White Youth',
        nameUrdu: 'آف وائٹ کریمی',
        hex: '#F3EFE6',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '2.10 × 1.15 meters (Youth / School & Event Wear)',
    weightGrams: 410,
    warmthLevel: 'Mid-Winter',
    rating: 4.7,
    reviewCount: 22,
    description:
      'Warm walnut-brown Bechgana shawl with a classic Kashmiri woven border and soft bumble fringe. Sized comfortably for young shoulders at family weddings, school mornings, and winter outings.',
    descriptionUrdu:
      'بچوں کے کندھوں کے مطابق تیار کردہ خوبصورت اخروٹی براؤن کشمیری بارڈر شال۔ شادی بیاہ اور سردیوں کی صبح کے لیے بہترین۔',
    care: 'Gentle cold wash.',
    origin: 'Multan Weavers',
    patternType: 'kashmiri',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.32_AM__2__ea5af5ae.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },

  // ==========================================
  // 4. RUMAAL (ملتانی رومال)
  // ==========================================
  {
    id: 'bsh-r-01',
    code: 'BSH-401',
    name: 'Traditional Multani Woven Cotton Rumaal Wrap',
    nameUrdu: 'روایتی ملتانی ہینڈ لوم کاٹن رومال',
    category: 'rumaal',
    price: 1450,
    originalPrice: 1800,
    material: 'Fine Cotton',
    style: 'Handloom Multani Checkered & Border Weave with Tassels',
    color: 'Earthy Crimson & Cream',
    colorHex: '#7F1D1D',
    availableColors: [
      {
        name: 'Earthy Crimson & Cream',
        nameUrdu: 'سرخ اور کریمی چیک',
        hex: '#7F1D1D',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__2__0c743348.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Pure White Prayer Rumaal',
        nameUrdu: 'سفید نماز رومال',
        hex: '#F8FAFC',
        inStock: true,
      },
      {
        name: 'Classic Black & White Check',
        nameUrdu: 'سیاہ و سفید چیک',
        hex: '#1E293B',
        inStock: true,
      },
      {
        name: 'Emerald Green Prayer Wrap',
        nameUrdu: 'سبز مدنی رومال',
        hex: '#065F46',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '1.40 × 1.40 meters (Large Square Rumaal)',
    weightGrams: 280,
    warmthLevel: 'All-Season',
    rating: 4.9,
    reviewCount: 41,
    description:
      'Breathable 100% pure combed cotton Multani Rumaal featuring traditional woven borders and knotted bumble tassels. Worn comfortably as a shoulder wrap, prayer cloth, or head cover in all seasons.',
    descriptionUrdu:
      'خالص سوتی دھاگے سے بنا ہوا روایتی ملتانی رومال جس کے کناروں پر خوبصورت بارڈر اور جھالر موجود ہے۔ نماز اور کندھے پر رکھنے کے لیے بہترین۔',
    care: 'Machine washable in cold water; colorfast threads.',
    origin: 'Multan Handloom Cluster',
    patternType: 'geometric',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__2__0c743348.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 24,
  },

  // ==========================================
  // 5. LAUNGI (ملتانی لونگی)
  // ==========================================
  {
    id: 'bsh-lg-01',
    code: 'BSH-501',
    name: 'Authentic Multani Handloom Striped Zari Laungi',
    nameUrdu: 'اصلی ملتانی ہینڈ لوم زری دھاری دار لونگی',
    category: 'laungi',
    price: 2650,
    originalPrice: 3200,
    material: 'Silk Blend',
    style: 'Traditional Multani Banded Stripe Weave with Fringe Ends',
    color: 'Royal Crimson, Gold & Indigo Stripes',
    colorHex: '#881337',
    availableColors: [
      {
        name: 'Royal Crimson, Gold & Indigo Stripes',
        nameUrdu: 'شاہی سرخ و سنہری دھاری دار',
        hex: '#881337',
        image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.35_AM_b669c711.jpeg?v=3',
        inStock: true,
      },
      {
        name: 'Emerald Green & Gold Zari',
        nameUrdu: 'زمرد سبز و گولڈن زری',
        hex: '#065F46',
        inStock: true,
      },
      {
        name: 'Indigo Blue & Silver Stripe',
        nameUrdu: 'نیلا اور چاندی دھاری دار',
        hex: '#1E3A8A',
        inStock: true,
      },
      {
        name: 'Classic Brown & Mustard Cotton',
        nameUrdu: 'براؤن اور مسٹرڈ سوتی لونگی',
        hex: '#78350F',
        inStock: true,
      },
    ],
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.50 × 1.30 meters (Full Traditional Size)',
    weightGrams: 360,
    warmthLevel: 'All-Season',
    rating: 4.9,
    reviewCount: 36,
    description:
      'Authentic Multani handloom Laungi woven with rich heritage stripes, metallic Zari border bands, and hand-tied bumble tassels. A prized traditional garment for cultural festivities, dastarbandi, and daily wear.',
    descriptionUrdu:
      'ملتان کی مشہور ہاتھ کی کھڈی پر تیار کردہ روایتی دھاری دار زری لونگی۔ ثقافتی تقریبات، دستار بندی اور روزمرہ استعمال کے لیے اعلیٰ معیار۔',
    care: 'Gentle hand wash in cold water; iron on low heat.',
    origin: 'Old Multan Khaddi Looms',
    patternType: 'laungi-stripe',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.35_AM_b669c711.jpeg?v=3',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
];

export const INITIAL_REVIEWS: Record<string, ProductReview[]> = {
  'bsh-l-01': [
    {
      id: 'rev-1',
      author: 'Ayesha Tariq',
      city: 'Lahore',
      rating: 5,
      date: '2 days ago',
      comment:
        'Ordered the Crimson Red & Gold for my sister’s Valima. The Kashmiri embroidery and bumble tassels on the pallu look even richer in person than in the photos!',
      verifiedColor: 'Crimson Red & Gold',
    },
    {
      id: 'rev-2',
      author: 'Haji Muhammad Nadeem',
      city: 'Multan',
      rating: 5,
      date: '1 week ago',
      comment:
        'Visited Dukaan No. 44 in Makki Block and also ordered 3 pieces online for family. Pure winter warmth and genuine wholesale market pricing.',
      verifiedColor: 'Royal Bridal Maroon',
    },
  ],
  'bsh-g-01': [
    {
      id: 'rev-3',
      author: 'Malik Farooq Ahmed',
      city: 'Islamabad',
      rating: 5,
      date: '3 days ago',
      comment:
        'The Charcoal Grey wool shawl has a very graceful fall over Shalwar Kameez and waistcoat. Delivered to Islamabad in 2 days with Cash on Delivery.',
      verifiedColor: 'Charcoal Grey & Gold',
    },
    {
      id: 'rev-4',
      author: 'Zوهیب الحسن (Zohaib)',
      city: 'Faisalabad',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Ordered both Charcoal Grey and Camel Brown. Heavy winter weave and neat hand-knotted bumble ends.',
      verifiedColor: 'Camel Brown & Gold',
    },
  ],
  'bsh-g-02': [
    {
      id: 'rev-5',
      author: 'Sardar Kamran Khan',
      city: 'Peshawar',
      rating: 5,
      date: '4 days ago',
      comment:
        'Real Swati wool Lohi with proper geometric border and full length (2.60m). Very warm for December and January nights.',
      verifiedColor: 'Natural Off-White & Brown Border',
    },
  ],
};

export const DEFAULT_PRODUCT_REVIEWS: ProductReview[] = [
  {
    id: 'rev-def-1',
    author: 'Mian Usman Ghani',
    city: 'Multan',
    rating: 5,
    date: '5 days ago',
    comment:
      'Authentic Multan Wholesale Market quality from Bari Shawl House. Fast delivery, neat packaging, and exact color as selected.',
  },
  {
    id: 'rev-def-2',
    author: 'Fatima Zahra',
    city: 'Lahore',
    rating: 5,
    date: '2 weeks ago',
    comment:
      'Soft fabric, neat border finishing with full bumble tassels, and very reasonable price compared to big retail malls.',
  },
];

export const CATEGORY_INFO = [
  {
    id: 'all',
    name: 'All Collections',
    nameUrdu: 'تمام ورائٹی',
    subtitle: 'Complete Catalog',
    description: 'Browse all Gents, Ladies, and Bechgana shawls, Rumaal, and Laungi.',
  },
  {
    id: 'gents',
    name: 'Gents’ Shawls',
    nameUrdu: 'مردانہ شالیں',
    subtitle: 'Pure Wool, Swati & Pashmina',
    description:
      'Dignified winter shawls for men in pure wool, Swati borders, and fine herringbone weaves.',
  },
  {
    id: 'ladies',
    name: 'Ladies’ Shawls',
    nameUrdu: 'زنانی شالیں',
    subtitle: 'Velvet, Kashmiri & Bridal',
    description:
      'Embroidered micro-velvet, Kashmiri floral wool, and soft daily winter shawls for women.',
  },
  {
    id: 'bechgana',
    name: 'Bechgana (Children’s)',
    nameUrdu: 'بچگانہ شالیں',
    subtitle: 'Youth Sizes (Under 16 Years)',
    description:
      'Soft, non-itchy, and lightweight warm shawls specially proportioned for boys and girls.',
  },
  {
    id: 'rumaal',
    name: 'Rumaal',
    nameUrdu: 'ملتانی رومال',
    subtitle: 'Woven & Prayer Wraps',
    description:
      'Traditional Multani checkered cotton rumaals and serene prayer wraps with fine borders.',
  },
  {
    id: 'laungi',
    name: 'Laungi',
    nameUrdu: 'ملتانی لونگی',
    subtitle: 'Handloom Cultural Wraps',
    description:
      'Authentic Multani handloom striped and Zari-bordered traditional laungis.',
  },
] as const;

export function buildWhatsAppProductUrl(
  product: Product,
  quantity = 1,
  selectedColor?: ProductColorOption
): string {
  const chosenColor = selectedColor?.name || product.color;
  const text = `Assalam-o-Alaikum *Bari Shawl House*!
I would like to order this item:

• *Item:* ${product.name} (${product.nameUrdu})
• *Item Code:* ${product.code}
• *Category:* ${product.category.toUpperCase()}
• *Selected Color:* ${chosenColor}
• *Fabric:* ${product.material}
• *Price:* Rs. ${product.price.toLocaleString()}
• *Quantity:* ${quantity}
• *Total:* Rs. ${(product.price * quantity).toLocaleString()}

Please confirm availability and delivery details.`;

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppCartUrl(
  items: { product: Product; quantity: number; selectedColor?: ProductColorOption }[],
  customer?: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    paymentMethod: string;
  },
  discountAmount = 0
): string {
  const lines = items.map(
    (item, idx) =>
      `${idx + 1}. *${item.product.name}* (${item.product.code}) — Color: ${
        item.selectedColor?.name || item.product.color
      } × ${item.quantity} = Rs. ${(item.product.price * item.quantity).toLocaleString()}`
  );
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = afterDiscount >= 5000 ? 0 : 250;
  const total = afterDiscount + shipping;

  let text = `Assalam-o-Alaikum *Bari Shawl House*!
*New Online Order Request:*

${lines.join('\n')}

• *Subtotal:* Rs. ${subtotal.toLocaleString()}${
    discountAmount > 0 ? `\n• *Bundle Discount:* -Rs. ${discountAmount.toLocaleString()}` : ''
  }
• *Delivery Charges:* ${shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
• *Grand Total:* *Rs. ${total.toLocaleString()}*`;

  if (customer && customer.fullName) {
    text += `

*Customer Delivery Details:*
• *Name:* ${customer.fullName}
• *Phone:* ${customer.phone}
• *City:* ${customer.city}
• *Address:* ${customer.address}
• *Payment Method:* ${customer.paymentMethod.toUpperCase()}`;
  }

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppWholesaleUrl(inquiry: {
  businessName: string;
  contactPerson: string;
  phone: string;
  city: string;
  category: string;
  quantity: string;
  requirements: string;
}): string {
  const text = `Assalam-o-Alaikum *Bari Shawl House*!
*Wholesale / Bulk Rate Inquiry (Makki Block Multan):*

• *Business / Shop Name:* ${inquiry.businessName}
• *Contact Person:* ${inquiry.contactPerson}
• *Phone:* ${inquiry.phone}
• *City:* ${inquiry.city}
• *Interested Category:* ${inquiry.category}
• *Estimated Quantity:* ${inquiry.quantity} pieces
• *Notes:* ${inquiry.requirements || 'Please share wholesale catalog & bulk rates.'}`;

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(text)}`;
}
