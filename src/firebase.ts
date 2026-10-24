/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const OWNER_EMAIL = 'skyblue249249@gmail.com';

export function isOwnerUser(user: User | null): boolean {
  if (!user) return false;
  return (
    Boolean(user.emailVerified) &&
    user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  );
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInOwnerWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutOwner(): Promise<void> {
  await signOut(auth);
}

/**
 * Sanitizes a Product object so every field strictly adheres to firebase-blueprint.json
 * and firestore.rules volumetric and enum constraints.
 */
function buildValidatedProductPayload(product: Product) {
  const cleanId = product.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128) || 'bsh-item';
  const validCategories = ['gents', 'ladies', 'bechgana', 'rumaal', 'laungi'];
  const validPatterns = [
    'kashmiri',
    'paisley',
    'herringbone',
    'geometric',
    'royal-velvet',
    'laungi-stripe',
  ];

  const payload: Record<string, unknown> = {
    id: cleanId,
    code: (product.code || 'BSH-100').trim().slice(0, 50),
    name: (product.name || 'Bari Shawl').trim().slice(0, 200),
    nameUrdu: (product.nameUrdu || '').trim().slice(0, 200),
    category: validCategories.includes(product.category) ? product.category : 'gents',
    price: Math.max(0, Math.min(10000000, Number(product.price) || 0)),
    material: (product.material || 'Pure Wool').trim().slice(0, 100),
    style: (product.style || 'Traditional Weave').trim().slice(0, 150),
    color: (product.color || 'Classic').trim().slice(0, 100),
    colorHex: (product.colorHex || '#1E293B').trim().slice(0, 20),
    inStock: Boolean(product.inStock),
    featured: Boolean(product.featured),
    isNew: Boolean(product.isNew),
    dimensions: (product.dimensions || '2.5 × 1.35 meters').trim().slice(0, 100),
    description: (product.description || 'Quality shawl from Bari Textile Multan.')
      .trim()
      .slice(0, 1000),
    descriptionUrdu: (product.descriptionUrdu || '').trim().slice(0, 1000),
    care: (product.care || 'Dry clean or gentle wash.').trim().slice(0, 300),
    origin: (product.origin || 'Multan Weavers').trim().slice(0, 150),
    patternType: validPatterns.includes(product.patternType)
      ? product.patternType
      : 'herringbone',
    wholesaleAvailable: Boolean(product.wholesaleAvailable ?? true),
    wholesaleMinQty: Math.max(
      1,
      Math.min(10000, Number(product.wholesaleMinQty) || 12)
    ),
  };

  if (
    typeof product.originalPrice === 'number' &&
    product.originalPrice >= 0 &&
    product.originalPrice <= 10000000
  ) {
    payload.originalPrice = product.originalPrice;
  }

  if (typeof product.image === 'string' && product.image.trim().length > 0) {
    payload.image = product.image.trim().slice(0, 850000);
  }

  return { cleanId, payload };
}

export async function saveProductToFirestore(
  product: Product,
  user: User
): Promise<void> {
  const { cleanId, payload } = buildValidatedProductPayload(product);
  const path = `products/${cleanId}`;
  const docRef = doc(db, 'products', cleanId);

  let existingOwnerId: string | null = null;
  let existingCreatedAt: unknown = null;
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      existingOwnerId = typeof data.ownerId === 'string' ? data.ownerId : user.uid;
      existingCreatedAt = data.createdAt || serverTimestamp();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (existingOwnerId && existingCreatedAt) {
    try {
      await setDoc(docRef, {
        ...payload,
        ownerId: existingOwnerId,
        createdAt: existingCreatedAt,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  } else {
    try {
      await setDoc(docRef, {
        ...payload,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
}

export async function deleteProductFromFirestore(
  productId: string
): Promise<void> {
  const cleanId = productId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const path = `products/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'products', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedCatalogToFirestore(
  products: Product[],
  user: User
): Promise<void> {
  for (const prod of products) {
    await saveProductToFirestore(prod, user);
  }
}
