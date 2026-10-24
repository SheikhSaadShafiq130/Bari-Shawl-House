/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory = 'all' | 'gents' | 'ladies' | 'bechgana' | 'rumaal' | 'laungi';

export type FabricMaterial = 
  | 'Pure Wool' 
  | 'Pashmina Blend' 
  | 'Royal Velvet' 
  | 'Soft Acrylic' 
  | 'Fine Cotton' 
  | 'Silk Blend' 
  | 'Swati Wool';

export interface Product {
  id: string;
  code: string;
  name: string;
  nameUrdu: string;
  category: 'gents' | 'ladies' | 'bechgana' | 'rumaal' | 'laungi';
  price: number;
  originalPrice?: number;
  material: FabricMaterial;
  style: string;
  color: string;
  colorHex: string;
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
  dimensions: string;
  description: string;
  descriptionUrdu: string;
  care: string;
  origin: string;
  patternType: 'kashmiri' | 'paisley' | 'herringbone' | 'geometric' | 'royal-velvet' | 'laungi-stripe';
  image?: string;
  wholesaleAvailable: boolean;
  wholesaleMinQty?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  category: ProductCategory;
  quantity: string;
  requirements: string;
}
