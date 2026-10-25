/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS, SHOP_INFO, buildWhatsAppCartUrl, buildWhatsAppProductUrl, buildWhatsAppWholesaleUrl } from './src/data/products';
import { OWNER_EMAIL, isOwnerUser, handleFirestoreError, OperationType, FirestoreErrorInfo } from './src/firebase';
import { User } from 'firebase/auth';

/**
 * Emulates the exact boolean evaluation logic implemented in firestore.rules
 * to verify all 12 "Dirty Dozen" security violation payloads and legitimate accesses.
 */
interface SecurityContext {
  auth: {
    uid: string;
    token: {
      email?: string;
      email_verified?: boolean;
    };
  } | null;
  time: string;
}

interface FirestoreState {
  admins: Record<string, { email: string; createdAt: string }>;
  products: Record<string, Record<string, unknown>>;
}

function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
}

function isValidProduct(data: Record<string, unknown>, authUid: string): boolean {
  const requiredKeys = [
    'id', 'code', 'name', 'nameUrdu', 'category', 'price',
    'material', 'style', 'color', 'colorHex', 'inStock',
    'featured', 'isNew', 'dimensions', 'description',
    'descriptionUrdu', 'care', 'origin', 'patternType',
    'wholesaleAvailable', 'wholesaleMinQty', 'ownerId',
    'createdAt', 'updatedAt'
  ];

  const allowedKeys = new Set([...requiredKeys, 'originalPrice', 'image']);
  const actualKeys = Object.keys(data);

  for (const k of requiredKeys) {
    if (!(k in data)) return false;
  }
  for (const k of actualKeys) {
    if (!allowedKeys.has(k)) return false;
  }

  if (!isValidId(data.id as string)) return false;
  if (typeof data.code !== 'string' || data.code.length < 1 || data.code.length > 50) return false;
  if (typeof data.name !== 'string' || data.name.length < 1 || data.name.length > 200) return false;
  if (typeof data.nameUrdu !== 'string' || data.nameUrdu.length > 200) return false;
  if (!['gents', 'ladies', 'bechgana', 'rumaal', 'laungi'].includes(data.category as string)) return false;
  if (typeof data.price !== 'number' || data.price < 0 || data.price > 10000000) return false;

  if ('originalPrice' in data && data.originalPrice !== undefined) {
    if (typeof data.originalPrice !== 'number' || data.originalPrice < 0 || data.originalPrice > 10000000) return false;
  }

  if (typeof data.material !== 'string' || data.material.length < 1 || data.material.length > 100) return false;
  if (typeof data.style !== 'string' || data.style.length < 1 || data.style.length > 150) return false;
  if (typeof data.color !== 'string' || data.color.length < 1 || data.color.length > 100) return false;
  if (typeof data.colorHex !== 'string' || data.colorHex.length < 4 || data.colorHex.length > 20) return false;
  if (typeof data.inStock !== 'boolean') return false;
  if (typeof data.featured !== 'boolean') return false;
  if (typeof data.isNew !== 'boolean') return false;
  if (typeof data.dimensions !== 'string' || data.dimensions.length < 1 || data.dimensions.length > 100) return false;
  if (typeof data.description !== 'string' || data.description.length < 1 || data.description.length > 1000) return false;
  if (typeof data.descriptionUrdu !== 'string' || data.descriptionUrdu.length > 1000) return false;
  if (typeof data.care !== 'string' || data.care.length < 1 || data.care.length > 300) return false;
  if (typeof data.origin !== 'string' || data.origin.length < 1 || data.origin.length > 150) return false;
  if (!['kashmiri', 'paisley', 'herringbone', 'geometric', 'royal-velvet', 'laungi-stripe'].includes(data.patternType as string)) return false;

  if ('image' in data && data.image !== undefined) {
    if (typeof data.image !== 'string' || (data.image as string).length > 850000) return false;
  }

  if (typeof data.wholesaleAvailable !== 'boolean') return false;
  if (typeof data.wholesaleMinQty !== 'number' || data.wholesaleMinQty < 1 || data.wholesaleMinQty > 10000) return false;
  if (typeof data.ownerId !== 'string' || data.ownerId.length < 1 || data.ownerId.length > 128 || data.ownerId !== authUid) return false;

  if (!data.createdAt || !data.updatedAt) return false;

  return true;
}

function evaluateRulesOperation(
  action: 'get' | 'list' | 'create' | 'update' | 'delete',
  collection: 'products' | 'admins',
  docId: string,
  incomingData: Record<string, unknown> | null,
  context: SecurityContext,
  state: FirestoreState
): 'PERMISSION_ALLOWED' | 'PERMISSION_DENIED' {
  const isSignedIn = context.auth !== null;
  const isVerifiedUser = isSignedIn && context.auth?.token.email_verified === true;
  const isBootstrapOwner = isVerifiedUser && context.auth?.token.email === OWNER_EMAIL;
  const isAdmin = isBootstrapOwner || (isVerifiedUser && Boolean(state.admins[context.auth?.uid || '']));

  if (collection === 'products') {
    if (action === 'get') {
      return isValidId(docId) ? 'PERMISSION_ALLOWED' : 'PERMISSION_DENIED';
    }

    if (action === 'list') {
      return 'PERMISSION_ALLOWED';
    }

    if (action === 'create') {
      if (!context.auth || !isValidId(docId) || !incomingData) return 'PERMISSION_DENIED';
      if (!isValidProduct(incomingData, context.auth.uid)) return 'PERMISSION_DENIED';
      if (incomingData.id !== docId) return 'PERMISSION_DENIED';
      if (incomingData.createdAt !== context.time || incomingData.updatedAt !== context.time) return 'PERMISSION_DENIED';
      if (!isAdmin) return 'PERMISSION_DENIED';
      return 'PERMISSION_ALLOWED';
    }

    if (action === 'update') {
      const existing = state.products[docId];
      if (!existing || !context.auth || !isValidId(docId) || !incomingData) return 'PERMISSION_DENIED';
      if (!isValidProduct(incomingData, context.auth.uid)) return 'PERMISSION_DENIED';
      if (incomingData.id !== existing.id) return 'PERMISSION_DENIED';
      if (incomingData.ownerId !== existing.ownerId) return 'PERMISSION_DENIED';
      if (incomingData.createdAt !== existing.createdAt) return 'PERMISSION_DENIED';
      if (incomingData.updatedAt !== context.time) return 'PERMISSION_DENIED';
      if (!isAdmin) return 'PERMISSION_DENIED';
      return 'PERMISSION_ALLOWED';
    }

    if (action === 'delete') {
      if (!isSignedIn || !isValidId(docId) || !isAdmin) return 'PERMISSION_DENIED';
      return 'PERMISSION_ALLOWED';
    }
  }

  if (collection === 'admins') {
    if (action === 'create') {
      if (!isSignedIn || !isValidId(docId) || !isBootstrapOwner) return 'PERMISSION_DENIED';
      if (incomingData?.createdAt !== context.time) return 'PERMISSION_DENIED';
      return 'PERMISSION_ALLOWED';
    }
    return 'PERMISSION_DENIED';
  }

  return 'PERMISSION_DENIED';
}

describe('Firestore Security Rules: The "Dirty Dozen" Hardened TDD Suite', () => {
  const SERVER_NOW = '2026-10-24T12:00:00.000Z';
  const OWNER_UID = 'owner-uid-12345';
  const ATTACKER_UID = 'attacker-uid-67890';

  const baseValidProductPayload = {
    id: 'bsh-valid-01',
    code: 'BTM-101',
    name: 'Fine Pure Wool Shawl',
    nameUrdu: 'خالص اون شال',
    category: 'gents',
    price: 4500,
    material: 'Pure Wool',
    style: 'Traditional Weave',
    color: 'Camel Brown',
    colorHex: '#B88B58',
    inStock: true,
    featured: true,
    isNew: false,
    dimensions: '2.5 × 1.35 meters',
    description: 'Authentic shawl with bumble tassels and woven borders.',
    descriptionUrdu: 'بمبل اور بارڈر والی مستند شال',
    care: 'Dry clean only',
    origin: 'Multan',
    patternType: 'herringbone',
    wholesaleAvailable: true,
    wholesaleMinQty: 12,
    ownerId: OWNER_UID,
    createdAt: SERVER_NOW,
    updatedAt: SERVER_NOW,
  };

  const initialDbState: FirestoreState = {
    admins: {},
    products: {
      'bsh-valid-01': { ...baseValidProductPayload },
    },
  };

  it('1. Unauthenticated Product Creation -> PERMISSION_DENIED', () => {
    const context: SecurityContext = { auth: null, time: SERVER_NOW };
    const res = evaluateRulesOperation('create', 'products', 'bsh-999', baseValidProductPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('2. Non-Owner Authenticated Write -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: ATTACKER_UID, token: { email: 'attacker@gmail.com', email_verified: true } },
      time: SERVER_NOW,
    };
    const res = evaluateRulesOperation('update', 'products', 'bsh-valid-01', {
      ...baseValidProductPayload,
      price: 1,
      ownerId: ATTACKER_UID,
    }, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('3. Unverified Admin Email Spoof -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: ATTACKER_UID, token: { email: OWNER_EMAIL, email_verified: false } },
      time: SERVER_NOW,
    };
    const res = evaluateRulesOperation('delete', 'products', 'bsh-valid-01', null, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('4. Shadow Field Injection -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const shadowPayload = {
      ...baseValidProductPayload,
      id: 'bsh-shadow-01',
      isSuperFeatured: true,
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-shadow-01', shadowPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('5. Owner ID Spoofing on Create -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const spoofPayload = {
      ...baseValidProductPayload,
      id: 'bsh-spoof-01',
      ownerId: 'someone-else-uid',
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-spoof-01', spoofPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('6. Immutable Field Mutation on Update -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const mutatePayload = {
      ...baseValidProductPayload,
      createdAt: '2020-01-01T00:00:00.000Z',
    };
    const res = evaluateRulesOperation('update', 'products', 'bsh-valid-01', mutatePayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('7. Client Timestamp Forgery -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const forgedPayload = {
      ...baseValidProductPayload,
      id: 'bsh-forged-01',
      updatedAt: '1999-12-31T23:59:59.000Z',
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-forged-01', forgedPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('8. ID Poisoning Attack -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const maliciousId = 'invalid#id!@$%^&*()_+/\\><';
    const res = evaluateRulesOperation('create', 'products', maliciousId, {
      ...baseValidProductPayload,
      id: maliciousId,
    }, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('9. Value Poisoning (Negative Price) -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const negativePricePayload = {
      ...baseValidProductPayload,
      id: 'bsh-neg-01',
      price: -500,
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-neg-01', negativePricePayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('10. Category Enum Bypass -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const invalidCatPayload = {
      ...baseValidProductPayload,
      id: 'bsh-cat-01',
      category: 'electronics',
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-cat-01', invalidCatPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('11. Oversized String Denial-of-Wallet -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const oversizedName = 'A'.repeat(5000);
    const oversizedPayload = {
      ...baseValidProductPayload,
      id: 'bsh-oversize-01',
      name: oversizedName,
    };
    const res = evaluateRulesOperation('create', 'products', 'bsh-oversize-01', oversizedPayload, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('12. Self-Assigned Admin Escalation -> PERMISSION_DENIED', () => {
    const context: SecurityContext = {
      auth: { uid: ATTACKER_UID, token: { email: 'attacker@evil.com', email_verified: true } },
      time: SERVER_NOW,
    };
    const res = evaluateRulesOperation('create', 'admins', ATTACKER_UID, {
      email: 'attacker@evil.com',
      createdAt: SERVER_NOW,
    }, context, initialDbState);
    expect(res).toBe('PERMISSION_DENIED');
  });

  it('Legitimate verified shop owner write -> PERMISSION_ALLOWED', () => {
    const context: SecurityContext = {
      auth: { uid: OWNER_UID, token: { email: OWNER_EMAIL, email_verified: true } },
      time: SERVER_NOW,
    };
    const createRes = evaluateRulesOperation('create', 'products', 'bsh-new-01', {
      ...baseValidProductPayload,
      id: 'bsh-new-01',
    }, context, initialDbState);
    expect(createRes).toBe('PERMISSION_ALLOWED');
  });
});

describe('Catalog Integrity & User Acceptance Specifications', () => {
  it('Verifies all products have valid IDs and non-negative prices', () => {
    expect(INITIAL_PRODUCTS.length).toBe(10);
    for (const prod of INITIAL_PRODUCTS) {
      expect(isValidId(prod.id)).toBe(true);
      expect(prod.price).toBeGreaterThan(0);
      expect(['gents', 'ladies', 'bechgana', 'rumaal', 'laungi']).toContain(prod.category);
    }
  });

  it('Verifies Men\'s Off-White Swati Wool Shawl is accurately named and configured', () => {
    const swati = INITIAL_PRODUCTS.find((p) => p.id === 'bsh-r-01');
    expect(swati).toBeDefined();
    expect(swati?.name).toBe("Men's Off-White Swati Wool Shawl");
    expect(swati?.material).toBe('Swati Wool');
    expect(swati?.description.toLowerCase()).toContain('bumble');
    expect(swati?.image).toContain('shawl_offwhite_mens_lohi.jpeg');
  });

  it('Verifies shop info contact numbers match Multan shop details', () => {
    expect(SHOP_INFO.name).toBe('Bari Textile Multan');
    expect(SHOP_INFO.phoneDisplay).toBe('0313-6752048');
    expect(SHOP_INFO.whatsappDisplay).toBe('0333-4947829');
    expect(SHOP_INFO.bankAccountNumber).toBe('050560100939410');
  });

  it('Verifies WhatsApp cart and wholesale URL builders encode safely', () => {
    const url = buildWhatsAppProductUrl(INITIAL_PRODUCTS[0], 2);
    expect(url).toContain('https://wa.me/923334947829');
    expect(url).toContain('BTM-L101');

    const wholesaleUrl = buildWhatsAppWholesaleUrl({
      businessName: 'Khan Boutique',
      contactPerson: 'Ali',
      phone: '03001234567',
      city: 'Multan',
      category: 'gents',
      quantity: '24',
      requirements: 'Need 24 pieces of pure wool shawls',
    });
    expect(wholesaleUrl).toContain('Khan%20Boutique');
  });

  it('Verifies owner authorization check strictly validates email and verification state', () => {
    expect(isOwnerUser(null)).toBe(false);

    const verifiedOwner = {
      email: OWNER_EMAIL,
      emailVerified: true,
      uid: 'valid-owner-123',
    } as unknown as User;
    expect(isOwnerUser(verifiedOwner)).toBe(true);

    const unverifiedOwner = {
      email: OWNER_EMAIL,
      emailVerified: false,
      uid: 'fake-owner-123',
    } as unknown as User;
    expect(isOwnerUser(unverifiedOwner)).toBe(false);

    const wrongUser = {
      email: 'customer@gmail.com',
      emailVerified: true,
      uid: 'customer-123',
    } as unknown as User;
    expect(isOwnerUser(wrongUser)).toBe(false);
  });

  it('Verifies handleFirestoreError throws formatted JSON conforming to FirestoreErrorInfo', () => {
    expect(() => {
      handleFirestoreError(new Error('Missing or insufficient permissions'), OperationType.LIST, 'products');
    }).toThrowError();

    try {
      handleFirestoreError(new Error('Missing or insufficient permissions'), OperationType.GET, 'products/item-1');
    } catch (err: unknown) {
      const errorMsg = (err as Error).message;
      const parsed: FirestoreErrorInfo = JSON.parse(errorMsg);
      expect(parsed.operationType).toBe(OperationType.GET);
      expect(parsed.path).toBe('products/item-1');
      expect(parsed.error).toContain('Missing or insufficient permissions');
    }
  });
});
