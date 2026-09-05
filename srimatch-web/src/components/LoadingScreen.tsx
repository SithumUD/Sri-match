import React from 'react';
import { Loader2, Heart } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdf8f4]">
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="absolute -inset-4 animate-[ping_3s_infinite] rounded-full border-2 border-[#c9856a]/20" />
        <div className="absolute -inset-8 animate-[ping_4s_infinite] rounded-full border-2 border-[#8b4e2e]/10" />
        
        {/* Main Spinner */}
        <div className="relative mb-6 h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-b-2 border-[#8b4e2e]" />
          <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite] rounded-full border-r-2 border-l-2 border-[#c9856a]" />
          <Heart className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-[#8b4e2e]" />
        </div>

        {/* Text with Shimmer Effect */}
        <div className="text-center">
          <h2 className="bg-gradient-to-r from-[#3d1f12] via-[#8b4e2e] to-[#c9856a] bg-clip-text font-serif text-2xl font-bold text-transparent">
            SriMatch
          </h2>
          <p className="mt-2 text-sm font-medium tracking-wide text-[#9a7060]/80">
            Designing your future story...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
