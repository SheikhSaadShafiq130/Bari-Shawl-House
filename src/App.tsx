/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Product, ProductCategory, CartItem } from './types';
import { INITIAL_PRODUCTS, SHOP_INFO } from './data/products';
import {
  auth,
  db,
  isOwnerUser,
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedCatalogToFirestore,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { WholesaleModal } from './components/WholesaleModal';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { FaqView } from './views/FaqView';
import { OwnerHandoverView } from './views/OwnerHandoverView';
import { Phone, MessageCircle, ShoppingBag } from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'bari_textile_multan_products_v7';
const STORAGE_KEY_CART = 'bari_shawl_house_cart_v2';
const STORAGE_KEY_LANG = 'bari_shawl_house_lang_v2';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const hasSeededRef = useRef(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [activeView, setActiveView] = useState<string>('home');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
  const [wholesaleTargetProduct, setWholesaleTargetProduct] = useState<Product | null>(null);

  const [lang, setLang] = useState<'en' | 'ur'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'ur' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  // Track Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore listener for public storefront catalog
  useEffect(() => {
    if (!authReady) return;

    const productsQuery = query(collection(db, 'products'), where('price', '>=', 0));
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        setIsCloudSynced(true);
        if (!snapshot.empty) {
          const cloudDocsMap = new Map<string, Record<string, unknown>>();
          snapshot.docs.forEach((docSnap) => {
            const d = docSnap.data();
            const docId = String(d.id || docSnap.id);
            cloudDocsMap.set(docId, d);
          });

          // Check if cloud catalog is still from an older seed (before the 10 unique v3 bumble images)
          const hasAllV3 = INITIAL_PRODUCTS.every((initProd) => {
            const d = cloudDocsMap.get(initProd.id);
            return d && typeof d.image === 'string' && d.image.includes('?v=3');
          });

          if (!hasAllV3) {
            setProducts(INITIAL_PRODUCTS);
            if (currentUser && isOwnerUser(currentUser) && !hasSeededRef.current) {
              hasSeededRef.current = true;
              seedCatalogToFirestore(INITIAL_PRODUCTS, currentUser).catch((err) => {
                console.error('Catalog v3 image upgrade sync error:', err);
              });
            }
            return;
          }

          const cloudProducts: Product[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            const docId = String(d.id || docSnap.id);
            const fallbackDefault = INITIAL_PRODUCTS.find((p) => p.id === docId);
            const hasCloudImage = typeof d.image === 'string' && d.image.trim().length > 0;

            return {
              id: docId,
              code: String(d.code || fallbackDefault?.code || 'BTM-100'),
              name: String(d.name || fallbackDefault?.name || 'Bari Shawl'),
              nameUrdu: String(d.nameUrdu || fallbackDefault?.nameUrdu || ''),
              category: (d.category as Product['category']) || fallbackDefault?.category || 'ladies',
              price: Number(d.price) || fallbackDefault?.price || 0,
              originalPrice:
                typeof d.originalPrice === 'number'
                  ? d.originalPrice
                  : fallbackDefault?.originalPrice,
              material: (d.material as Product['material']) || fallbackDefault?.material || 'Pure Wool',
              style: String(d.style || fallbackDefault?.style || ''),
              color: String(d.color || fallbackDefault?.color || ''),
              colorHex: String(d.colorHex || fallbackDefault?.colorHex || '#1E293B'),
              inStock: Boolean(d.inStock),
              featured: Boolean(d.featured),
              isNew: Boolean(d.isNew),
              dimensions: String(d.dimensions || fallbackDefault?.dimensions || ''),
              description: String(d.description || fallbackDefault?.description || ''),
              descriptionUrdu: String(d.descriptionUrdu || fallbackDefault?.descriptionUrdu || ''),
              care: String(d.care || fallbackDefault?.care || ''),
              origin: String(d.origin || fallbackDefault?.origin || 'Multan Weavers'),
              patternType:
                (d.patternType as Product['patternType']) ||
                fallbackDefault?.patternType ||
                'herringbone',
              image: hasCloudImage ? String(d.image) : fallbackDefault?.image,
              wholesaleAvailable: Boolean(d.wholesaleAvailable ?? true),
              wholesaleMinQty: Number(d.wholesaleMinQty) || 12,
            };
          });

          setProducts(cloudProducts);
        } else if (currentUser && isOwnerUser(currentUser) && !hasSeededRef.current) {
          // Automatically seed initial catalog into Firestore when the verified owner logs in
          hasSeededRef.current = true;
          seedCatalogToFirestore(INITIAL_PRODUCTS, currentUser).catch((err) => {
            console.error('Initial catalog seed error:', err);
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
    );

    return () => unsubscribe();
  }, [authReady, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // fallback
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // fallback
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // fallback
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView, activeCategory]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSaveProduct = async (updated: Product) => {
    if (!currentUser || !isOwnerUser(currentUser)) return;
    setIsSavingCloud(true);
    try {
      await saveProductToFirestore(updated, currentUser);
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === updated.id);
        if (exists) {
          return prev.map((p) => (p.id === updated.id ? updated : p));
        }
        return [updated, ...prev];
      });
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!currentUser || !isOwnerUser(currentUser)) return;
    setIsSavingCloud(true);
    try {
      await deleteProductFromFirestore(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleResetCatalog = async () => {
    if (!currentUser || !isOwnerUser(currentUser)) return;
    setIsSavingCloud(true);
    try {
      await seedCatalogToFirestore(INITIAL_PRODUCTS, currentUser);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleImportCatalog = async (imported: Product[]) => {
    if (!currentUser || !isOwnerUser(currentUser)) return;
    setIsSavingCloud(true);
    try {
      await seedCatalogToFirestore(imported, currentUser);
      setProducts(imported);
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleOpenWholesaleForProduct = (product: Product) => {
    setWholesaleTargetProduct(product);
    setIsWholesaleOpen(true);
  };

  const handleOpenGeneralWholesale = () => {
    setWholesaleTargetProduct(null);
    setIsWholesaleOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] font-sans-clean">
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        activeView={activeView}
        onSelectView={setActiveView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWholesale={handleOpenGeneralWholesale}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            products={products}
            onSelectCategory={setActiveCategory}
            onSelectView={setActiveView}
            onQuickView={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onOpenWholesale={handleOpenGeneralWholesale}
            lang={lang}
          />
        )}

        {activeView === 'shop' && (
          <ShopView
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onQuickView={setSelectedProduct}
            onAddToCart={handleAddToCart}
            lang={lang}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            onSelectView={setActiveView}
            onOpenWholesale={handleOpenGeneralWholesale}
            lang={lang}
          />
        )}

        {activeView === 'contact' && <ContactView lang={lang} />}

        {activeView === 'faq' && <FaqView lang={lang} />}

        {activeView === 'handover' && (
          <OwnerHandoverView
            onOpenAdmin={() => setIsAdminOpen(true)}
            lang={lang}
          />
        )}
      </main>

      <Footer
        onSelectCategory={setActiveCategory}
        onSelectView={setActiveView}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWholesale={handleOpenGeneralWholesale}
        lang={lang}
      />

      {/* Mobile Bottom Action Bar */}
      <aside
        aria-label="Quick Contact and Bag"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-2 shadow-lg"
      >
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <a
            href={`tel:${SHOP_INFO.phoneTel}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Shop</span>
          </a>

          <a
            href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
              'Assalam-o-Alaikum Bari Textile Multan! I want to ask about your shawls.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl transition-colors relative"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Bag ({totalCartCount})</span>
          </button>
        </div>
      </aside>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenWholesaleForProduct={handleOpenWholesaleForProduct}
          lang={lang}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        lang={lang}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        currentUser={currentUser}
        isCloudSynced={isCloudSynced}
        isSavingCloud={isSavingCloud}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetCatalog={handleResetCatalog}
        onImportCatalog={handleImportCatalog}
      />

      <WholesaleModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
        preselectedProduct={wholesaleTargetProduct}
        lang={lang}
      />
    </div>
  );
}
