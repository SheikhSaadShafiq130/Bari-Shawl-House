/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface TextileImageProps {
  product: Product;
  aspect?: '4/3' | '16/9' | '1/1' | 'full';
  className?: string;
  showOverlayCode?: boolean;
}

export const TextileImage: React.FC<TextileImageProps> = ({
  product,
  aspect = '4/3',
  className = '',
  showOverlayCode = false,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [product.image]);

  const aspectClass =
    aspect === '4/3'
      ? 'aspect-[4/3]'
      : aspect === '16/9'
      ? 'aspect-[16/9]'
      : aspect === '1/1'
      ? 'aspect-square'
      : 'h-full w-full';

  const isCompact = aspect === '1/1';

  // If the shop owner uploaded a real photo or pasted a valid image URL
  if (product.image && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-stone-900 ${aspectClass} ${className}`}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-bottom transition-transform duration-300 group-hover:scale-105"
        />
        {showOverlayCode && (
          <span className="absolute bottom-2.5 left-2.5 z-20 rounded bg-stone-900/85 px-2 py-0.5 text-[11px] font-mono text-white backdrop-blur-xs">
            {product.code}
          </span>
        )}
      </div>
    );
  }

  // Studio Backdrop + Realistic Folded Shawl / Garment Illustration
  return (
    <div
      className={`relative overflow-hidden select-none flex items-center justify-center bg-stone-200/80 ${aspectClass} ${className}`}
      style={{
        background: 'linear-gradient(145deg, #f5f5f4 0%, #e7e5e4 55%, #d6d3d1 100%)',
      }}
    >
      {/* Subtle Studio Wooden / Stone Pedestal Base */}
      <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-stone-300/90 to-transparent pointer-events-none" />

      {/* Realistic Folded Shawl Swatch */}
      <div
        className={`relative transition-transform duration-300 group-hover:scale-[1.03] shadow-xl rounded-md overflow-hidden flex flex-col justify-between ${
          isCompact ? 'w-[84%] h-[84%] p-2' : 'w-[82%] h-[78%] p-3.5'
        }`}
        style={{
          backgroundColor: product.colorHex || '#292524',
          boxShadow: '0 14px 28px -8px rgba(28, 25, 23, 0.38), 0 4px 10px -2px rgba(28, 25, 23, 0.2)',
        }}
      >
        {/* Realistic Fabric Fold Highlights & Crease Shadows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.08) 28%, rgba(255,255,255,0.18) 48%, rgba(0,0,0,0.22) 76%, rgba(255,255,255,0.08) 100%)',
          }}
        />

        {/* Fine Woven Thread Texture */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0, rgba(255,255,255,0.18) 1px, transparent 0, transparent 3px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.22) 0, rgba(0,0,0,0.22) 1px, transparent 0, transparent 3px)',
            backgroundSize: '6px 6px',
          }}
        />

        {/* Pattern-Specific Traditional Embroidery & Weave Borders */}
        {product.patternType === 'royal-velvet' && (
          <>
            <div className="absolute inset-2 border-2 border-amber-300/75 rounded-xs pointer-events-none">
              <div className="absolute inset-1 border border-dashed border-amber-200/50" />
            </div>
            {!isCompact && (
              <>
                <svg
                  className="absolute top-3 left-3 w-7 h-7 text-amber-300/85 pointer-events-none"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  <path d="M0,0 L22,0 C22,12 12,22 0,22 Z" />
                  <circle cx="9" cy="9" r="2.5" fill="#fff" />
                </svg>
                <svg
                  className="absolute bottom-3 right-3 w-7 h-7 text-amber-300/85 pointer-events-none rotate-180"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  <path d="M0,0 L22,0 C22,12 12,22 0,22 Z" />
                  <circle cx="9" cy="9" r="2.5" fill="#fff" />
                </svg>
              </>
            )}
          </>
        )}

        {product.patternType === 'kashmiri' && (
          <>
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <svg
                className={isCompact ? 'w-12 h-12 text-amber-200' : 'w-24 h-24 text-amber-200'}
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M50 85 C 30 85, 20 65, 20 45 C 20 25, 40 15, 55 15 C 65 15, 75 25, 75 40 C 75 60, 60 70, 50 85 Z" />
                <circle cx="50" cy="50" r="11" />
              </svg>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-3 bg-amber-400/25 border-t border-amber-300/50 pointer-events-none" />
          </>
        )}

        {product.patternType === 'paisley' && (
          <div className="absolute inset-2.5 border border-amber-200/50 flex items-center justify-center pointer-events-none">
            <svg
              className={isCompact ? 'w-10 h-10 text-amber-100/40' : 'w-20 h-20 text-amber-100/40'}
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50,12 C65,12 78,26 78,45 C78,68 55,84 50,88 C45,84 22,68 22,45 C22,26 35,12 50,12 Z M50,30 C42,30 35,37 35,45 C35,58 50,68 50,68 C50,68 65,58 65,45 C65,37 58,30 50,30 Z" />
            </svg>
          </div>
        )}

        {product.patternType === 'herringbone' && (
          <>
            <div
              className="absolute inset-0 opacity-35 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(255,255,255,0.18) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.18) 25%, transparent 25%)',
                backgroundSize: '16px 16px',
              }}
            />
            {/* Swati Traditional Geometric Woven Patti */}
            <div className="absolute bottom-2.5 inset-x-0 h-5 bg-stone-950/65 border-y border-amber-400/60 flex items-center justify-around px-2 pointer-events-none">
              {[...Array(isCompact ? 4 : 8)].map((_, i) => (
                <span key={i} className="text-[9px] text-amber-300 font-mono">
                  ◆
                </span>
              ))}
            </div>
          </>
        )}

        {product.patternType === 'geometric' && (
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.22), rgba(255,255,255,0.22) 10px, transparent 10px, transparent 20px), repeating-linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.22) 10px, transparent 10px, transparent 20px)',
            }}
          />
        )}

        {product.patternType === 'laungi-stripe' && (
          <div
            className="absolute inset-0 opacity-75 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #B45309 0, #B45309 14px, #1E3A8A 14px, #1E3A8A 28px, #991B1B 28px, #991B1B 38px, #065F46 38px, #065F46 50px, #D97706 50px, #D97706 55px)',
            }}
          />
        )}

        {/* Center Woven Cloth Label Tag */}
        {!isCompact ? (
          <div className="relative z-10 m-auto bg-stone-950/80 border border-amber-300/50 px-3.5 py-2 rounded-xs text-center backdrop-blur-xs shadow-md max-w-[85%]">
            <p className="text-[9px] font-mono uppercase tracking-widest text-amber-300">
              {product.material}
            </p>
            <p className="font-serif-luxury text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1 mt-0.5">
              {product.style}
            </p>
            <p className="text-[10px] text-stone-300 mt-0.5">
              Bari Textile · Multan
            </p>
          </div>
        ) : (
          <div className="relative z-10 m-auto bg-stone-950/75 border border-amber-300/40 px-1.5 py-0.5 rounded-xs text-center">
            <span className="text-[9px] font-mono text-amber-200">{product.code}</span>
          </div>
        )}
      </div>

      {/* Realistic Shawl Fringe Tassels at Bottom Edge */}
      {!isCompact && (
        <div className="absolute bottom-2 inset-x-12 flex justify-between px-4 opacity-50 pointer-events-none">
          {[...Array(18)].map((_, idx) => (
            <span
              key={idx}
              className="w-[1.5px] h-2.5 bg-stone-600 rounded-full"
            />
          ))}
        </div>
      )}

      {/* Corner Item Code & Color Swatch */}
      {!isCompact && (
        <>
          <span className="absolute top-2.5 right-2.5 bg-white/90 text-stone-800 border border-stone-300/80 px-2 py-0.5 rounded-xs text-[10px] font-mono font-semibold shadow-2xs">
            {product.code}
          </span>
          <span className="absolute bottom-2.5 left-3 bg-white/90 text-stone-800 border border-stone-300/80 px-2 py-0.5 rounded-xs text-[10px] font-medium flex items-center gap-1.5 shadow-2xs">
            <span
              className="w-2.5 h-2.5 rounded-full border border-stone-400"
              style={{ backgroundColor: product.colorHex }}
            />
            {product.color}
          </span>
        </>
      )}
    </div>
  );
};
