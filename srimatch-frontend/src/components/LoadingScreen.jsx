import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-rose-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Loading SriMatch...</h2>
        <p className="text-gray-500 mt-2">Finding your perfect match</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
