import React from 'react';

interface PixelLogoProps {
  variant?: 'full' | 'horizontal' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const PixelLogo: React.FC<PixelLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  // Dimensions
  const getMarkSize = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 36 };
      case 'md': return { width: 44, height: 50 };
      case 'lg': return { width: 72, height: 82 };
      case 'xl': return { width: 120, height: 136 };
    }
  };

  const markDimensions = getMarkSize();

  // The Iconic Pencil-P & Flying Pixels Emblem SVG
  const MarkSvg = (
    <svg
      width={markDimensions.width}
      height={markDimensions.height}
      viewBox="0 0 160 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
    >
      <defs>
        {/* Top Loop Gradient: Orange -> Crimson -> Magenta */}
        <linearGradient id="pLoopGradient" x1="60" y1="20" x2="150" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>

        {/* Stem Gradient: Violet -> Cyan/Blue */}
        <linearGradient id="pStemGradient" x1="60" y1="70" x2="90" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Inner Curve Shadow */}
        <radialGradient id="pInnerGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </radialGradient>

        {/* Pencil Wood Collar */}
        <linearGradient id="pencilWood" x1="60" y1="120" x2="80" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>

      {/* Disintegrating Pixel Tiles (Flying outward to the top-left) */}
      {/* Row 1 */}
      <rect x="18" y="18" width="10" height="10" rx="1.5" fill="#f43f5e" className="animate-pulse" style={{ animationDelay: '100ms' }} />
      <rect x="34" y="24" width="12" height="12" rx="1.5" fill="#fbbf24" />
      <rect x="52" y="14" width="14" height="14" rx="2" fill="#ea580c" />
      
      {/* Row 2 */}
      <rect x="10" y="38" width="12" height="12" rx="1.5" fill="#f97316" />
      <rect x="28" y="42" width="14" height="14" rx="2" fill="#ec4899" />
      <rect x="48" y="34" width="16" height="16" rx="2" fill="#d946ef" />
      <rect x="68" y="22" width="16" height="16" rx="2.5" fill="#f59e0b" />

      {/* Row 3 */}
      <rect x="22" y="60" width="14" height="14" rx="2" fill="#a855f7" />
      <rect x="42" y="58" width="16" height="16" rx="2" fill="#ec4899" />
      <rect x="62" y="48" width="18" height="18" rx="2.5" fill="#f43f5e" />

      {/* Row 4 (Lower scatter) */}
      <rect x="14" y="80" width="10" height="10" rx="1.5" fill="#06b6d4" />
      <rect x="30" y="78" width="12" height="12" rx="1.5" fill="#8b5cf6" />
      <rect x="48" y="78" width="16" height="16" rx="2" fill="#0284c7" />

      {/* Row 5 */}
      <rect x="36" y="96" width="12" height="12" rx="1.5" fill="#0ea5e9" />
      <rect x="54" y="98" width="14" height="14" rx="2" fill="#06b6d4" />
      
      {/* Accent green pixel */}
      <rect x="88" y="76" width="14" height="14" rx="2" fill="#84cc16" />

      {/* Main 3D "P" - Pencil Body & Loop */}
      {/* Upper curved loop of the P */}
      <path
        d="M80 22 C115 22 142 42 142 68 C142 94 116 114 80 114 L80 92 C104 92 120 78 120 68 C120 56 104 44 80 44 Z"
        fill="url(#pLoopGradient)"
      />

      {/* Vertical Stem of the P (Upper portion) */}
      <path
        d="M68 56 H92 V124 C92 128 89 132 85 133 L80 135 L75 133 C71 132 68 128 68 124 Z"
        fill="url(#pStemGradient)"
      />

      {/* Pencil Sharpened Cone Tip */}
      <polygon
        points="68,124 92,124 80,158"
        fill="url(#pencilWood)"
      />

      {/* Graphite Lead Tip */}
      <polygon
        points="76,146 84,146 80,166"
        fill="#1e293b"
      />

      {/* Highlight reflection on P curve */}
      <path
        d="M82 26 C110 26 134 44 134 68"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
    </svg>
  );

  // Typography for "Pixel" (multi-color letters matching official logo)
  const PixelText = (
    <span className="font-bold tracking-tight inline-flex items-baseline select-none">
      <span className="text-[#3b82f6] text-[1.12em] font-extrabold italic" style={{ fontFamily: 'var(--font-display)' }}>P</span>
      <span className="text-[#06b6d4] font-bold" style={{ fontFamily: 'var(--font-display)' }}>i</span>
      <span className="text-[#ec4899] font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>x</span>
      <span className="text-[#f97316] font-bold" style={{ fontFamily: 'var(--font-display)' }}>e</span>
      <span className="text-[#84cc16] font-bold" style={{ fontFamily: 'var(--font-display)' }}>l</span>
    </span>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {MarkSvg}
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`group inline-flex items-center gap-3 ${className}`}>
        {MarkSvg}
        <div className="flex flex-col leading-none">
          <div className="text-xl sm:text-2xl flex items-baseline gap-1">
            {PixelText}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[1px] w-3 bg-gradient-to-r from-transparent to-slate-500/50" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-slate-300 uppercase">
              Design House
            </span>
            <span className="h-[1px] w-3 bg-gradient-to-l from-transparent to-slate-500/50" />
          </div>
        </div>
      </div>
    );
  }

  // Full Brand Lockup (Vertical Editorial Composition)
  return (
    <div className={`group flex flex-col items-center text-center ${className}`}>
      {/* Pencil-P Emblem */}
      <div className="relative mb-3 filter drop-shadow-[0_12px_24px_rgba(236,72,153,0.18)]">
        {MarkSvg}
      </div>

      {/* "Pixel" Cursive / Expressive Typography */}
      <div className="text-3xl sm:text-4xl md:text-5xl mb-1.5 drop-shadow-sm">
        {PixelText}
      </div>

      {/* "DESIGN HOUSE" Tracked Sub-heading with Colored Flanks */}
      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-[280px] justify-center my-1">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-[#0284c7] via-[#8b5cf6] to-[#ec4899] rounded-full" />
        <span className="text-xs sm:text-sm font-bold tracking-[0.28em] text-slate-100 uppercase">
          Design House
        </span>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-[#f97316] via-[#eab308] to-[#84cc16] rounded-full" />
      </div>

      {/* "Pixels with Purpose." Tagline */}
      {showTagline && (
        <div className="flex items-center justify-center gap-2 mt-2 text-xs sm:text-sm text-slate-300 italic">
          <span className="text-[#f97316] font-bold">~</span>
          <span className="tracking-wide text-slate-200 font-medium">Pixels with Purpose.</span>
          <span className="text-[#06b6d4] font-bold">~</span>
        </div>
      )}
    </div>
  );
};
