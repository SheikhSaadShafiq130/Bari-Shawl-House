/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {
  Product,
  ProductCategory,
  CartItem,
  ProductColorOption,
} from './types';
import { INITIAL_PRODUCTS, SHOP_INFO, getProductColors } from './data/products';
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
import {
  Phone,
  MessageCircle,
  ShoppingBag,
  Home,
  LayoutGrid,
  Check,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'bari_shawl_house_products_v8';
const STORAGE_KEY_CART = 'bari_shawl_house_cart_v3';
const STORAGE_KEY_WISHLIST = 'bari_shawl_house_wishlist_v1';
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

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [onlyWishlistFilter, setOnlyWishlistFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [activeView, setActiveView] = useState<string>('home');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedModalColor, setSelectedModalColor] = useState<
    ProductColorOption | undefined
  >(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
  const [wholesaleTargetProduct, setWholesaleTargetProduct] = useState<Product | null>(null);
  const [cartToastItem, setCartToastItem] = useState<string | null>(null);

  const [lang, setLang] = useState<'en' | 'ur'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'ur' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'en';
  });

  // Android Hardware / Gesture Back Button Support
  const overlayStateRef = useRef({
    selectedProduct,
    isCartOpen,
    isWholesaleOpen,
    isAdminOpen,
    activeView,
  });
  overlayStateRef.current = {
    selectedProduct,
    isCartOpen,
    isWholesaleOpen,
    isAdminOpen,
    activeView,
  };

  useEffect(() => {
    const hasOverlayOrSubView =
      Boolean(selectedProduct) ||
      isCartOpen ||
      isWholesaleOpen ||
      isAdminOpen ||
      activeView !== 'home';

    if (hasOverlayOrSubView) {
      window.history.pushState({ bariOverlay: true }, '');
    }
  }, [Boolean(selectedProduct), isCartOpen, isWholesaleOpen, isAdminOpen, activeView]);

  useEffect(() => {
    const handlePopState = () => {
      const st = overlayStateRef.current;
      if (st.selectedProduct) {
        setSelectedProduct(null);
      } else if (st.isCartOpen) {
        setIsCartOpen(false);
      } else if (st.isWholesaleOpen) {
        setIsWholesaleOpen(false);
      } else if (st.isAdminOpen) {
        setIsAdminOpen(false);
      } else if (st.activeView !== 'home') {
        setActiveView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
              code: String(d.code || fallbackDefault?.code || 'BSH-100'),
              name: String(d.name || fallbackDefault?.name || 'Bari Shawl'),
              nameUrdu: String(d.nameUrdu || fallbackDefault?.nameUrdu || ''),
              category:
                (d.category as Product['category']) || fallbackDefault?.category || 'ladies',
              price: Number(d.price) || fallbackDefault?.price || 0,
              originalPrice:
                typeof d.originalPrice === 'number'
                  ? d.originalPrice
                  : fallbackDefault?.originalPrice,
              material:
                (d.material as Product['material']) || fallbackDefault?.material || 'Pure Wool',
              style: String(d.style || fallbackDefault?.style || ''),
              color: String(d.color || fallbackDefault?.color || ''),
              colorHex: String(d.colorHex || fallbackDefault?.colorHex || '#1E293B'),
              availableColors: fallbackDefault?.availableColors,
              galleryImages: fallbackDefault?.galleryImages,
              weightGrams: fallbackDefault?.weightGrams,
              warmthLevel: fallbackDefault?.warmthLevel,
              rating: fallbackDefault?.rating || 4.9,
              reviewCount: fallbackDefault?.reviewCount || 32,
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

          setProducts((prev) =>
            cloudProducts.map((cp) => {
              const localMatch = prev.find((lp) => lp.id === cp.id);
              return {
                ...cp,
                availableColors:
                  localMatch?.availableColors && localMatch.availableColors.length > 0
                    ? localMatch.availableColors
                    : cp.availableColors,
                galleryImages:
                  localMatch?.galleryImages && localMatch.galleryImages.length > 0
                    ? localMatch.galleryImages
                    : cp.galleryImages,
              };
            })
          );
        } else if (currentUser && isOwnerUser(currentUser) && !hasSeededRef.current) {
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
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlistIds));
    } catch {
      // fallback
    }
  }, [wishlistIds]);

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

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickView = (product: Product, colorOption?: ProductColorOption) => {
    setSelectedModalColor(colorOption || getProductColors(product)[0]);
    setSelectedProduct(product);
  };

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    colorOption?: ProductColorOption
  ) => {
    const chosenColor = colorOption || getProductColors(product)[0];
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedColor?.name || item.product.color) === chosenColor.name
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id &&
          (item.selectedColor?.name || item.product.color) === chosenColor.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    const baseName = lang === 'ur' ? product.nameUrdu : product.name;
    setCartToastItem(`${baseName} (${chosenColor.name})`);
  };

  useEffect(() => {
    if (!cartToastItem) return;
    const timer = setTimeout(() => setCartToastItem(null), 3500);
    return () => clearTimeout(timer);
  }, [cartToastItem]);

  const handleUpdateCartQuantity = (
    productId: string,
    colorName: string | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, colorName);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        (!colorName || item.selectedColor?.name === colorName)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleUpdateCartColor = (
    productId: string,
    oldColorName: string | undefined,
    newColor: ProductColorOption
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor?.name === oldColorName
          ? { ...item, selectedColor: newColor }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, colorName?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!colorName || item.selectedColor?.name === colorName)
          )
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleSaveProduct = async (updated: Product) => {
    setIsSavingCloud(true);
    try {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === updated.id);
        if (exists) {
          return prev.map((p) => (p.id === updated.id ? updated : p));
        }
        return [updated, ...prev];
      });
      if (currentUser && isOwnerUser(currentUser)) {
        await saveProductToFirestore(updated, currentUser);
      }
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsSavingCloud(true);
    try {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      if (currentUser && isOwnerUser(currentUser)) {
        await deleteProductFromFirestore(productId);
      }
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleResetCatalog = async () => {
    setIsSavingCloud(true);
    try {
      setProducts(INITIAL_PRODUCTS);
      if (currentUser && isOwnerUser(currentUser)) {
        await seedCatalogToFirestore(INITIAL_PRODUCTS, currentUser);
      }
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleImportCatalog = async (imported: Product[]) => {
    setIsSavingCloud(true);
    try {
      setProducts(imported);
      if (currentUser && isOwnerUser(currentUser)) {
        await seedCatalogToFirestore(imported, currentUser);
      }
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
  const isUrdu = lang === 'ur';

  return (
    <div className="min-h-screen flex flex-col bg-[#EBE5DC] text-[#1C1917] font-sans-clean pb-18 lg:pb-0">
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setOnlyWishlistFilter(false);
          setActiveCategory(cat);
        }}
        activeView={activeView}
        onSelectView={setActiveView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => {
          setOnlyWishlistFilter(true);
          setActiveView('shop');
        }}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWholesale={handleOpenGeneralWholesale}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            products={products}
            onSelectCategory={(cat) => {
              setOnlyWishlistFilter(false);
              setActiveCategory(cat);
            }}
            onSelectView={setActiveView}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            onOpenWholesale={handleOpenGeneralWholesale}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            lang={lang}
          />
        )}

        {activeView === 'shop' && (
          <ShopView
            products={products}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onlyWishlistFilter={onlyWishlistFilter}
            onToggleWishlistFilter={setOnlyWishlistFilter}
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
        onSelectCategory={(cat) => {
          setOnlyWishlistFilter(false);
          setActiveCategory(cat);
        }}
        onSelectView={setActiveView}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenWholesale={handleOpenGeneralWholesale}
        lang={lang}
      />

      {/* Instant Thumb-Zone Toast when Item Added to Bag */}
      {cartToastItem && !isCartOpen && (
        <div className="fixed bottom-20 inset-x-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-40 bg-[#1E1B24] text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-amber-400 font-bold">
                {isUrdu ? 'شاپنگ بیگ میں شامل ہو گیا' : 'Added to Shopping Bag'}
              </p>
              <p className="text-xs font-semibold text-stone-100 truncate">{cartToastItem}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCartToastItem(null);
              setIsCartOpen(true);
            }}
            className="min-h-[38px] px-3 py-1.5 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1 shadow-2xs"
          >
            <span>{isUrdu ? 'بیگ دیکھیں' : 'View Bag'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ergonomic Android Mobile Bottom Navigation & Action Dock */}
      <aside
        aria-label="Mobile Navigation and Quick Actions"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FAF7F2]/98 backdrop-blur-md border-t border-[#CFC6B8] px-2 pt-1.5 pb-safe shadow-[0_-4px_20px_rgba(28,25,23,0.12)]"
      >
        <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto items-center">
          <button
            type="button"
            onClick={() => {
              setActiveView('home');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all active:scale-95 ${
              activeView === 'home'
                ? 'text-rose-700 font-bold bg-rose-100/80'
                : 'text-stone-700 font-medium hover:text-stone-950'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">{isUrdu ? 'ہوم' : 'Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOnlyWishlistFilter(false);
              setActiveCategory('all');
              setActiveView('shop');
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-all active:scale-95 ${
              activeView === 'shop'
                ? 'text-rose-700 font-bold bg-rose-100/80'
                : 'text-stone-700 font-medium hover:text-stone-950'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">{isUrdu ? 'شالیں' : 'Catalog'}</span>
          </button>

          <a
            href={`https://wa.me/${SHOP_INFO.whatsappIntl}?text=${encodeURIComponent(
              'Assalam-o-Alaikum Bari Shawl House! I want to ask about your shawls.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] flex flex-col items-center justify-center bg-emerald-700 active:bg-emerald-800 active:scale-95 text-white rounded-xl shadow-xs transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">WhatsApp</span>
          </a>

          <a
            href={`tel:${SHOP_INFO.phoneTel}`}
            className="min-h-[48px] flex flex-col items-center justify-center text-stone-800 hover:text-stone-950 active:scale-95 rounded-xl font-medium transition-all"
          >
            <Phone className="w-5 h-5 text-rose-700" />
            <span className="text-[10px] tracking-tight mt-0.5">{isUrdu ? 'کال کریں' : 'Call Shop'}</span>
          </a>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="min-h-[48px] relative flex flex-col items-center justify-center text-stone-800 hover:text-rose-700 active:scale-95 rounded-xl font-semibold transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-rose-700" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-700 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{isUrdu ? 'بیگ' : 'Bag'}</span>
          </button>
        </div>
      </aside>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          initialColor={selectedModalColor}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onOpenWholesaleForProduct={handleOpenWholesaleForProduct}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          lang={lang}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onUpdateColor={handleUpdateCartColor}
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
