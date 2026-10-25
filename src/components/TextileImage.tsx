/**
 * @license
 * @spdx-license-identifier Apache-2.0
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
 * Renders the product's real photograph across 4 Myntra-style professional studio angles:
 * 1. 'full': Full Shawl & Pallu Display
 * 2. 'wearing': Model / Shoulder Drape Editorial View
 * 3. 'arm-drape': Hanging on Forearm / Folded Fall View
 * 4. 'macro-zoom': Macro Embroidery, Border & Bumble Tassel Close-Up
 *
 * Also supports live color-swatch tinting when a customer selects an alternate color option,
 * and falls back to an intricate woven textile SVG if an image URL fails.
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
  // STUDIO ANGLE 2: WEARING / MODEL SHOULDER DRAPE VIEW (Myntra Editorial Style)
  // ============================================================================
  if (viewMode === 'wearing' && hasValidImage) {
    const isLadies = product.category === 'ladies';
    const isYouth = product.category === 'bechgana';
    const uid = `${product.id}-wear`;

    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-b from-[#E8E0D2] via-[#DDD3C2] to-[#CFC3AE] select-none ${aspectClass} ${className}`}
      >
        {/* Warm Studio Backdrop Lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 28%, rgba(255,252,245,0.75) 0%, rgba(210,198,178,0.25) 58%, rgba(160,145,125,0.45) 100%)',
          }}
        />

        {/* Studio Editorial Composite SVG with Real Product Texture Draped Over Shoulders */}
        <svg
          viewBox="0 0 400 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          aria-label={`${product.name} worn over shoulders`}
        >
          <defs>
            <linearGradient id={`kameez-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLadies ? '#2A242D' : '#F7F4EE'} />
              <stop offset="55%" stopColor={isLadies ? '#1E1921' : '#EAE3D5'} />
              <stop offset="100%" stopColor={isLadies ? '#141116' : '#D8CEBC'} />
            </linearGradient>

            <linearGradient id={`fold-shadow-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.32" />
              <stop offset="22%" stopColor="#000000" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="78%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
            </linearGradient>

            {/* Clip Path for Left & Right Shoulder Shawl Drape (Pakistani / Myntra Style) */}
            <clipPath id={`shawl-drape-clip-${uid}`}>
              <path d="M 92,74 C 122,62 155,60 172,66 L 166,288 C 132,292 98,288 72,278 C 66,205 72,120 92,74 Z M 228,66 C 245,60 278,62 308,74 C 328,120 334,205 328,278 C 292,292 225,296 178,286 L 204,132 Z" />
            </clipPath>
          </defs>

          {/* Subtle Studio Arch Pedestal Backdrop */}
          <path
            d="M 65,320 L 65,120 A 135,115 0 0,1 335,120 L 335,320 Z"
            fill="#F5F0E6"
            opacity="0.55"
          />

          {/* Tailored Studio Mannequin / Model Neck & Collar */}
          <path
            d="M 176,22 C 176,38 172,52 164,62 L 236,62 C 228,52 224,38 224,22 Z"
            fill="#C69C72"
            opacity="0.9"
          />
          <ellipse cx="200" cy="22" rx="26" ry="12" fill="#B58960" />

          {/* Base Kurta / Shalwar Kameez Torso Silhouette */}
          <path
            d={
              isYouth
                ? 'M 98,74 C 130,58 165,56 200,56 C 235,56 270,58 302,74 L 322,320 L 78,320 Z'
                : 'M 78,72 C 118,54 162,52 200,52 C 238,52 282,54 322,72 L 348,320 L 52,320 Z'
            }
            fill={`url(#kameez-${uid})`}
            stroke="#B8AFA0"
            strokeWidth="1"
          />

          {/* Kurta Collar & Placket Details */}
          <path
            d="M 168,56 L 200,98 L 232,56"
            fill="none"
            stroke={isLadies ? '#D4AF37' : '#A89F91'}
            strokeWidth="2.5"
          />
          <line
            x1="200"
            y1="98"
            x2="200"
            y2="195"
            stroke={isLadies ? '#D4AF37' : '#B8AFA0'}
            strokeWidth="2"
          />

          {/* Drop Shadow of Draped Shawl onto Kurta */}
          <path
            d="M 88,76 C 122,64 155,62 174,68 L 170,294 C 132,298 95,294 68,282 Z"
            fill="rgba(0,0,0,0.22)"
            transform="translate(4, 6)"
          />
          <path
            d="M 226,68 C 245,62 278,64 312,76 C 332,122 338,208 332,282 C 294,296 222,300 174,290 L 202,134 Z"
            fill="rgba(0,0,0,0.25)"
            transform="translate(-4, 6)"
          />

          {/* Real Shawl Photograph Mapped Inside the Shoulder Drape ClipPath */}
          <g clipPath={`url(#shawl-drape-clip-${uid})`}>
            <image
              href={effectiveImage}
              x="45"
              y="45"
              width="310"
              height="265"
              preserveAspectRatio="xMidYMid slice"
            />
            {isAlternateColorSelected && (
              <rect
                x="45"
                y="45"
                width="310"
                height="265"
                fill={activeHex}
                style={{ mixBlendMode: 'color', opacity: 0.68 }}
              />
            )}
            {/* 3D Studio Fold Shading Overlay */}
            <rect
              x="45"
              y="45"
              width="310"
              height="265"
              fill={`url(#fold-shadow-${uid})`}
            />
          </g>

          {/* Drape Contour Fold Lines & Golden Border Accent */}
          <path
            d="M 172,66 L 166,288 M 228,66 L 204,132 L 178,286"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeOpacity="0.65"
          />

          {/* Hand-Knotted Bumble Tassels Hanging at Bottom of Draped Shawl */}
          {Array.from({ length: 18 }).map((_, i) => {
            const xPos = 76 + i * 14;
            const yBase = i < 7 ? 283 : 287;
            return (
              <g key={i}>
                <circle cx={xPos} cy={yBase} r="2.2" fill="#D4AF37" />
                <path
                  d={`M ${xPos},${yBase + 2} L ${xPos - 2},${yBase + 15} M ${xPos},${yBase + 2} L ${xPos + 2},${yBase + 15}`}
                  stroke={activeHex === '#F5F2EB' || activeHex === '#EAE0C8' ? '#D6C7B2' : '#1E1B24'}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Studio Angle Label Pill */}
        <div className="absolute top-2.5 left-2.5 bg-[#1E1B24]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-400/30 shadow-xs backdrop-blur-xs">
          2/4 · {isLadies ? 'Ladies Shoulder Drape' : isYouth ? 'Youth Fit Drape' : 'Gents Shoulder Drape'}
        </div>

        {/* Active Color Swatch Indicator */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-md border border-stone-300 shadow-xs flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-stone-400 shrink-0"
            style={{ backgroundColor: activeHex }}
          />
          <span className="truncate max-w-[140px]">{activeColorName}</span>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 3: HANGING ON FOREARM / ARM DRAPE VIEW (Myntra Luxury Style)
  // ============================================================================
  if (viewMode === 'arm-drape' && hasValidImage) {
    const uid = `${product.id}-arm`;
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#EFECE6] via-[#E2DACB] to-[#D2C7B4] select-none ${aspectClass} ${className}`}
      >
        <svg
          viewBox="0 0 400 320"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          aria-label={`${product.name} hanging on arm`}
        >
          <defs>
            <clipPath id={`arm-drape-clip-${uid}`}>
              <path d="M 118,86 C 165,80 235,80 282,86 L 296,268 C 240,276 160,276 104,268 Z" />
            </clipPath>
            <linearGradient id={`pleat-shade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
              <stop offset="18%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="34%" stopColor="#000" stopOpacity="0.28" />
              <stop offset="52%" stopColor="#fff" stopOpacity="0.12" />
              <stop offset="68%" stopColor="#000" stopOpacity="0.28" />
              <stop offset="85%" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.38" />
            </linearGradient>
          </defs>

          {/* Soft Studio Wall Panel Lines */}
          <rect x="35" y="20" width="330" height="280" rx="14" fill="#FAF7F2" opacity="0.55" />

          {/* Extended Tailored Sleeve & Forearm / Studio Bar Holding the Shawl */}
          {/* Left Sleeve Cuff */}
          <path
            d="M 0,72 L 108,82 L 104,122 L 0,116 Z"
            fill="#1E1B24"
          />
          <path d="M 96,81 L 108,82 L 104,122 L 92,121 Z" fill="#D4AF37" opacity="0.85" />

          {/* Forearm & Hand Supporting the Folded Shawl */}
          <path
            d="M 106,86 L 298,88 C 312,88 322,95 322,104 C 322,113 310,118 295,118 L 104,116 Z"
            fill="#C69568"
          />

          {/* Drop Shadow of Hanging Shawl */}
          <path
            d="M 122,92 L 286,92 L 300,276 L 110,276 Z"
            fill="rgba(0,0,0,0.22)"
            transform="translate(6, 8)"
          />

          {/* Folded Shawl Hanging Vertically Over the Forearm */}
          <g clipPath={`url(#arm-drape-clip-${uid})`}>
            <image
              href={effectiveImage}
              x="95"
              y="75"
              width="210"
              height="205"
              preserveAspectRatio="xMidYMid slice"
            />
            {isAlternateColorSelected && (
              <rect
                x="95"
                y="75"
                width="210"
                height="205"
                fill={activeHex}
                style={{ mixBlendMode: 'color', opacity: 0.68 }}
              />
            )}
            {/* Vertical Pleat Shadows */}
            <rect
              x="95"
              y="75"
              width="210"
              height="205"
              fill={`url(#pleat-shade-${uid})`}
            />
          </g>

          {/* Top Rounded Fold Over the Forearm */}
          <path
            d="M 118,86 C 165,78 235,78 282,86"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />

          {/* Hand-Knotted Bumble Tassel Fringe Hanging at Bottom */}
          {Array.from({ length: 15 }).map((_, i) => {
            const xPos = 112 + i * 12.5;
            return (
              <g key={i}>
                <circle cx={xPos} cy="270" r="2.4" fill="#D4AF37" />
                <path
                  d={`M ${xPos},272 L ${xPos - 2.5},292 M ${xPos},272 L ${xPos},294 M ${xPos},272 L ${xPos + 2.5},292`}
                  stroke="#1E1B24"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute top-2.5 left-2.5 bg-[#1E1B24]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-400/30 shadow-xs backdrop-blur-xs">
          3/4 · Hanging on Arm &amp; Bumble Fall
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-stone-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-stone-300 shadow-xs">
          {product.weightGrams ? `${product.weightGrams}g Drape` : product.material}
        </div>
      </div>
    );
  }

  // ============================================================================
  // STUDIO ANGLE 4: MACRO BORDER, EMBROIDERY & TASSEL CLOSE-UP VIEW
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
            className="w-full h-full object-cover object-bottom scale-[1.85] origin-bottom transition-transform duration-500"
          />
          {isAlternateColorSelected && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: activeHex,
                mixBlendMode: 'color',
                opacity: 0.65,
              }}
            />
          )}
        </div>

        {/* Subtle Macro Loupe Frame */}
        <div className="absolute inset-2.5 border border-amber-300/40 rounded-lg pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 bg-[#1E1B24]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-400/30 shadow-xs backdrop-blur-xs">
          4/4 · Pallu Border &amp; Bumble Zoom (2.0×)
        </div>

        <div className="absolute bottom-2.5 inset-x-2.5 bg-[#1E1B24]/90 text-stone-100 text-[10px] px-3 py-1.5 rounded-md border border-stone-700 flex items-center justify-between gap-2 backdrop-blur-xs">
          <span className="font-semibold truncate">{product.style}</span>
          <span className="font-mono text-amber-300 shrink-0">{product.material}</span>
        </div>
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

        {/* Dynamic Studio Color Swatch Tint when customer selects an alternate color */}
        {isAlternateColorSelected && (
          <div
            className="absolute inset-0 pointer-events-none transition-colors duration-300"
            style={{
              backgroundColor: activeHex,
              mixBlendMode: 'color',
              opacity: 0.65,
            }}
          />
        )}

        {isAlternateColorSelected && (
          <div className="absolute top-2.5 right-2.5 bg-white/95 text-stone-900 text-[10px] font-bold px-2.5 py-1 rounded-md border border-stone-300 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
            <span
              className="w-2.5 h-2.5 rounded-full border border-stone-400 shrink-0"
              style={{ backgroundColor: activeHex }}
            />
            <span>Color: {activeColorName}</span>
          </div>
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
