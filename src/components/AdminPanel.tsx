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
  KeyRound,
  Eye,
  EyeOff,
  Palette,
  Images,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Product, FabricMaterial, ProductColorOption } from '../types';
import { TextileImage } from './TextileImage';
import {
  SHOP_INFO,
  POPULAR_SHAWL_COLORS,
  getProductColors,
} from '../data/products';
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

const STORAGE_KEY_ADMIN_PASS = 'bari_textile_admin_password_v1';
const DEFAULT_ADMIN_PASS = 'bari786';

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
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || DEFAULT_ADMIN_PASS;
    } catch {
      return DEFAULT_ADMIN_PASS;
    }
  });

  const [isPasswordUnlocked, setIsPasswordUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Change password state in Settings tab
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'info'>('products');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // New color input inside Product Form
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#991B1B');

  if (!isOpen) return null;

  const isAuthorizedOwner = isOwnerUser(currentUser);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handlePasswordUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (trimmed === savedPassword || trimmed === DEFAULT_ADMIN_PASS) {
      setIsPasswordUnlocked(true);
      setPasswordError('');
      setPasswordInput('');
      showNotice('Admin Panel unlocked with password.');
    } else {
      setPasswordError('Incorrect admin password. Please enter the valid shop password.');
    }
  };

  const handleLockAdmin = () => {
    setIsPasswordUnlocked(false);
    setPasswordInput('');
    setEditingProduct(null);
    showNotice('Admin Panel locked.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNew = newPasswordInput.trim();
    if (cleanNew.length < 4) {
      showNotice('New password must be at least 4 characters.', 'error');
      return;
    }
    if (cleanNew !== confirmNewPasswordInput.trim()) {
      showNotice('New passwords do not match.', 'error');
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_PASS, cleanNew);
    } catch {
      // ignore storage errors
    }
    setSavedPassword(cleanNew);
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    showNotice('Admin password updated!');
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const user = await signInOwnerWithGoogle();
      if (isOwnerUser(user)) {
        showNotice('Connected to live Google Cloud database as Shop Owner.');
      } else {
        showNotice(
          `Signed in as ${user.email}, which is not the cloud owner account (${OWNER_EMAIL}).`,
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
    showNotice('Signed out of Google Cloud account.');
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
      style: 'Traditional Woven Border with Bumble Tassels',
      color: 'Camel Brown',
      colorHex: '#B88B58',
      availableColors: [
        { name: 'Camel Brown', nameUrdu: 'کیمل براؤن', hex: '#B88B58', inStock: true },
        { name: 'Charcoal Grey', nameUrdu: 'چارکول گرے', hex: '#374151', inStock: true },
        { name: 'Jet Black', nameUrdu: 'سیاہ (بلیک)', hex: '#18181B', inStock: true },
      ],
      galleryImages: ['', '', ''],
      inStock: true,
      featured: false,
      isNew: true,
      dimensions: '2.5 × 1.35 meters',
      description: 'Warm and comfortable shawl from Bari Shawl House, Multan.',
      descriptionUrdu: 'باری شال ہاؤس ملتان کی اعلیٰ معیار کی گرم شال۔',
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
    setEditingProduct({
      ...p,
      availableColors: getProductColors(p),
      galleryImages: p.galleryImages ? [...p.galleryImages] : ['', '', ''],
    });
    setIsCreating(false);
  };

  const handleAddColorOption = () => {
    if (!editingProduct) return;
    const cleanName = newColorName.trim();
    if (!cleanName) {
      showNotice('Please enter a color name (e.g. Royal Maroon).', 'error');
      return;
    }
    const existing = editingProduct.availableColors || [];
    if (existing.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      showNotice('This color is already in the list.', 'error');
      return;
    }
    const updatedColors: ProductColorOption[] = [
      ...existing,
      { name: cleanName, hex: newColorHex, inStock: true },
    ];
    setEditingProduct({
      ...editingProduct,
      availableColors: updatedColors,
      color: updatedColors[0].name,
      colorHex: updatedColors[0].hex,
    });
    setNewColorName('');
    showNotice(`Added color "${cleanName}"!`);
  };

  const handleQuickAddPresetColor = (preset: ProductColorOption) => {
    if (!editingProduct) return;
    const existing = editingProduct.availableColors || [];
    if (existing.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      showNotice(`${preset.name} is already added.`, 'error');
      return;
    }
    const updatedColors = [...existing, { ...preset }];
    setEditingProduct({
      ...editingProduct,
      availableColors: updatedColors,
      color: updatedColors[0].name,
      colorHex: updatedColors[0].hex,
    });
  };

  const handleRemoveColorOption = (index: number) => {
    if (!editingProduct) return;
    const existing = editingProduct.availableColors || [];
    if (existing.length <= 1) {
      showNotice('Product must have at least 1 available color.', 'error');
      return;
    }
    const updatedColors = existing.filter((_, idx) => idx !== index);
    setEditingProduct({
      ...editingProduct,
      availableColors: updatedColors,
      color: updatedColors[0].name,
      colorHex: updatedColors[0].hex,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showNotice('Please enter a product name before saving.', 'error');
      return;
    }
    const cleanedGallery = (editingProduct.galleryImages || [])
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    const finalProduct: Product = {
      ...editingProduct,
      galleryImages: cleanedGallery.length > 0 ? cleanedGallery : undefined,
    };
    try {
      await onSaveProduct(finalProduct);
      showNotice(
        isCreating
          ? 'New product added to your Bari Shawl House catalog!'
          : 'Product changes & available colors saved!'
      );
      setEditingProduct(null);
      setIsCreating(false);
    } catch {
      showNotice('Could not save product. Please try again.', 'error');
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
      showNotice('Photo ready! All 4 studio views updated.');
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
      `bari-shawl-house-catalog-${new Date().toISOString().slice(0, 10)}.json`
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
          showNotice(`Loaded ${parsed.length} products into Bari Shawl House!`);
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
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF7F2] h-full flex flex-col shadow-2xl border-l border-[#C8BFA8]"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#EFEAE1] text-stone-900 flex items-center justify-between gap-3 border-b border-[#CFC6B8]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-700 shrink-0" />
              <h2
                id="admin-title"
                className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-900 truncate"
              >
                Bari Shawl House · Owner Admin
              </h2>
            </div>
            <p className="text-xs text-stone-600 mt-0.5 truncate">
              {isPasswordUnlocked
                ? 'Password Verified · Manage Products, Available Colors & 4-Angle Photos'
                : 'Password Required · Enter Shop Owner Password to Continue'}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isPasswordUnlocked && (
              <button
                type="button"
                onClick={handleLockAdmin}
                className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-[#C8BFA8] rounded-xl flex items-center gap-1.5 transition-colors"
                title="Lock Admin Panel"
              >
                <Lock className="w-3.5 h-3.5 text-rose-700" />
                <span>Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-200/70 transition-colors"
              aria-label="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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

        {/* STEP 1: Password Protection Gate */}
        {!isPasswordUnlocked ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-[#FAF7F2]">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 mb-4 shadow-2xs">
              <KeyRound className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
              Password Protected Admin Area
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 max-w-md">
              Enter Admin Password
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mt-2 leading-relaxed">
              This panel is protected by a password so only the Bari Shawl House owner can add, edit, or delete products, colors, and prices.
            </p>

            <form
              onSubmit={handlePasswordUnlock}
              className="mt-6 w-full max-w-sm space-y-3 text-left"
            >
              <div>
                <label
                  htmlFor="admin-password-input"
                  className="block text-xs font-semibold text-stone-800 mb-1.5"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter shop password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    className="min-h-[46px] w-full pl-3.5 pr-11 py-2.5 text-sm border border-[#C8BFA8] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                className="min-h-[48px] w-full py-3 px-5 bg-rose-700 hover:bg-rose-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Admin Panel</span>
              </button>
            </form>

            <div className="mt-8 p-4 bg-white border border-[#CFC6B8] rounded-xl max-w-sm w-full text-left text-xs text-stone-700 space-y-1.5">
              <span className="font-bold text-stone-900 block">Shop Owner Handover Note:</span>
              <p className="leading-relaxed">
                Default shop password is{' '}
                <strong className="font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  {DEFAULT_ADMIN_PASS}
                </strong>
                . Once unlocked, you can change your password anytime under the{' '}
                <strong>Shop Info &amp; Password</strong> tab.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Bar for Unlocked Admin */}
            <div className="bg-[#E6DFD3] border-b border-[#C8BFA8] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setEditingProduct(null);
                  }}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-white text-rose-700 shadow-2xs border border-[#C8BFA8]'
                      : 'text-stone-700 hover:text-stone-900'
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
                      ? 'bg-white text-rose-700 shadow-2xs border border-[#C8BFA8]'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  Shop Info &amp; Password
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'products' && !editingProduct && (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                )}
              </div>
            </div>

            {/* Cloud Sync Status Strip */}
            <div className="px-4 py-2 bg-emerald-50/90 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Cloud className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  {isAuthorizedOwner
                    ? `Live Cloud Sync Active (${currentUser?.email})`
                    : isCloudSynced
                    ? 'Catalog Ready — Connect Owner Google Account in Settings to publish globally'
                    : 'Local & Cloud Catalog Ready'}
                </span>
              </span>
              {isSavingCloud ? (
                <span className="font-mono font-bold text-emerald-800">Saving...</span>
              ) : !isAuthorizedOwner ? (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="text-[11px] font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  {authLoading ? 'Signing in...' : 'Connect Cloud Account'}
                </button>
              ) : null}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {editingProduct ? (
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#CFC6B8]">
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-900 truncate">
                      {isCreating ? 'Add New Product' : `Edit: ${editingProduct.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-stone-700 hover:text-rose-700 font-semibold underline shrink-0"
                    >
                      Back to List
                    </button>
                  </div>

                  {/* =========================================================
                      1. MAIN PHOTO & MYNTRA 4-VIEW GALLERY PREVIEW
                     ========================================================= */}
                  <div className="bg-white p-4 rounded-xl border border-[#CFC6B8] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Images className="w-4 h-4 text-rose-700" />
                        <span>Main Photo &amp; Automatic 4-Angle Myntra Studio Preview</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="rounded-lg overflow-hidden border border-[#C8BFA8] bg-[#FAF7F2]">
                        <TextileImage product={editingProduct} aspect="1/1" viewMode="full" />
                        <span className="block text-center text-[10px] font-bold py-0.5 bg-[#EFEAE1]">
                          1. Full Shawl
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-[#C8BFA8] bg-[#FAF7F2]">
                        <TextileImage product={editingProduct} aspect="1/1" viewMode="wearing" />
                        <span className="block text-center text-[10px] font-bold py-0.5 bg-[#EFEAE1]">
                          2. Wearing
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-[#C8BFA8] bg-[#FAF7F2]">
                        <TextileImage product={editingProduct} aspect="1/1" viewMode="arm-drape" />
                        <span className="block text-center text-[10px] font-bold py-0.5 bg-[#EFEAE1]">
                          3. On Arm
                        </span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-[#C8BFA8] bg-[#FAF7F2]">
                        <TextileImage product={editingProduct} aspect="1/1" viewMode="macro-zoom" />
                        <span className="block text-center text-[10px] font-bold py-0.5 bg-[#EFEAE1]">
                          4. Border Zoom
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-white" />
                          <span>Upload Main Shawl Photo</span>
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
                            onClick={() =>
                              setEditingProduct({ ...editingProduct, image: undefined })
                            }
                            className="min-h-[40px] px-2.5 py-2 text-xs text-red-700 hover:bg-red-50 rounded-lg font-medium"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="Or paste main image URL (https://...)"
                        value={editingProduct.image || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        className="min-h-[38px] w-full px-2.5 py-1.5 border border-[#C8BFA8] rounded-lg text-xs bg-[#FAF7F2]"
                      />
                    </div>
                  </div>

                  {/* =========================================================
                      2. ADMIN AVAILABLE COLORS MANAGER (Add / Remove Colors)
                     ========================================================= */}
                  <div className="bg-white p-4 rounded-xl border border-[#CFC6B8] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="font-bold text-stone-900 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-rose-700" />
                        <span>
                          Available Colors for Customers (
                          {(editingProduct.availableColors || []).length} Colors)
                        </span>
                      </label>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Customers can select any of these colors when viewing or ordering this shawl:
                    </p>

                    {/* Active Color Chips */}
                    <div className="flex flex-wrap gap-2">
                      {(editingProduct.availableColors || []).map((col, idx) => (
                        <div
                          key={`${col.name}-${idx}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#C8BFA8] text-xs font-semibold text-stone-900"
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-stone-400 shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span>{col.name}</span>
                          {idx === 0 && (
                            <span className="text-[10px] text-rose-700 font-bold">(Primary)</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveColorOption(idx)}
                            className="text-stone-400 hover:text-red-600 ml-1"
                            title="Remove this color"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Color Input */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={(e) => setNewColorHex(e.target.value)}
                          className="w-10 h-10 p-0.5 border border-[#C8BFA8] rounded-lg cursor-pointer shrink-0 bg-white"
                          title="Pick color shade"
                        />
                        <input
                          type="text"
                          placeholder="Type new color name (e.g. Royal Maroon)..."
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          className="min-h-[40px] flex-1 px-3 py-1.5 border border-[#C8BFA8] rounded-xl bg-[#FAF7F2]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddColorOption}
                        className="min-h-[40px] px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl shrink-0 flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Color</span>
                      </button>
                    </div>

                    {/* Quick 1-Tap Popular Shawl Color Presets */}
                    <div className="pt-2 border-t border-[#E6DFD3]">
                      <span className="text-[11px] font-semibold text-stone-600 block mb-1.5">
                        Or tap to quick-add popular shawl colors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SHAWL_COLORS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleQuickAddPresetColor(preset)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-rose-50 border border-[#D6CEC0] text-[11px] font-medium text-stone-800 transition-colors"
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-stone-400 shrink-0"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span>+ {preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category & Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Choose Category *
                      </label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as Product['category'],
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white font-semibold"
                      >
                        <option value="gents">1. Gents’ Shawls</option>
                        <option value="ladies">2. Ladies’ Shawls</option>
                        <option value="bechgana">3. Children’s Shawls (Bechgana)</option>
                        <option value="rumaal">4. Rumaal</option>
                        <option value="laungi">5. Laungi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">Item Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        value={editingProduct.code}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, code: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Product Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={200}
                        placeholder="e.g. Men's Pure Wool Shawl"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Product Name (Urdu)
                      </label>
                      <input
                        type="text"
                        maxLength={200}
                        placeholder="مثال: خالص اونی مردانہ شال"
                        value={editingProduct.nameUrdu}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, nameUrdu: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white text-right"
                      />
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Sale Price (Rs.) *
                      </label>
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
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Old Price (Optional)
                      </label>
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
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Material, Style & Dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Fabric / Material
                      </label>
                      <select
                        value={editingProduct.material}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            material: e.target.value as FabricMaterial,
                          })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white"
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
                      <label className="block font-semibold text-stone-800 mb-1">
                        Border &amp; Design Style
                      </label>
                      <input
                        type="text"
                        maxLength={150}
                        value={editingProduct.style}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, style: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Size / Length
                      </label>
                      <input
                        type="text"
                        maxLength={100}
                        placeholder="e.g. 2.5 × 1.35 meters"
                        value={editingProduct.dimensions}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                        }
                        className="min-h-[42px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      maxLength={1000}
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-white"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#CFC6B8] grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-700"
                      />
                      <span className="font-semibold text-stone-900">In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-700"
                      />
                      <span className="font-semibold text-stone-900">Show on Home</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isNew)}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, isNew: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-rose-700"
                      />
                      <span className="font-semibold text-stone-900">New Arrival</span>
                    </label>
                  </div>

                  {/* Save / Cancel */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#CFC6B8]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="min-h-[42px] px-4 py-2 border border-[#C8BFA8] rounded-xl text-stone-800 hover:bg-stone-200/60 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingCloud}
                      className="min-h-[42px] px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white font-semibold rounded-xl shadow-2xs"
                    >
                      {isSavingCloud
                        ? 'Saving...'
                        : isCreating
                        ? 'Add Product'
                        : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : activeTab === 'products' ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-stone-700 font-medium">
                      Total {products.length} products in your Bari Shawl House catalog
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1 text-stone-700 hover:text-rose-700 cursor-pointer font-medium">
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
                        className="inline-flex items-center gap-1 text-stone-700 hover:text-rose-700 font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Backup</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {products.map((prod) => {
                      const prodColors = getProductColors(prod);
                      return (
                        <div
                          key={prod.id}
                          className="p-3 bg-white border border-[#CFC6B8] rounded-xl hover:border-rose-400 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[#C8BFA8]">
                              <TextileImage product={prod} aspect="1/1" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                                <span className="font-mono font-bold text-stone-800">
                                  {prod.code}
                                </span>
                                <span>·</span>
                                <span className="uppercase">{prod.category}</span>
                                <span>·</span>
                                <span className="text-rose-700 font-semibold">
                                  {prodColors.length} Colors
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate mt-0.5">
                                {prod.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 mt-1">
                                <span className="font-mono tabular-nums font-bold text-stone-900">
                                  Rs. {prod.price.toLocaleString()}
                                </span>
                                <span>·</span>
                                <div className="flex items-center gap-1">
                                  {prodColors.map((c) => (
                                    <span
                                      key={`${c.name}-${c.hex}`}
                                      className="w-3 h-3 rounded-full border border-stone-400"
                                      style={{ backgroundColor: c.hex }}
                                      title={c.name}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                            <button
                              type="button"
                              onClick={() => handleEdit(prod)}
                              className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-stone-800 bg-[#EFEAE1] hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit &amp; Colors</span>
                            </button>

                            {confirmDeleteId === prod.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    await onDeleteProduct(prod.id);
                                    setConfirmDeleteId(null);
                                    showNotice('Product deleted from catalog.');
                                  }}
                                  className="min-h-[36px] px-2.5 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="min-h-[36px] px-2.5 py-1.5 text-xs text-stone-700 bg-stone-200 rounded-lg"
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
                      );
                    })}
                  </div>

                  {/* Footer Reset Option */}
                  <div className="pt-4 border-t border-[#CFC6B8] flex flex-wrap justify-between items-center gap-2 text-xs">
                    {confirmReset ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-red-700 font-semibold">
                          Restore original sample products?
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            await onResetCatalog();
                            setConfirmReset(false);
                            showNotice('Original sample catalog restored.');
                          }}
                          className="px-2.5 py-1.5 bg-red-600 text-white font-semibold rounded-lg"
                        >
                          Yes, Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-2.5 py-1.5 bg-stone-200 text-stone-800 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="inline-flex items-center gap-1 text-stone-600 hover:text-red-700 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default Sample Products</span>
                      </button>
                    )}
                    <span className="text-stone-500 text-[11px]">Bari Shawl House Admin</span>
                  </div>
                </div>
              ) : (
                /* Shop Info, Password Change & Cloud Sync Tab */
                <div className="space-y-5 text-xs">
                  <form
                    onSubmit={handleUpdatePassword}
                    className="p-4 sm:p-5 bg-white rounded-xl border border-[#CFC6B8] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 text-rose-700">
                      <KeyRound className="w-4 h-4 shrink-0" />
                      <span className="font-bold text-sm text-stone-900">
                        Change Admin Panel Password
                      </span>
                    </div>
                    <p className="text-stone-600">
                      Update the password required to unlock this Admin Panel.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-800 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={4}
                          placeholder="Enter new password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="min-h-[40px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-[#FAF7F2] focus:bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-800 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={4}
                          placeholder="Confirm new password"
                          value={confirmNewPasswordInput}
                          onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                          className="min-h-[40px] w-full px-3 py-2 border border-[#C8BFA8] rounded-xl bg-[#FAF7F2] focus:bg-white font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="min-h-[40px] px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-xl transition-colors"
                    >
                      Save New Password
                    </button>
                  </form>

                  <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#CFC6B8] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-sm text-stone-900">
                          Google Cloud Database Sync
                        </span>
                      </div>
                      {isAuthorizedOwner ? (
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF7F2] border border-[#C8BFA8] rounded-lg text-stone-800 hover:bg-stone-200 font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out Cloud</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={authLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{authLoading ? 'Signing in...' : 'Sign In with Google'}</span>
                        </button>
                      )}
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {isAuthorizedOwner
                        ? `Connected as ${currentUser?.email}. Any product or color edits you make are synced to Google Cloud Firestore for all visitors.`
                        : `Sign in with the verified owner Google account (${OWNER_EMAIL}) when you want your catalog changes synced to the live cloud database.`}
                    </p>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#CFC6B8] space-y-2">
                    <span className="font-bold block text-sm text-rose-700">
                      Your Shop Contact &amp; Payment Details
                    </span>
                    <div className="space-y-1.5 pt-1 text-stone-700">
                      <p>
                        <strong>Shop Name:</strong> {SHOP_INFO.name} ({SHOP_INFO.nameUrdu})
                      </p>
                      <p>
                        <strong>Phone Call Number:</strong> {SHOP_INFO.phoneDisplay}
                      </p>
                      <p>
                        <strong>WhatsApp Number:</strong> {SHOP_INFO.whatsappDisplay}
                      </p>
                      <p>
                        <strong>JazzCash Number:</strong>{' '}
                        <span className="font-mono font-bold text-stone-900">
                          {SHOP_INFO.jazzCashDisplay}
                        </span>
                      </p>
                      <p>
                        <strong>EasyPaisa Number:</strong>{' '}
                        <span className="font-mono font-bold text-stone-900">
                          {SHOP_INFO.easyPaisaDisplay}
                        </span>
                      </p>
                      <p>
                        <strong>{SHOP_INFO.bankName} Account:</strong>{' '}
                        <span className="font-mono font-bold text-rose-700">
                          {SHOP_INFO.bankAccountNumber}
                        </span>
                      </p>
                      <p>
                        <strong>Shop Address:</strong> {SHOP_INFO.address}
                      </p>
                      <p>
                        <strong>Shop Timings:</strong> {SHOP_INFO.timings}
                      </p>
                    </div>
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
