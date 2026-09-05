"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MapPin, X, ChevronDown, Loader2 } from "lucide-react";
import LocationService from "../../services/location.service";

interface CityItem {
  name: string;
  latitude?: number;
  longitude?: number;
}

const FALLBACK_SRI_LANKAN_CITIES: string[] = [
  "Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Sri Jayawardenepura Kotte",
  "Negombo", "Kandy", "Kalmunai", "Vavuniya", "Galle", "Trincomalee",
  "Batticaloa", "Jaffna", "Katunayake", "Dambulla", "Kolonnawa",
  "Anuradhapura", "Ratnapura", "Badulla", "Matara", "Puttalam",
  "Chavakachcheri", "Kattankudy", "Matale", "Kalutara", "Mannar",
  "Panadura", "Beruwala", "Ja-Ela", "Point Pedro", "Kelaniya",
  "Peliyagoda", "Kurunegala", "Wattala", "Gampaha", "Nuwara Eliya",
  "Valvettithurai", "Chilaw", "Eravur", "Avissawella", "Weligama",
  "Ambalangoda", "Ampara", "Kegalle", "Hatton", "Nawalapitiya",
  "Balangoda", "Hambantota", "Tangalle", "Monaragala", "Gampola",
  "Horana", "Minuwangoda", "Kuliyapitiya", "Maharagama", "Kesbewa",
  "Kaduwela", "Kotikawatta", "Seethawakapura", "Embilipitiya", "Homagama",
  "Piliyandala", "Nugegoda", "Rajagiriya", "Battaramulla", "Malabe",
  "Kottawa", "Athurugiriya", "Padukka", "Hanwella", "Kiribathgoda",
  "Kadawatha", "Ragama", "Kelaniya", "Wattala", "Kandana",
  "Mahara", "Biyagama", "Delgoda", "Divulapitiya", "Mirigama",
  "Veyangoda", "Nittambuwa", "Kirindiwela", "Dompe", "Pugoda"
];

// In-memory module-level cache for cities so API is called only once per session
let cachedCities: CityItem[] | null = null;
let pendingFetchPromise: Promise<CityItem[]> | null = null;

const fetchAllCities = async (): Promise<CityItem[]> => {
  if (cachedCities && cachedCities.length > 0) {
    return cachedCities;
  }
  if (pendingFetchPromise) {
    return pendingFetchPromise;
  }
  pendingFetchPromise = (async () => {
    try {
      const res: any = await LocationService.getCities();
      const rawData = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      const list: CityItem[] = rawData
        .map((c: any) => ({
          name: typeof c === "string" ? c : c.name || c.nameEn || "",
          latitude: c.latitude,
          longitude: c.longitude,
        }))
        .filter((c: CityItem) => Boolean(c.name));

      if (list.length > 0) {
        cachedCities = list;
        return list;
      }
    } catch (err) {
      console.error("Failed to load cities for autocomplete, using fallback list:", err);
    } finally {
      pendingFetchPromise = null;
    }

    const fallback: CityItem[] = FALLBACK_SRI_LANKAN_CITIES.map((name) => ({ name }));
    cachedCities = fallback;
    return fallback;
  })();
  return pendingFetchPromise;
};

interface CityAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: "filter" | "form" | "custom";
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value = "",
  onChange,
  placeholder = "Search city or town...",
  className = "",
  inputClassName = "",
  dropdownClassName = "",
  name,
  id,
  disabled = false,
  required = false,
  variant = "form",
}) => {
  const [cities, setCities] = useState<CityItem[]>(cachedCities || []);
  const [loading, setLoading] = useState<boolean>(!cachedCities);
  const [inputValue, setInputValue] = useState<string>(value || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Load cities once
  useEffect(() => {
    let isMounted = true;
    if (!cachedCities || cachedCities.length === 0) {
      setLoading(true);
      fetchAllCities().then((list) => {
        if (isMounted) {
          setCities(list);
          setLoading(false);
        }
      });
    } else {
      setCities(cachedCities);
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered matching cities (limit to 50 for top performance)
  const filteredCities = useMemo(() => {
    const query = (inputValue || "").trim().toLowerCase();
    if (!query) {
      return cities.slice(0, 40);
    }
    return cities
      .filter((c) => c.name.toLowerCase().includes(query))
      .slice(0, 50);
  }, [cities, inputValue]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = useCallback(
    (cityName: string) => {
      setInputValue(cityName);
      onChange(cityName);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue("");
      onChange("");
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === "Enter") {
      if (isOpen && highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        e.preventDefault();
        handleSelectCity(filteredCities[highlightedIndex].name);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll("li");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Highlight matching text in city item
  const renderCityName = (name: string, query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return name;
    const index = name.toLowerCase().indexOf(trimmedQuery.toLowerCase());
    if (index === -1) return name;

    const before = name.substring(0, index);
    const match = name.substring(index, index + trimmedQuery.length);
    const after = name.substring(index + trimmedQuery.length);

    return (
      <>
        {before}
        <span className="font-semibold text-[#8b4e2e] underline decoration-[#c9856a]/60">
          {match}
        </span>
        {after}
      </>
    );
  };

  // Variant classes
  const baseInputStyle =
    variant === "filter"
      ? "w-full rounded-lg border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] px-3 py-[0.52rem] pr-8 font-['DM_Sans'] text-[0.81rem] text-[#2d1810] outline-none transition-colors focus:border-[#c9856a]"
      : variant === "form"
      ? "w-full rounded-xl border-[1.5px] border-[#e8ddd8] bg-[#fdf8f4] px-3.5 py-2.5 pr-9 font-['DM_Sans'] text-[0.88rem] text-[#2d1810] outline-none transition-all focus:border-[#8b4e2e] focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,78,46,0.1)]"
      : "";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          className={`${baseInputStyle} ${inputClassName}`}
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {loading ? (
            <Loader2 size={14} className="animate-spin text-[#c9856a]" />
          ) : inputValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-0.5 text-[#9a7060] transition-colors hover:bg-[#e8ddd8] hover:text-[#2d1810]"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          ) : (
            <ChevronDown
              size={13}
              className={`text-[#c9856a] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#e8ddd8] bg-white p-1.5 shadow-[0_10px_30px_rgba(120,60,30,0.12)] ${dropdownClassName}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-[0.78rem] text-[#9a7060]">
              <Loader2 size={14} className="animate-spin text-[#8b4e2e]" />
              Loading cities...
            </div>
          ) : filteredCities.length > 0 ? (
            <ul ref={listRef} className="m-0 list-none p-0">
              {filteredCities.map((city, index) => {
                const isSelected =
                  value && value.toLowerCase() === city.name.toLowerCase();
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={`${city.name}-${index}`}
                    onClick={() => handleSelectCity(city.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-[0.8rem] transition-colors ${
                      isSelected
                        ? "bg-[#fdf0e8] font-semibold text-[#8b4e2e]"
                        : isHighlighted
                        ? "bg-[#fdf8f4] text-[#2d1810]"
                        : "text-[#4a3028] hover:bg-[#fdf8f4]"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin
                        size={12}
                        className={
                          isSelected ? "text-[#8b4e2e]" : "text-[#c9856a]"
                        }
                      />
                      {renderCityName(city.name, inputValue)}
                    </span>
                    {isSelected && (
                      <span className="text-[0.68rem] font-medium uppercase tracking-wider text-[#8b4e2e]">
                        Selected
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-3 text-center text-[0.78rem] text-[#9a7060]">
              No matching city found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
