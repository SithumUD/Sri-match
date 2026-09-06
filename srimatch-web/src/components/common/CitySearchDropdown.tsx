"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, ChevronDown, Check } from "lucide-react";
import LocationService from "../../services/location.service";

// Fallback list of major Sri Lankan cities/districts in case backend is loading or unavailable
const FALLBACK_CITIES = [
  "Colombo", "Kandy", "Galle", "Gampaha", "Negombo", "Kurunegala", "Matara",
  "Jaffna", "Anuradhapura", "Ratnapura", "Batticaloa", "Badulla", "Kalutara",
  "Nuwara Eliya", "Trincomalee", "Hambantota", "Puttalam", "Ampara", "Kegalle",
  "Matale", "Polonnaruwa", "Vavuniya", "Mannar", "Kilinochchi", "Mullaitivu",
  "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte", "Maharagama",
  "Kaduwela", "Kesbewa", "Horana", "Panadura", "Beruwala", "Kalmunai", "Chilaw",
  "Wattala", "Ja-Ela", "Katunayake", "Homagama", "Piliyandala", "Nugegoda",
  "Battaramulla", "Malabe", "Athurugiriya", "Avissawella", "Gampola", "Nawalapitiya"
];

interface CityOption {
  name: string;
  latitude?: number;
  longitude?: number;
}

interface CitySearchDropdownProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  includeAnyOption?: boolean;
}

const CitySearchDropdown: React.FC<CitySearchDropdownProps> = ({
  value,
  onChange,
  placeholder = "Search and select city / town...",
  label,
  required = false,
  hint,
  className = "",
  includeAnyOption = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<string[]>(FALLBACK_CITIES);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        setLoading(true);
        const res = await LocationService.getCities();
        const cityList: CityOption[] = res?.data || res || [];
        if (isMounted && Array.isArray(cityList) && cityList.length > 0) {
          const names = Array.from(
            new Set([
              ...cityList.map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean),
              ...FALLBACK_CITIES,
            ])
          ).sort((a, b) => a.localeCompare(b));
          setCities(names);
        }
      } catch (err) {
        console.warn("Could not load cities from backend, using fallback list:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (selectedCity: string) => {
    onChange(selectedCity);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[0.78rem] font-medium text-[#4a3028] mb-1.5 tracking-wide">
          {label} {required && <span className="text-[#d9644a]">*</span>}
          {hint && <span className="text-[#b09080] font-light text-[0.71rem] ml-1.5">{hint}</span>}
        </label>
      )}

      {/* Trigger Button / Input Display */}
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-[#fdf8f5] border rounded-[10px] cursor-pointer transition-all duration-200 ${
          isOpen
            ? "border-[#c9856a] shadow-[0_0_0_3px_rgba(201,133,106,0.14)] bg-white"
            : "border-[#e8ddd8] hover:border-[#c9856a]"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin size={15} className={value ? "text-[#8b4e2e]" : "text-[#b09080]"} />
          <span className={`text-[0.87rem] truncate ${value ? "text-[#2d1810] font-medium" : "text-[#9a7060]"}`}>
            {value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-[#f0ddd5] rounded-full text-[#9a7060] transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={15}
            className={`text-[#c9856a] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-white border border-[#f0ddd5] rounded-xl shadow-[0_12px_32px_rgba(139,78,46,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="p-2 border-b border-[#f5ede8] bg-[#fdf8f5] flex items-center gap-2">
            <Search size={14} className="text-[#8b4e2e] ml-1 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to filter cities..."
              className="w-full bg-transparent text-[0.84rem] text-[#2d1810] placeholder-[#b09080] outline-none border-none py-1"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#9a7060] hover:text-[#2d1810] p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* List Options */}
          <div className="max-h-[220px] overflow-y-auto divide-y divide-[#fcf7f4]">
            {includeAnyOption && !searchQuery && (
              <button
                type="button"
                onClick={() => handleSelect("Any / Open to all locations")}
                className={`w-full text-left px-3.5 py-2.5 text-[0.84rem] flex items-center justify-between transition-colors ${
                  value === "Any / Open to all locations"
                    ? "bg-[#fdf0e8] text-[#8b4e2e] font-semibold"
                    : "text-[#4a3028] hover:bg-[#fcf5f0]"
                }`}
              >
                <span>🌍 Any / Open to all locations</span>
                {value === "Any / Open to all locations" && <Check size={14} className="text-[#8b4e2e]" />}
              </button>
            )}

            {filteredCities.length > 0 ? (
              filteredCities.map((cityName) => {
                const isSelected = value === cityName;
                return (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => handleSelect(cityName)}
                    className={`w-full text-left px-3.5 py-2 text-[0.84rem] flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#fdf0e8] text-[#8b4e2e] font-semibold"
                        : "text-[#4a3028] hover:bg-[#fcf5f0]"
                    }`}
                  >
                    <span>{cityName}</span>
                    {isSelected && <Check size={14} className="text-[#8b4e2e]" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-[0.8rem] text-[#9a7060]">
                {searchQuery ? (
                  <div>
                    <p className="mb-2">No predefined city matching "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={() => handleSelect(searchQuery.trim())}
                      className="px-3 py-1 bg-[#8b4e2e] text-white text-[0.78rem] rounded-md hover:bg-[#6f3d23] transition-colors"
                    >
                      Use "{searchQuery.trim()}"
                    </button>
                  </div>
                ) : (
                  "No cities found"
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySearchDropdown;
