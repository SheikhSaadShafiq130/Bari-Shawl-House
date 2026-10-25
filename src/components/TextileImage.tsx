/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, ProductColorOption, StudioAngleMode } from '../types';

interface TextileImageProps {
  product: Product;
  className?: string;
  aspect?: '4/5' | '4/3' | '1/1' | '16/9';
  showOverlayCode?: boolean;
  viewMode?: StudioAngleMode;
  selectedColor?: ProductColorOption;
  customOverrideImage?: string;
}

/**
 * Computes a natural, luminance-aware studio color grading overlay when the user
 * selects an alternate color swatch that doesn't have a separate image file.
 */
function getStudioColorTintLayers(hex: string): {
  primaryStyle: React.CSSProperties;
  secondaryStyle?: React.CSSProperties;
} {
  const clean = hex.replace('#', '').trim();
  const r = parseInt(clean.substring(0, 2) || '80', 16);
  const g = parseInt(clean.substring(2, 4) || '80', 16);
  const b = parseInt(clean.substring(4, 6) || '80', 16);
  // Relative luminance (0..255)
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  // Very light / ivory / off-white / cream shades
  if (lum > 210) {
    return {
      primaryStyle: {
        backgroundColor: hex,
        mixBlendMode: 'soft-light',
        opacity: 0.72,
      },
      secondaryStyle: {
        background:
          'radial-gradient(circle at 50% 45%, rgba(255,253,248,0.28) 0%, rgba(235,228,212,0.42) 100%)',
        mixBlendMode: 'screen',
        opacity: 0.45,
      },
    };
  }

  // Deep obsidian / jet black / charcoal shades
  if (lum < 48) {
    return {
      primaryStyle: {
        backgroundColor: hex,
        mixBlendMode: 'color',
        opacity: 0.58,
      },
      secondaryStyle: {
        backgroundColor: hex,
        mixBlendMode: 'multiply',
        opacity: 0.36,
      },
    };
  }

  // Rich jewel, earth & heritage tones (crimson, emerald, camel, navy, plum, mustard)
  return {
    primaryStyle: {
      backgroundColor: hex,
      mixBlendMode: 'color',
      opacity: 0.56,
    },
    secondaryStyle: {
      backgroundColor: hex,
      mixBlendMode: 'multiply',
      opacity: 0.18,
    },
  };
}

/**
 * Renders the product's real photograph across 4 Myntra-style professional studio angles:
 * 1. 'full': Full Shawl & Pallu Showcase
 * 2. 'wearing': Editorial Shoulder Drape & Fall Framing
 * 3. 'arm-drape': Folded Three-Layer Cascade / Arm Drape Display
 * 4. 'macro-zoom': Macro Embroidery, Zari Border & Bumble Tassel Loupe (2.2x)
 */
export const TextileImage: React.FC<TextileImageProps> = ({
  product,
  className = '',
  aspect = '4/3',
  showOverlayCode = false,
  viewMode = 'full',
  selectedColor,
  customOverrideImage,
}) => {
  const [imgError, setImgError] = useState(false);

  const effectiveImage =
    customOverrideImage ||
    selectedColor?.image ||
    product.image;

  useEffect(() => {
    setImgError(false);
  }, [effectiveImage, product.id, viewMode, selectedColor?.hex]);

  const aspectClass =
    aspect === '4/5'
      ? 'aspect-[4/5]'
      : aspect === '1/1'
      ? 'aspect-square'
      : aspect === '16/9'
      ? 'aspect-video'
      : 'aspect-[4/3]';

  const activeHex = selectedColor?.hex || product.colorHex;
  const activeColorName = selectedColor?.name || product.color;
  const isAlternateColorSelected =
    Boolean(selectedColor) &&
    selectedColor?.hex.toLowerCase() !== product.colorHex.toLowerCase() &&
    !selectedColor?.image &&
    !customOverrideImage;

  const tintLayers = isAlternateColorSelected
    ? getStudioColorTintLayers(activeHex)
    : null;

  const hasValidImage = Boolean(
    effectiveImage && effectiveImage.trim().length > 0 && !imgError
  );

  // If customOverrideImage is explicitly provided for this gallery slot, show it directly
  if (customOverrideImage && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#E5DEC9] ${aspectClass} ${className}`}>
        <img
          src={customOverrideImage}
          alt={`${product.name} - ${activeColorName}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
        />
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 2: EDITORIAL SHOULDER DRAPE & FALL PERSPECTIVE
  // Uses real photographic multi-panel fold framing (zero cartoon mannequin art)
  // ============================================================================
  if (viewMode === 'wearing' && hasValidImage) {
    return (
      <div
        className={`relative overflow-hidden bg-[#1E1B24] select-none ${aspectClass} ${className}`}
      >
        {/* Blurred Atmospheric Studio Backdrop from Real Product Photo */}
        <img
          src={effectiveImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center scale-125 blur-md opacity-40 brightness-75"
        />

        {/* Warm Studio Key Light Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 25%, rgba(250,247,242,0.18) 0%, rgba(30,27,36,0.65) 100%)',
          }}
        />

        {/* Dual-Shoulder Draped Panels Composed from Real Photograph */}
        <div className="relative w-full h-full flex items-stretch justify-center px-[8%] pt-[4%] pb-[3%] gap-2">
          {/* Left Shoulder Drape Wing */}
          <div className="relative flex-1 h-[92%] rounded-t-2xl rounded-b-md overflow-hidden shadow-2xl border border-amber-200/25 bg-[#2A2533]">
            <img
              src={effectiveImage}
              alt={`${product.name} left shoulder drape`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-left-top scale-125 origin-top-left"
            />
            {tintLayers && (
              <>
                <div className="absolute inset-0 pointer-events-none" style={tintLayers.primaryStyle} />
                {tintLayers.secondaryStyle && (
                  <div className="absolute inset-0 pointer-events-none" style={tintLayers.secondaryStyle} />
                )}
              </>
            )}
            {/* Realistic Vertical Drape Pleat Lighting */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.32) 0%, rgba(255,255,255,0.12) 35%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.42) 100%)',
              }}
            />
          </div>

          {/* Right Overlapping Pallu Shoulder Throw (Longer Fall) */}
          <div className="relative flex-[1.25] h-full rounded-t-2xl rounded-b-md overflow-hidden shadow-2xl border border-amber-300/35 bg-[#2A2533] -ml-3 z-10">
            <img
              src={effectiveImage}
              alt={`${product.name} pallu shoulder fall`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-right-bottom scale-115 origin-bottom-right"
            />
            {tintLayers && (
              <>
                <div className="absolute inset-0 pointer-events-none" style={tintLayers.primaryStyle} />
                {tintLayers.secondaryStyle && (
                  <div className="absolute inset-0 pointer-events-none" style={tintLayers.secondaryStyle} />
                )}
              </>
            )}
            {/* 3D Cylinder Drape Highlight & Shadow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(255,255,255,0.14) 28%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.36) 100%)',
              }}
            />
            {/* Subtle Woven Selvedge Trim Line */}
            <div className="absolute inset-y-0 left-1.5 w-[1.5px] bg-amber-300/45 pointer-events-none" />
          </div>
        </div>

        {/* Clean Studio Angle Caption only when showOverlayCode is active */}
        {showOverlayCode && (
          <div className="absolute bottom-2.5 left-2.5 z-20 bg-[#1E1B24]/90 text-stone-100 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700/80 backdrop-blur-xs">
            2/4 · Shoulder Drape &amp; Pallu Fall
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 3: FOLDED THREE-LAYER CASCADE / ARM FALL DISPLAY
  // Shows fabric thickness, fold volume, and border alignment
  // ============================================================================
  if (viewMode === 'arm-drape' && hasValidImage) {
    return (
      <div
        className={`relative overflow-hidden bg-[#E6DFD3] select-none ${aspectClass} ${className}`}
      >
        {/* Warm Sandstone Studio Backdrop */}
        <img
          src={effectiveImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center scale-150 blur-xl opacity-30"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(250,247,242,0.5) 0%, rgba(205,194,176,0.75) 100%)',
          }}
        />

        {/* Three-Tier Folded Textile Cascade (Boutique Arm / Hanger Presentation) */}
        <div className="relative w-full h-full flex flex-col items-center justify-center px-[10%] py-[6%]">
          {/* Velvet-Wrapped Boutique Display Bar */}
          <div className="w-[88%] h-3 rounded-full bg-gradient-to-r from-[#2D2636] via-[#463C52] to-[#2D2636] shadow-md border-b border-amber-300/40 z-20 flex items-center justify-between px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300/80" />
          </div>

          {/* Folded Shawl Layers Hanging Over the Bar */}
          <div className="relative w-[82%] flex-1 -mt-1.5 rounded-b-xl overflow-hidden shadow-2xl border border-[#B8AD99] bg-[#1E1B24]">
            <img
              src={effectiveImage}
              alt={`${product.name} folded arm drape`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center scale-125"
            />
            {tintLayers && (
              <>
                <div className="absolute inset-0 pointer-events-none" style={tintLayers.primaryStyle} />
                {tintLayers.secondaryStyle && (
                  <div className="absolute inset-0 pointer-events-none" style={tintLayers.secondaryStyle} />
                )}
              </>
            )}

            {/* Realistic Vertical Pleat Folds */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, rgba(255,255,255,0.12) 20%, rgba(0,0,0,0.24) 40%, rgba(255,255,255,0.15) 60%, rgba(0,0,0,0.25) 80%, rgba(0,0,0,0.38) 100%)',
              }}
            />

            {/* Top Over-Bar Shadow */}
            <div
              className="absolute inset-x-0 top-0 h-5 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)',
              }}
            />

            {/* Bottom Pallu Border Fold Step */}
            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/45 to-transparent border-t border-amber-200/30 pointer-events-none" />
          </div>
        </div>

        {showOverlayCode && (
          <div className="absolute bottom-2.5 left-2.5 z-20 bg-[#1E1B24]/90 text-stone-100 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700/80 backdrop-blur-xs">
            3/4 · Folded Arm Drape ({product.weightGrams || 650}g)
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 4: MACRO BORDER, EMBROIDERY & TASSEL CLOSE-UP VIEW (2.2x)
  // ============================================================================
  if (viewMode === 'macro-zoom' && hasValidImage) {
    return (
      <div className={`relative overflow-hidden bg-[#1E1B24] select-none ${aspectClass} ${className}`}>
        <div className="w-full h-full overflow-hidden">
          <img
            src={effectiveImage}
            alt={`${product.name} border and weave macro close-up`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-bottom scale-[2.05] origin-bottom transition-transform duration-500"
          />
          {tintLayers && (
            <>
              <div className="absolute inset-0 pointer-events-none" style={tintLayers.primaryStyle} />
              {tintLayers.secondaryStyle && (
                <div className="absolute inset-0 pointer-events-none" style={tintLayers.secondaryStyle} />
              )}
            </>
          )}
        </div>

        {/* Subtle Optical Macro Frame */}
        <div className="absolute inset-2.5 border border-amber-300/35 rounded-lg pointer-events-none" />

        {showOverlayCode && (
          <div className="absolute bottom-2.5 left-2.5 z-20 bg-[#1E1B24]/90 text-stone-100 text-[11px] font-medium px-2.5 py-1 rounded-md border border-stone-700/80 backdrop-blur-xs">
            4/4 · 2.2× Border &amp; Weave Close-Up
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 1 (DEFAULT): FULL SHAWL & PALLU DISPLAY
  // ============================================================================
  if (hasValidImage) {
    return (
      <div className={`relative overflow-hidden bg-[#E5DEC9] ${aspectClass} ${className}`}>
        <img
          src={effectiveImage}
          alt={`${product.name} - ${activeColorName}`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
        />

        {/* Dynamic Luminance-Preserving Studio Color Swatch Tint */}
        {tintLayers && (
          <>
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-300"
              style={tintLayers.primaryStyle}
            />
            {tintLayers.secondaryStyle && (
              <div
                className="absolute inset-0 pointer-events-none transition-colors duration-300"
                style={tintLayers.secondaryStyle}
              />
            )}
          </>
        )}

        {showOverlayCode && (
          <div className="absolute bottom-2.5 left-2.5 bg-[#1E1B24]/85 text-amber-300 text-[11px] font-mono px-2.5 py-0.5 rounded border border-amber-400/30 backdrop-blur-xs">
            {product.code} · {product.material}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // INTRICATE SVG TEXTILE WEAVE FALLBACK (Zero Broken Images Guarantee)
  // ============================================================================
  const accentColor =
    product.category === 'ladies'
      ? '#EAB308'
      : product.category === 'gents'
      ? '#D97706'
      : product.category === 'bechgana'
      ? '#F59E0B'
      : product.category === 'laungi'
      ? '#FACC15'
      : '#94A3B8';

  const patternId = `pattern-${product.id}-${product.patternType}`;

  return (
    <div
      className={`relative overflow-hidden select-none ${aspectClass} ${className}`}
      style={{ backgroundColor: activeHex }}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.16) 0%, rgba(0,0,0,0.22) 70%, rgba(0,0,0,0.48) 100%)`,
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {product.patternType === 'kashmiri' && (
            <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M24 4 C32 4, 40 12, 40 24 C40 36, 28 44, 24 44 C20 44, 8 36, 8 24 C8 12, 16 4, 24 4 Z"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
              />
              <circle cx="24" cy="24" r="5" fill="none" stroke={accentColor} strokeWidth="1" />
            </pattern>
          )}
          {product.patternType !== 'kashmiri' && (
            <pattern id={patternId} width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M16 2 L30 16 L16 30 L2 16 Z"
                fill="none"
                stroke={accentColor}
                strokeWidth="1.2"
              />
              <circle cx="16" cy="16" r="3" fill={accentColor} />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <div
        className="absolute inset-3 border-2 pointer-events-none flex flex-col justify-between p-2"
        style={{ borderColor: `${accentColor}66` }}
      >
        <div className="border-t border-dashed w-full" style={{ borderColor: `${accentColor}55` }} />
        <div className="border-b-4 border-double w-full" style={{ borderColor: `${accentColor}99` }} />
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
        <div className="bg-stone-950/75 backdrop-blur-xs px-2.5 py-1 rounded border border-amber-400/30">
          <p className="text-[10px] uppercase tracking-widest text-amber-300 font-mono">
            {product.material}
          </p>
          <p className="text-[11px] text-stone-200 font-serif-luxury italic truncate max-w-[190px]">
            {product.style}
          </p>
        </div>
      </div>
    </div>
  );
};
