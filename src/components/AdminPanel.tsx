/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  RotateCcw,
  Download,
  FileJson,
  AlertCircle,
  Lock,
  LogOut,
  ShieldCheck,
  Cloud,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Product, FabricMaterial } from '../types';
import { TextileImage } from './TextileImage';
import { SHOP_INFO } from '../data/products';
import {
  OWNER_EMAIL,
  isOwnerUser,
  signInOwnerWithGoogle,
  signOutOwner,
} from '../firebase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentUser: User | null;
  isCloudSynced: boolean;
  isSavingCloud: boolean;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onResetCatalog: () => Promise<void>;
  onImportCatalog: (imported: Product[]) => Promise<void>;
}

/**
 * Compresses an uploaded image file using HTML5 canvas so mobile camera photos
 * (even 5-10MB) fit comfortably inside Firestore documents and load fast.
 */
function compressImageToDataUrl(file: File, maxDim = 700, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  currentUser,
  isCloudSynced,
  isSavingCloud,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog,
  onImportCatalog,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'info'>('products');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const isAuthorizedOwner = isOwnerUser(currentUser);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const user = await signInOwnerWithGoogle();
      if (isOwnerUser(user)) {
        showNotice('Welcome! Owner Admin unlocked and connected to live cloud database.');
      } else {
        showNotice(
          `Signed in as ${user.email}, which is not the authorized owner account (${OWNER_EMAIL}).`,
          'error'
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was cancelled.';
      showNotice(msg, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutOwner();
    setEditingProduct(null);
    showNotice('Signed out of Owner Admin.');
  };

  const handleCreateNew = () => {
    const newProd: Product = {
      id: `bsh-item-${Date.now()}`,
      code: `BSH-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      nameUrdu: '',
      category: 'gents',
      price: 3500,
      originalPrice: 4000,
      material: 'Pure Wool',
      style: 'Traditional Woven Border',
      color: 'Camel Brown',
      colorHex: '#B88B58',
      inStock: true,
      featured: false,
      isNew: true,
      dimensions: '2.5 × 1.35 meters',
      description: 'Warm and comfortable shawl from Bari Textile Multan.',
      descriptionUrdu: 'باری ٹیکسٹائل ملتان کی اعلیٰ معیار کی گرم شال۔',
      care: 'Dry clean or gentle cold wash.',
      origin: 'Multan Weavers',
      patternType: 'herringbone',
      wholesaleAvailable: true,
      wholesaleMinQty: 12,
    };
    setEditingProduct(newProd);
    setIsCreating(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showNotice('Please enter a product name before saving.', 'error');
      return;
    }
    try {
      await onSaveProduct(editingProduct);
      showNotice(
        isCreating
          ? 'New product saved to live database for all customers!'
          : 'Product changes saved live for all customers!'
      );
      setEditingProduct(null);
      setIsCreating(false);
    } catch {
      showNotice('Could not save product to cloud database. Please try again.', 'error');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    if (file.size > 12 * 1024 * 1024) {
      showNotice('Photo is larger than 12MB. Please choose a smaller photo.', 'error');
      return;
    }

    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      setEditingProduct({
        ...editingProduct,
        image: compressedDataUrl,
      });
      showNotice('Photo ready! Click "Save Changes" below to publish it live.');
    } catch {
      showNotice('Could not process photo. Please try another image.', 'error');
    }
  };

  const exportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `bari-shawl-products-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotice('Product list backup downloaded.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          await onImportCatalog(parsed);
          showNotice(`Loaded ${parsed.length} products into your live shop!`);
        } else {
          showNotice('Invalid backup file.', 'error');
        }
      } catch {
        showNotice('Could not read backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-title"
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden bg-black/65 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl border-l border-stone-200"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="min-w-0">
            <h2 id="admin-title" className="font-serif-luxury text-lg sm:text-xl font-bold truncate">
              Bari Textile Multan · Shop Owner Admin
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 truncate">
              {isAuthorizedOwner
                ? `Connected Live · Signed in as ${currentUser?.email}`
                : 'Protected Owner Area · Google Sign-In Required'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inline Status Banner */}
        {statusMsg && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-emerald-700 text-white'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* If NOT signed in as the verified Shop Owner -> Show Lock Screen */}
        {!isAuthorizedOwner ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-900 mb-4 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
              Shop Owner Protection Active
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 max-w-md">
              Only the Shop Owner Can Manage Products
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-2 leading-relaxed">
              This panel is locked to the verified shop owner Google account (
              <strong className="font-mono text-slate-900">{OWNER_EMAIL}</strong>). Regular
              customers cannot add, edit, or delete products.
            </p>

            {currentUser && !isAuthorizedOwner && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl max-w-md w-full text-xs text-red-900 space-y-2">
                <p className="font-bold">
                  Access Denied for: <span className="font-mono">{currentUser.email}</span>
                </p>
                <p>
                  Please sign out and sign in with the shop owner account (
                  <strong className="font-mono">{OWNER_EMAIL}</strong>).
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 rounded-lg font-semibold text-red-800 hover:bg-red-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out & Switch Account</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="mt-6 min-h-[48px] px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2.5"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>
                {authLoading ? 'Opening Google Sign-In...' : 'Sign In with Google (Shop Owner)'}
              </span>
            </button>

            <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded-xl max-w-md w-full text-left text-xs text-stone-600 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                Why is this locked?
              </span>
              <p className="leading-relaxed">
                Your website is connected to a live Google Cloud (Firebase) database. When you sign in as the owner and upload a photo or change a price, it updates live on every customer&apos;s phone across Pakistan.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Bar for Authenticated Owner */}
            <div className="bg-stone-100 border-b border-stone-200 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Products ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('info');
                    setEditingProduct(null);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'info'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-stone-600 hover:text-slate-900'
                  }`}
                >
                  Shop Info & Help
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'products' && !editingProduct && (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="min-h-[36px] inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 text-xs font-medium rounded-lg transition-colors"
                  title="Sign out of Owner Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Live Cloud Status Strip */}
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between gap-2 text-[11px] text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Cloud className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  {isCloudSynced
                    ? 'Live Cloud Database Connected — Changes show on all phones immediately'
                    : 'Connecting to live cloud database...'}
                </span>
              </span>
              {isSavingCloud && (
                <span className="font-mono font-bold text-emerald-800">Saving live...</span>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {editingProduct ? (
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {isCreating ? 'Add New Product' : `Edit: ${editingProduct.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-stone-600 hover:text-slate-900 font-semibold underline shrink-0"
                    >
                      Back to List
                    </button>
                  </div>

                  {/* Photo Upload Box */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                    <label className="block font-bold text-slate-900">
                      Product Photo (Upload from Mobile or Computer)
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-stone-300 shrink-0 bg-white">
                        <TextileImage product={editingProduct} aspect="1/1" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer">
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          {editingProduct.image && (
                            <button
                              type="button"
                              onClick={() => setEditingProduct({ ...editingProduct, image: undefined })}
                              className="min-h-[40px] px-2.5 py-2 text-xs text-red-700 hover:bg-red-50 rounded-lg font-medium"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Or paste an image web link (URL) below:
                        </p>
                        <input
                          type="url"
                          placeholder="https://example.com/photo.jpg"
                          value={editingProduct.image || ''}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, image: e.target.value })
                          }
                          className="min-h-[38px] w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Choose Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as Product['category'],
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-semibold"
                      >
                        <option value="gents">1. Gents’ Shawls</option>
                        <option value="ladies">2. Ladies’ Shawls</option>
                        <option value="bechgana">3. Children’s Shawls (Bechgana)</option>
                        <option value="rumaal">4. Rumaal</option>
                        <option value="laungi">5. Laungi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Item Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        value={editingProduct.code}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, code: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Product Name (English) *</label>
                      <input
                        type="text"
                        required
                        maxLength={200}
                        placeholder="e.g. Men's Pure Wool Shawl"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Product Name (Urdu)</label>
                      <input
                        type="text"
                        maxLength={200}
                        placeholder="مثال: خالص اونی مردانہ شال"
                        value={editingProduct.nameUrdu}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-right"
                      />
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Sale Price (Rs.) *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={10000000}
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Old Price (Optional)</label>
                      <input
                        type="number"
                        min={0}
                        max={10000000}
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Material & Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Fabric / Material</label>
                      <select
                        value={editingProduct.material}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            material: e.target.value as FabricMaterial,
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                      >
                        <option value="Pure Wool">Pure Wool</option>
                        <option value="Royal Velvet">Royal Velvet</option>
                        <option value="Pashmina Blend">Pashmina Blend</option>
                        <option value="Soft Acrylic">Soft Acrylic</option>
                        <option value="Fine Cotton">Fine Cotton</option>
                        <option value="Silk Blend">Silk Blend</option>
                        <option value="Swati Wool">Swati Wool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Design / Border Style</label>
                      <input
                        type="text"
                        maxLength={150}
                        value={editingProduct.style}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, style: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  {/* Color & Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Color Name & Shade</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editingProduct.colorHex}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, colorHex: e.target.value })
                          }
                          className="w-11 h-10 p-0.5 border border-stone-300 rounded-lg cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          maxLength={100}
                          value={editingProduct.color}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, color: e.target.value })
                          }
                          className="min-h-[42px] flex-1 px-3 py-2 border border-stone-300 rounded-xl bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Size / Length</label>
                      <input
                        type="text"
                        maxLength={100}
                        placeholder="e.g. 2.5 × 1.35 meters"
                        value={editingProduct.dimensions}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      maxLength={1000}
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-800"
                      />
                      <span className="font-semibold text-slate-800">In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-800"
                      />
                      <span className="font-semibold text-slate-800">Show on Home</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isNew)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-800"
                      />
                      <span className="font-semibold text-slate-800">New Arrival</span>
                    </label>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="min-h-[42px] px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingCloud}
                      className="min-h-[42px] px-5 py-2 bg-rose-900 hover:bg-rose-800 disabled:opacity-60 text-white font-semibold rounded-xl"
                    >
                      {isSavingCloud
                        ? 'Saving Live...'
                        : isCreating
                        ? 'Add Product Live'
                        : 'Save Changes Live'}
                    </button>
                  </div>
                </form>
              ) : activeTab === 'products' ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-stone-600 font-medium">
                      Total {products.length} products in your live catalog
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1 text-stone-600 hover:text-slate-900 cursor-pointer font-medium">
                        <FileJson className="w-3.5 h-3.5" />
                        <span>Load Backup</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJson}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={exportJson}
                        className="inline-flex items-center gap-1 text-stone-600 hover:text-slate-900 font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Backup</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                            <TextileImage product={prod} aspect="1/1" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                              <span className="font-mono font-bold text-slate-800">{prod.code}</span>
                              <span>·</span>
                              <span className="uppercase">{prod.category}</span>
                              {prod.featured && (
                                <>
                                  <span>·</span>
                                  <span className="text-rose-800 font-semibold">On Home</span>
                                </>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-0.5">
                              {prod.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 mt-0.5">
                              <span className="font-mono tabular-nums font-bold text-slate-900">
                                Rs. {prod.price.toLocaleString()}
                              </span>
                              <span>·</span>
                              <span>{prod.material}</span>
                              <span>·</span>
                              <span className={prod.inStock ? 'text-emerald-700 font-medium' : 'text-red-600'}>
                                {prod.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                          <button
                            type="button"
                            onClick={() => handleEdit(prod)}
                            className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {confirmDeleteId === prod.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  await onDeleteProduct(prod.id);
                                  setConfirmDeleteId(null);
                                  showNotice('Product deleted from live catalog.');
                                }}
                                className="min-h-[36px] px-2.5 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="min-h-[36px] px-2.5 py-1.5 text-xs text-stone-600 bg-stone-100 rounded-lg"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(prod.id)}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Reset Option */}
                  <div className="pt-4 border-t border-stone-200 flex flex-wrap justify-between items-center gap-2 text-xs">
                    {confirmReset ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-red-700 font-semibold">Restore original sample products?</span>
                        <button
                          type="button"
                          onClick={async () => {
                            await onResetCatalog();
                            setConfirmReset(false);
                            showNotice('Original sample catalog restored live.');
                          }}
                          className="px-2.5 py-1.5 bg-red-600 text-white font-semibold rounded-lg"
                        >
                          Yes, Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-2.5 py-1.5 bg-stone-200 text-stone-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="inline-flex items-center gap-1 text-stone-500 hover:text-red-700 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default Sample Products</span>
                      </button>
                    )}
                    <span className="text-stone-400 text-[11px]">Synced with Google Cloud Firestore</span>
                  </div>
                </div>
              ) : (
                /* Shop Info & Simple Help Tab */
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-950 text-white p-4 sm:p-5 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold block text-sm text-amber-400">Your Shop Contact & Payment Details</span>
                    <div className="space-y-1.5 pt-1 text-slate-200">
                      <p><strong>Shop Name:</strong> {SHOP_INFO.name} ({SHOP_INFO.nameUrdu})</p>
                      <p><strong>Authorized Owner Email:</strong> <span className="font-mono text-emerald-400">{OWNER_EMAIL}</span></p>
                      <p><strong>Phone Call Number:</strong> {SHOP_INFO.phoneDisplay}</p>
                      <p><strong>WhatsApp Number:</strong> {SHOP_INFO.whatsappDisplay}</p>
                      <p><strong>JazzCash Number:</strong> <span className="font-mono text-amber-300">{SHOP_INFO.jazzCashDisplay}</span></p>
                      <p><strong>EasyPaisa Number:</strong> <span className="font-mono text-amber-300">{SHOP_INFO.easyPaisaDisplay}</span></p>
                      <p><strong>{SHOP_INFO.bankName} Account:</strong> <span className="font-mono text-amber-300">{SHOP_INFO.bankAccountNumber}</span></p>
                      <p><strong>Shop Address:</strong> {SHOP_INFO.address}</p>
                      <p><strong>Shop Timings:</strong> {SHOP_INFO.timings}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 space-y-2">
                    <span className="font-bold block text-sm text-slate-900">How Live Product Updates Work</span>
                    <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                      <li>Only your Google account (<strong>{OWNER_EMAIL}</strong>) can sign in to this Admin Panel.</li>
                      <li>Click on the <strong>Products</strong> tab above and click <strong>Edit</strong> or <strong>Add Product</strong>.</li>
                      <li>Click <strong>Upload Photo</strong> to select a picture from your phone or computer.</li>
                      <li>Click <strong>Save Changes Live</strong> — your changes immediately appear on every customer&apos;s phone across Pakistan!</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
