import React from 'react';

const UserRowSkeleton = () => {
  return (
    <tr className="animate-pulse border-b border-[#f5ede8]">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#f0ddd5]" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#f0ddd5]" />
            <div className="h-3 w-32 rounded bg-[#f5ede8]" />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 w-16 rounded bg-[#f0ddd5]" />
      </td>
      <td className="p-4">
        <div className="h-4 w-20 rounded bg-[#f0ddd5]" />
      </td>
      <td className="p-4">
        <div className="h-6 w-20 rounded-full bg-[#f5ede8]" />
      </td>
      <td className="p-4">
        <div className="h-4 w-24 rounded bg-[#f5ede8]" />
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#f5ede8]" />
          <div className="h-8 w-8 rounded-lg bg-[#f5ede8]" />
        </div>
      </td>
    </tr>
  );
};

export default UserRowSkeleton;
