import React from 'react';

export const BankLogoSvg: React.FC<{ bankId: string; className?: string }> = ({ bankId, className = "w-4 h-4" }) => {
  const id = bankId.toLowerCase();

  if (id.includes('hnb')) {
    // HNB Logo: Dark Navy & Amber double diamond/polygon
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#0A2540" />
        <path d="M7 8H12V24H7V8Z" fill="#F59E0B" />
        <path d="M20 8H25V24H20V8Z" fill="#F59E0B" />
        <path d="M12 14H20V18H12V14Z" fill="#F59E0B" />
      </svg>
    );
  }

  if (id.includes('combank') || id.includes('commercial')) {
    // Commercial Bank Logo: Navy Blue square with red curve
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#002D62" />
        <circle cx="16" cy="16" r="10" stroke="#E11D48" strokeWidth="3" fill="none" />
        <path d="M12 16C12 13.7909 13.7909 12 16 12C18.2091 12 20 13.7909 20 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (id.includes('peoples')) {
    // People's Bank Logo: Crimson Red square with gold emblem
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#8B0000" />
        <path d="M16 6L23 13L16 26L9 13L16 6Z" fill="#F59E0B" />
        <circle cx="16" cy="15" r="3" fill="#8B0000" />
      </svg>
    );
  }

  if (id.includes('cbsl')) {
    // Central Bank of Sri Lanka Logo: Gold circular emblem
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#1E293B" />
        <circle cx="16" cy="16" r="11" fill="#D97706" />
        <circle cx="16" cy="16" r="8" fill="#F59E0B" />
        <path d="M16 10V22M10 16H22" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id.includes('seylan')) {
    // Seylan Bank Logo: Red square with Seylan lion gold motif
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#DC2626" />
        <path d="M9 10C9 10 13 8 16 11C19 14 23 12 23 12V22H9V10Z" fill="#FBBF24" />
      </svg>
    );
  }

  if (id.includes('sampath')) {
    // Sampath Bank Logo: Deep Orange square with flame emblem
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#EA580C" />
        <path d="M16 6C16 6 22 12 22 17C22 20.3137 19.3137 23 16 23C12.6863 23 10 20.3137 10 17C10 12 16 6 16 6Z" fill="#FFFFFF" />
        <path d="M16 13C16 13 19 16 19 18C19 19.6569 17.6569 21 16 21C14.3431 21 13 19.6569 13 18C13 16 16 13 16 13Z" fill="#EA580C" />
      </svg>
    );
  }

  if (id.includes('ntb')) {
    // Nations Trust Bank Logo: Dark Teal & Navy square
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#0D9488" />
        <path d="M8 8H24V14H18V24H14V14H8V8Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // Fallback logo
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#334155" />
      <text x="16" y="20" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">
        {bankId.substring(0, 2).toUpperCase()}
      </text>
    </svg>
  );
};
