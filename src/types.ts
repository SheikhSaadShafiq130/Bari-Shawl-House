/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory =
  | 'all'
  | 'gents'
  | 'ladies'
  | 'bechgana'
  | 'rumaal'
  | 'laungi';

export type FabricMaterial =
  | 'Pure Wool'
  | 'Royal Velvet'
  | 'Pashmina Blend'
  | 'Soft Acrylic'
  | 'Fine Cotton'
  | 'Silk Blend'
  | 'Swati Wool';

export interface ProductColorOption {
  name: string;
  nameUrdu?: string;
  hex: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedColor?: string;
}

export type StudioAngleMode = 'full' | 'wearing' | 'arm-drape' | 'macro-zoom';

export interface Product {
  id: string;
  code: string;
  name: string;
  nameUrdu: string;
  category: Exclude<ProductCategory, 'all'>;
  price: number;
  originalPrice?: number;
  material: FabricMaterial;
  style: string;
  color: string;
  colorHex: string;
  availableColors?: ProductColorOption[];
  galleryImages?: string[];
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
  dimensions: string;
  weightGrams?: number;
  warmthLevel?: 'Heavy Winter' | 'Mid-Winter' | 'All-Season';
  rating?: number;
  reviewCount?: number;
  description: string;
  descriptionUrdu: string;
  care: string;
  origin: string;
  patternType:
    | 'kashmiri'
    | 'paisley'
    | 'herringbone'
    | 'geometric'
    | 'royal-velvet'
    | 'laungi-stripe';
  image?: string;
  wholesaleAvailable?: boolean;
  wholesaleMinQty?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColorOption;
}

export interface OrderForm {
  fullName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'whatsapp';
  notes: string;
}

export interface WholesaleInquiry {
  businessName: string;
  contactPerson: string;
  phone: string;
  city: string;
  category: string;
  quantity: string;
  requirements: string;
}
