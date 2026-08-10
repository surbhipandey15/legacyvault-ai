import React from 'react';

interface LegacyVaultLogoProps {
  className?: string;
  symbolOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'evergreen';
}

export const LegacyVaultLogo: React.FC<LegacyVaultLogoProps> = ({
  className = '',
  symbolOnly = false,
  size = 'md',
  variant = 'evergreen'
}) => {
  const symbolSizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSizeClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  const iconBg =
    variant === 'dark'
      ? 'bg-[#174C45] text-[#FAF8F5]'
      : variant === 'light'
      ? 'bg-white text-[#174C45] border border-[#DDE1DD]'
      : 'bg-[#174C45] text-white';

  const textColor = variant === 'light' ? 'text-white' : 'text-[#171C1A]';

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Geometric L + V + folded paper / record icon */}
      <div className={`${symbolSizeClass} ${iconBg} rounded-[6px] flex items-center justify-center shrink-0 shadow-2xs`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          {/* L + V folded document continuity glyph */}
          <path d="M4 4v16h10" />
          <path d="M10 8l4 8 6-12" />
        </svg>
      </div>

      {!symbolOnly && (
        <div className="flex flex-col">
          <span className={`font-sans font-extrabold tracking-tight leading-none ${textSizeClass} ${textColor}`}>
            LEGACY<span className="text-[#4F7C72]">VAULT</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#6B726E] uppercase mt-0.5">
            PERSONAL RECORD OS
          </span>
        </div>
      )}
    </div>
  );
};
