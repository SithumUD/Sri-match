import React from 'react';

const ProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_28px_rgba(120,60,30,0.07),0_2px_6px_rgba(0,0,0,0.03)] animate-pulse">
      {/* Skeleton Image */}
      <div className="h-[190px] bg-gray-200" />
      
      {/* Skeleton Body */}
      <div className="flex flex-1 flex-col p-4 sm:px-[1.2rem] sm:pt-4 sm:pb-[1.15rem]">
        <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
        <div className="mb-4 h-4 w-1/2 rounded bg-gray-100" />
        
        <div className="mb-4 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-gray-100" />
          <div className="h-6 w-24 rounded-full bg-gray-100" />
          <div className="h-6 w-16 rounded-full bg-gray-100" />
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-5/6 rounded bg-gray-100" />
        </div>
        
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
