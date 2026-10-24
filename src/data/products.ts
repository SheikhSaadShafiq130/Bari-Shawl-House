/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const SHOP_INFO = {
  name: 'Bari Textile Multan',
  nameUrdu: 'باری ٹیکسٹائل ملتان',
  tagline: 'Multan Wholesale Market · Quality Shawls, Rumaal & Laungi',
  taglineUrdu: 'ملتان ہول سیل مارکیٹ · معیاری شالیں، رومال اور لونگی',
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
  address: 'Dukaan No. 44, Makki Block, Multan Wholesale Market, 14 No. Multan',
  addressUrdu: 'دکان نمبر 44، مکی بلاک، ملتان ہول سیل مارکیٹ، 14 نمبر ملتان',
  city: 'Multan, Punjab, Pakistan',
  timings: 'Monday to Saturday: 10:00 AM – 9:00 PM (Friday Break: 1:00 PM – 3:00 PM) · Sunday: Closed',
  deliveryPolicy: 'Free delivery on orders above Rs. 5,000 anywhere in Pakistan. Standard delivery is Rs. 250 (2 to 4 days via TCS, Leopards, or Call Courier).',
  wholesaleNote: 'Special wholesale rates available for shopkeepers, boutiques, and wedding bulk orders (Minimum 12 pieces).',
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Ladies' Shawls (4 Unique Designs)
  {
    id: 'bsh-l-01',
    code: 'BTM-L101',
    name: 'Red Floral Embroidered Wedding Shawl',
    nameUrdu: 'سرخ پھولدار کڑھائی والی شادی کی شال',
    category: 'ladies',
    price: 5800,
    originalPrice: 6800,
    material: 'Pure Wool',
    style: 'All-Over Floral Embroidery with Traditional Border & Bumble',
    color: 'Bright Red & Gold',
    colorHex: '#991B1B',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM_16c56f49.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.5 × 1.15 meters (Full Size)',
    description:
      'Beautiful bright red winter shawl covered with neat floral thread work, a rich woven border, and red bumble tassels at the designing end. Very warm and ideal for weddings, brides, and family functions.',
    descriptionUrdu:
      'خوبصورت سرخ رنگ کی گرم شال جس پر نفیس پھولدار کڑھائی، روایتی بارڈر اور پلو پر بمبل لگے ہوئے ہیں۔ شادی بیاہ اور خاص تقاریب کے لیے بہترین۔',
    care: 'Dry clean or gentle hand wash in cold water.',
    origin: 'Multan Artisans',
    patternType: 'kashmiri',
    wholesaleAvailable: true,
    wholesaleMinQty: 6,
  },
  {
    id: 'bsh-l-02',
    code: 'BTM-L102',
    name: 'Light Green Shawl with Maroon Floral Border',
    nameUrdu: 'ہلکی سبز شال مہرون پھولدار بارڈر کے ساتھ',
    category: 'ladies',
    price: 4200,
    originalPrice: 4900,
    material: 'Pashmina Blend',
    style: 'Contrast Maroon Woven Border, Floral Motifs & Bumble',
    color: 'Light Pistachio Green & Maroon',
    colorHex: '#4D7C5D',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__2__0c743348.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.45 × 1.15 meters (Full Size)',
    description:
      'Soft light green shawl featuring a wide maroon traditional border, pretty maroon flower patterns, and matching green bumble fringe at the designing end. Lightweight, warm, and easy to drape.',
    descriptionUrdu:
      'ہلکے سبز رنگ کی نرم اور گرم شال جس کے چاروں طرف خوبصورت مہرون بارڈر، پھول اور کنارے پر بمبل بنے ہوئے ہیں۔',
    care: 'Gentle hand wash at home.',
    origin: 'Multan Handloom',
    patternType: 'paisley',
    wholesaleAvailable: true,
    wholesaleMinQty: 10,
  },
  {
    id: 'bsh-l-03',
    code: 'BTM-L103',
    name: 'Golden Beige Floral Embroidered Shawl',
    nameUrdu: 'گولڈن بیج پھولدار کڑھائی والی شال',
    category: 'ladies',
    price: 4600,
    originalPrice: 5400,
    material: 'Pure Wool',
    style: 'Floral Vine Embroidery with Maroon Border & Bumble',
    color: 'Golden Beige & Maroon',
    colorHex: '#B89758',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.34_AM_48b5f5b4.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '2.45 × 1.15 meters (Full Size)',
    description:
      'Warm golden-beige shawl decorated with neat floral vine embroidery, small maroon and black flowers, a classic woven maroon border, and golden bumble tassels at the designing end.',
    descriptionUrdu:
      'گولڈن بیج رنگ میں نفیس بیل اور پھولوں کی کڑھائی والی گرم شال، مہرون بارڈر اور بمبل کے ساتھ۔',
    care: 'Dry clean or gentle cold wash.',
    origin: 'Multan Embroidery Unit',
    patternType: 'kashmiri',
    wholesaleAvailable: true,
    wholesaleMinQty: 10,
  },
  {
    id: 'bsh-l-04',
    code: 'BTM-L104',
    name: 'Black Shawl with Silver-Gold Zari Border',
    nameUrdu: 'سیاہ شال سلور گولڈ زری بارڈر کے ساتھ',
    category: 'ladies',
    price: 4800,
    originalPrice: 5600,
    material: 'Pashmina Blend',
    style: 'Fine Silver-Gold Zari Designing End & Bumble',
    color: 'Jet Black & Silver-Gold',
    colorHex: '#18181B',
    image: '/assets/aistudio/shawl_black_silver_gold_zari.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.45 × 1.15 meters (Full Size)',
    description:
      'Graceful jet-black winter shawl finished with a delicate silver-gold zari woven designing border and twisted bumble tassels at the bottom end. Soft, warm, and matches both light and dark dresses.',
    descriptionUrdu:
      'سیاہ رنگ کی نفیس گرم شال جس کے پلو پر خوبصورت سلور گولڈ زری پٹی اور بمبل بنے ہوئے ہیں۔',
    care: 'Dry clean or gentle hand wash.',
    origin: 'Multan & Kashmir Craft',
    patternType: 'paisley',
    wholesaleAvailable: true,
    wholesaleMinQty: 10,
  },

  // 2. Gents' Shawls (3 Unique Designs)
  {
    id: 'bsh-g-01',
    code: 'BTM-G201',
    name: "Men's Charcoal Grey Wool Shawl with Golden Border",
    nameUrdu: 'چارکول گرے مردانہ اونی شال گولڈن بارڈر کے ساتھ',
    category: 'gents',
    price: 4900,
    originalPrice: 5700,
    material: 'Pure Wool',
    style: 'Golden Woven Designing Border & Bumble Tassels',
    color: 'Charcoal Dark Grey & Gold',
    colorHex: '#333538',
    image: '/assets/aistudio/shawl_charcoal_gold_border.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.55 × 1.35 meters (Full Gents Size)',
    description:
      'Warm dark charcoal grey wool shawl for men featuring a traditional golden woven border band, fine gold stripe, and dark twisted bumble tassels at the designing end.',
    descriptionUrdu:
      'مردانہ چارکول گرے خالص اونی گرم شال، روایتی گولڈن بنے ہوئے بارڈر اور بمبل کے ساتھ۔',
    care: 'Dry clean or gentle hand wash in cold water.',
    origin: 'Multan & Swat Weavers',
    patternType: 'herringbone',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-g-02',
    code: 'BTM-G202',
    name: 'Light Brown Shawl with Golden Leaf Border',
    nameUrdu: 'ہلکی براؤن شال گولڈن پتی کڑھائی بارڈر کے ساتھ',
    category: 'gents',
    price: 4500,
    originalPrice: 5200,
    material: 'Pure Wool',
    style: 'Four-Side Golden Leaf Embroidered Border & Bumble',
    color: 'Light Brown & Gold',
    colorHex: '#8C735B',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.32_AM__2__ea5af5ae.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.5 × 1.35 meters (Full Size)',
    description:
      'Warm light brown wool shawl featuring neat golden leaf embroidery along all four sides and matching bumble tassels at the designing end. Looks graceful for daily winter wear and family invitations.',
    descriptionUrdu:
      'ہلکے براؤن رنگ کی خالص اونی گرم شال جس کے چاروں طرف سنہری پتوں کی نفیس کڑھائی اور کنارے پر بمبل لگے ہوئے ہیں۔',
    care: 'Dry clean or gentle hand wash in cold water.',
    origin: 'Multan Weavers',
    patternType: 'herringbone',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
  {
    id: 'bsh-g-03',
    code: 'BTM-G203',
    name: 'Black Shawl with Wide Golden Woven Border',
    nameUrdu: 'سیاہ شال چوڑے سنہری بنے ہوئے بارڈر کے ساتھ',
    category: 'gents',
    price: 5200,
    originalPrice: 6000,
    material: 'Pashmina Blend',
    style: 'Four-Side Wide Golden Paisley Border & Bumble',
    color: 'Jet Black & Gold',
    colorHex: '#0F172A',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.33_AM__1__00873d76.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.55 × 1.35 meters (Full Size)',
    description:
      'Classic black winter shawl with a wide golden paisley woven border on the sides and bottom, finished with twisted bumble tassels at the designing end.',
    descriptionUrdu:
      'شاندار سیاہ رنگ کی گرم شال جس کے چاروں طرف چوڑا سنہری بارڈر اور پلو پر بمبل بنے ہوئے ہیں۔',
    care: 'Dry clean or gentle cold hand wash.',
    origin: 'Multan & Kashmir Craft',
    patternType: 'paisley',
    wholesaleAvailable: true,
    wholesaleMinQty: 10,
  },

  // 3. Children & Youth Shawls (Bechgana - 1 Unique Design)
  {
    id: 'bsh-b-01',
    code: 'BTM-B301',
    name: 'Teal Blue & Cream Woven Design Shawl',
    nameUrdu: 'فیروزی اور کریم بنے ہوئے ڈیزائن والی شال',
    category: 'bechgana',
    price: 3500,
    originalPrice: 4200,
    material: 'Soft Acrylic',
    style: 'Full Jacquard Floral Weave with Arch Pallu & Bumble',
    color: 'Teal Blue & Cream',
    colorHex: '#0F766E',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.31_AM_35943193.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.1 × 1.05 meters (Medium / Youth Size)',
    description:
      'Soft woven shawl in attractive teal blue and cream floral design with a traditional arch designing end and golden-cream bumble tassels at the bottom.',
    descriptionUrdu:
      'فیروزی اور کریم رنگ کے خوبصورت بنے ہوئے ڈیزائن اور بمبل والی نرم اور آرام دہ گرم شال۔',
    care: 'Easy hand wash at home.',
    origin: 'Multan Weaving Unit',
    patternType: 'geometric',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },

  // 4. Rumaal & Lohi Wraps (1 Unique Design)
  {
    id: 'bsh-r-01',
    code: 'BTM-R401',
    name: "Men's Off-White Swati Wool Shawl",
    nameUrdu: 'مردانہ آف وائٹ سواتی اونی شال اور لوئی',
    category: 'rumaal',
    price: 3900,
    originalPrice: 4600,
    material: 'Swati Wool',
    style: 'Fine Off-White Wool with Thin Swati Patti & Bumble',
    color: 'Off-White & Dark Brown-Olive',
    colorHex: '#EDE9DF',
    image: '/assets/aistudio/shawl_offwhite_mens_lohi.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.45 × 1.3 meters (Full Wrap Size)',
    description:
      'Authentic men’s off-white Swati wool shawl and Lohi finished with a fine dark-brown and olive geometric Swati woven border strip, thin double-line stripe, and soft off-white wool bumble tassels at the designing end.',
    descriptionUrdu:
      'اصلی مردانہ آف وائٹ سواتی اونی شال اور لوئی، باریک روایتی سواتی بارڈر پٹی اور سفید اونی بمبل کے ساتھ۔',
    care: 'Gentle hand wash in cold water.',
    origin: 'Multan & Swat Traditional Handloom',
    patternType: 'herringbone',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },

  // 5. Laungi & Striped Wraps (1 Unique Design)
  {
    id: 'bsh-lg-01',
    code: 'BTM-L501',
    name: 'Black Shawl with Colorful Striped Border',
    nameUrdu: 'سیاہ شال رنگ برنگے دھاری دار بارڈر کے ساتھ',
    category: 'laungi',
    price: 3800,
    originalPrice: 4500,
    material: 'Soft Acrylic',
    style: 'Multi-Color Woven Stripes & Colorful Bumble Tassels',
    color: 'Black with Multi-Color Border',
    colorHex: '#1E293B',
    image: '/assets/aistudio/WhatsApp_Image_2026-10-24_at_5.13.35_AM_b669c711.jpeg?v=3',
    inStock: true,
    featured: true,
    isNew: true,
    dimensions: '2.4 × 1.15 meters (Full Length)',
    description:
      'Stylish jet-black winter shawl and wrap finished with bright red, blue, green, and white striped edges and colorful bumble tassels at the designing end.',
    descriptionUrdu:
      'کالے رنگ کی دلکش گرم شال جس کے کناروں پر خوبصورت رنگ برنگی پٹیاں اور بمبل لگے ہوئے ہیں۔',
    care: 'Easy hand wash in cold water.',
    origin: 'Multan Master Handlooms',
    patternType: 'laungi-stripe',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
  },
];

export const CATEGORY_INFO = [
  {
    id: 'all',
    name: 'All Products',
    nameUrdu: 'تمام ورائٹی',
    description: 'Browse all 10 unique shawl designs in easy English wording with real fabric photos.',
    count: 10,
  },
  {
    id: 'ladies',
    name: "Ladies’ Shawls",
    nameUrdu: 'زنانی شالیں',
    description: 'Red floral wedding shawls, light green maroon border shawls, golden beige floral shawls, and black zari border shawls.',
    count: 4,
  },
  {
    id: 'gents',
    name: "Gents’ Shawls",
    nameUrdu: 'مردانہ شالیں',
    description: 'Charcoal grey golden border wool shawls, light brown golden leaf shawls, and black wide golden border shawls.',
    count: 3,
  },
  {
    id: 'bechgana',
    name: "Children & Youth Shawls",
    nameUrdu: 'بچگانہ اور نوجوانوں کی شالیں',
    description: 'Soft teal blue and cream woven design shawls in comfortable medium size.',
    count: 1,
  },
  {
    id: 'rumaal',
    name: 'Lohi & Rumaal Wraps',
    nameUrdu: 'لوئی اور رومال شال',
    description: 'Traditional off-white pure wool Lohi and shoulder wraps with thin woven borders.',
    count: 1,
  },
  {
    id: 'laungi',
    name: 'Striped Border & Laungi',
    nameUrdu: 'دھاری دار شال اور لونگی',
    description: 'Black shawls and wraps with bright multi-color woven striped borders and tassels.',
    count: 1,
  },
];

/**
 * Creates pre-composed WhatsApp message URL for a single product
 */
export function buildWhatsAppProductUrl(product: Product, quantity = 1): string {
  const message = `Assalam-o-Alaikum Bari Textile Multan!
I want to order / ask about this item:
*Product:* ${product.name}
*Item Code:* ${product.code}
*Price:* Rs. ${product.price.toLocaleString()}
*Quantity:* ${quantity}
*Fabric:* ${product.material} (${product.color})

Please tell me if it is available and how to get delivery. Thank you!`;

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCartUrl(
  items: { product: Product; quantity: number }[],
  form?: { fullName: string; city: string; address: string; phone: string; paymentMethod?: string }
): string {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const itemsList = items
    .map(
      (i, idx) =>
        `${idx + 1}. ${i.product.name} (${i.product.code}) × ${i.quantity} = Rs. ${(
          i.product.price * i.quantity
        ).toLocaleString()}`
    )
    .join('\n');

  let customerBlock = '';
  if (form && form.fullName) {
    const paymentLabel =
      form.paymentMethod === 'bank_transfer'
        ? `Bank Transfer / JazzCash / EasyPaisa (Meezan A/C: ${SHOP_INFO.bankAccountNumber} | JazzCash/EasyPaisa: ${SHOP_INFO.jazzCashDisplay})`
        : form.paymentMethod === 'whatsapp'
        ? 'WhatsApp Assisted Order'
        : 'Cash on Delivery (COD)';
    customerBlock = `\n\n*Customer Delivery Details:*
Name: ${form.fullName}
Phone: ${form.phone}
City: ${form.city}
Address: ${form.address}
Payment: ${paymentLabel}`;
  }

  const message = `Assalam-o-Alaikum Bari Textile Multan!
I would like to place this order:

${itemsList}

*Items Total:* Rs. ${subtotal.toLocaleString()}
*Delivery Charges:* ${shipping === 0 ? 'FREE Delivery' : 'Rs. 250'}
*Grand Total:* Rs. ${total.toLocaleString()}${customerBlock}

Please confirm my order. Thank you!`;

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(message)}`;
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
  const message = `Assalam-o-Alaikum Bari Textile Multan!
*Wholesale / Bulk Order Inquiry:*

*Shop / Business Name:* ${inquiry.businessName}
*Customer Name:* ${inquiry.contactPerson}
*Phone Number:* ${inquiry.phone}
*City:* ${inquiry.city}
*Category:* ${inquiry.category}
*Quantity Needed:* ${inquiry.quantity} pieces
*Details:* ${inquiry.requirements || 'Please share wholesale rates and photos'}

Please send me your wholesale price list.`;

  return `https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(message)}`;
}
