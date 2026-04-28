import React from 'react';
import { Search } from 'lucide-react';

const SearchHeader = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="mx-auto mb-8 max-w-[1200px]">
      <div className="mb-8">
        <h1 className="font-['Cormorant_Garamond'] text-[2.2rem] font-semibold leading-[1.1] text-[#2d1810]">
          Find Your <span className="bg-gradient-to-br from-[#8b4e2e] to-[#c9856a] bg-clip-text text-transparent">Forever</span>
        </h1>
        <p className="mt-1 text-[0.85rem] text-[#9a7060]">Discover compatible matches across Sri Lanka</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-[1.1rem] -translate-y-1/2 text-[#c4a99a]" size={17} />
        <input
          type="text"
          className="w-full rounded-[14px] border-[1.5px] border-[#e8ddd8] bg-white py-[0.85rem] pr-[1.25rem] pl-12 font-['DM_Sans'] text-[0.9rem] text-[#2d1810] shadow-[0_4px_16px_rgba(120,60,30,0.06)] outline-none transition-all duration-200 focus:border-[#c9856a] focus:shadow-[0_0_0_3px_rgba(201,133,106,0.1)] placeholder:text-[#c4b0a5]"
          placeholder="Search by name, profession, city…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
};

export default React.memo(SearchHeader);
