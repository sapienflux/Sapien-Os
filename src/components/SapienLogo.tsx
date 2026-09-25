import React from 'react';

interface SapienLogoProps {
  variant?: 'full' | 'compact' | 'mark' | 'white-text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SapienLogo: React.FC<SapienLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const markDimensions = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 68,
  }[size];

  const MarkSVG = (
    <svg
      width={markDimensions}
      height={markDimensions}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
    >
      <defs>
        <linearGradient id="goldGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#DFB142" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#9C7715" />
        </linearGradient>
        <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B3252" />
          <stop offset="60%" stopColor="#0B1B2B" />
          <stop offset="100%" stopColor="#06101B" />
        </linearGradient>
      </defs>

      {/* Human Silhouette Face Profile (Navy) intertwined with 'S' */}
      <path
        d="M 52 8 C 42 12, 33 22, 31 35 C 30 38, 28 41, 25 42 C 23 43, 24 45, 27 46 C 28 47, 28 49, 26 51 C 25 53, 27 55, 30 55 C 30 58, 31 62, 34 66 C 38 72, 45 82, 54 90 C 44 82, 37 72, 34 62 C 30 54, 29 45, 35 34 C 40 23, 47 14, 52 8 Z"
        fill="url(#navyGrad)"
      />

      {/* Dynamic S Ribbon Curve (Warm Gold) */}
      <path
        d="M 54 8 C 65 14, 76 27, 72 40 C 69 51, 58 57, 52 64 C 46 71, 48 78, 54 84 C 59 88, 67 89, 74 88 C 65 91, 53 90, 46 84 C 40 78, 39 69, 45 61 C 52 53, 63 48, 66 38 C 68 28, 60 17, 54 8 Z"
        fill="url(#goldGrad)"
      />

      {/* Lower Ribbon Accent Wing */}
      <path
        d="M 53 66 C 60 72, 70 76, 80 77 C 69 82, 57 80, 50 72 Z"
        fill="url(#goldGrad)"
        opacity="0.9"
      />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{MarkSVG}</div>;
  }

  const isLightText = variant === 'white-text';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {MarkSVG}
      {variant !== 'compact' ? (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-[0.18em] text-lg sm:text-xl font-sans ${
                isLightText ? 'text-white' : 'text-[#0B1B2B]'
              }`}
            >
              SAPIEN
            </span>
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C59B27] uppercase">
              ERP
            </span>
          </div>
          <span
            className={`text-[8px] tracking-[0.28em] font-semibold uppercase mt-0.5 ${
              isLightText ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            ACADEMY · FUTURE SKILLS
          </span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black tracking-wider text-base ${
              isLightText ? 'text-white' : 'text-[#0B1B2B]'
            }`}
          >
            SAPIEN
          </span>
          <span className="text-[9px] font-bold tracking-widest text-[#C59B27]">ERP</span>
        </div>
      )}
    </div>
  );
};
