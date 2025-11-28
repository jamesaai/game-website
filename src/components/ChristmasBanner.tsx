import { useState } from 'react';

export const ChristmasBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-red-600 via-green-600 to-red-600 text-white py-3 px-4 text-center shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      <div className="relative flex items-center justify-center gap-2 text-sm font-semibold">
        <span className="text-2xl">🎄</span>
        <span>🎅 Holiday Season Special - Join Atlanta High for Christmas Events! 🎁</span>
        <span className="text-2xl">🎄</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
