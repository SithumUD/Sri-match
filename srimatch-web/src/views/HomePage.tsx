"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useToggleLike } from "../hooks/useLikes";
import { useSubscription } from "../hooks/useSubscription";
import { useProfiles } from "../hooks/useProfiles";
import { Loader2, Search as SearchIcon, Filter as FilterIcon, X, SlidersHorizontal } from "lucide-react";

// Modular Components
import FilterSidebar from "../components/home/FilterSidebar";
import ProfileCard from "../components/home/ProfileCard";
import ProfileCardSkeleton from "../components/skeletons/ProfileCardSkeleton";

/* ─── Options Data ──────────────────────────────────────────────────────── */
const PROFILE_OPTIONS = {
  maritalStatus: ["Never Married", "Divorced", "Widowed", "Separated", "Annulled"],
  religion: ["Buddhist", "Hindu", "Muslim", "Christian", "Catholic", "No Religion", "Other"],
  ethnicity: ["Sinhalese", "Tamil", "Moor", "Burgher", "Malay", "Other"],
  education: ["High School", "Diploma", "Bachelors", "Masters", "Doctorate", "Professional Certification", "Other"],
  bodyType: ["Slim", "Athletic", "Average", "Overweight", "Plus Size", "Muscular"],
  complexion: ["Fair", "Wheatish", "Medium", "Dusky", "Dark"],
  smoking: ["Never", "Occasionally", "Regularly", "Trying to Quit"],
  drinking: ["Never", "Socially", "Occasionally", "Regularly"],
  dietary: ["Vegetarian", "Vegan", "Non Vegetarian", "Pescatarian", "No Preference"],
  horoscope: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  districts: ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"],
  interests: ["Music", "Travel", "Photography", "Reading", "Movies", "Gaming", "Cooking", "Sports", "Yoga", "Dancing"],
  industries: ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts", "Government", "Other"],
  incomeRanges: ["Less than 50k", "50k - 100k", "100k - 200k", "200k - 500k", "Above 500k"]
};

/**
 * Sort options — all optional, none selected by default.
 */
const SORT_OPTIONS = [
  { key: "newest",      label: "Newest"   },
  { key: "age_asc",     label: "Age ↑"    },
  { key: "age_desc",    label: "Age ↓"    },
  { key: "height_asc",  label: "Height ↑" },
  { key: "height_desc", label: "Height ↓" },
];

const HomePage = () => {
  const { user: currentUser } = useAuth();
  const { mutate: mutateToggleLike } = useToggleLike();
  const { data: subscription = {} } = useSubscription();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");

  const [filters, setFilters] = useState({
    ageFrom: 18, ageTo: 60, gender: "", maritalStatus: "", hasChildren: "",
    city: "", ethnicity: "", religion: "", education: "",
    profession: "", industry: "", income: "", heightFrom: 140, heightTo: 220,
    bodyType: "", smoking: "", drinking: "", dietaryPreferences: "",
    verified: false, horoscopeSign: "", interests: [],
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading
  } = useProfiles(filters, sortOrder);

  // Cursor response uses `items` instead of `content`
  const profiles = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data]);

  const isPremium = subscription?.plan === "premium" || currentUser?.premium;
  const likesRemaining = subscription?.remainingLikes ?? 5;

  // Active filters count for badge indicator
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.maritalStatus) count++;
    if (filters.hasChildren) count++;
    if (filters.city) count++;
    if (filters.religion) count++;
    if (filters.ethnicity) count++;
    if (filters.education) count++;
    if (filters.profession) count++;
    if (filters.industry) count++;
    if (filters.income) count++;
    if (filters.verified) count++;
    if (filters.bodyType) count++;
    if (filters.smoking) count++;
    if (filters.drinking) count++;
    if (filters.dietaryPreferences) count++;
    if (filters.horoscopeSign) count++;
    if (filters.interests && filters.interests.length > 0) count += filters.interests.length;
    if (filters.ageFrom > 18 || filters.ageTo < 60) count++;
    if (filters.heightFrom > 140 || filters.heightTo < 220) count++;
    return count;
  }, [filters]);

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback((e: any) => {
    const { name, value, type, checked } = e.target;
    setFilters(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleRange = useCallback((name: string, val: number, isMax: boolean) => {
    setFilters(p => ({ ...p, [isMax ? `${name}To` : `${name}From`]: val }));
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setFilters(p => {
      const cur: string[] = (p.interests as string[]) || [];
      return { ...p, interests: cur.includes(interest) ? cur.filter(i => i !== interest) : [...cur, interest] };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ageFrom: 18, ageTo: 60, gender: "", maritalStatus: "", hasChildren: "",
      city: "", ethnicity: "", religion: "", education: "",
      profession: "", industry: "", income: "", heightFrom: 140, heightTo: 220,
      bodyType: "", smoking: "", drinking: "", dietaryPreferences: "",
      verified: false, horoscopeSign: "", interests: [],
    });
  }, []);

  const handleSortToggle = useCallback((key: string) => {
    setSortOrder(prev => prev === key ? "" : key);
  }, []);

  const toggleLike = useCallback((profileId: string | number, type: 'NORMAL' | 'STAR' = 'NORMAL') => {
    mutateToggleLike({ profileId, type });
  }, [mutateToggleLike]);

  return (
    <div className="min-h-screen bg-[#fdf8f4] px-3 pt-4 pb-20 font-['DM_Sans'] text-[#2d1810] sm:px-6 sm:pt-6">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-6 lg:grid-cols-[272px_1fr]">
        
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onRangeChange={handleRange}
            onToggleInterest={toggleInterest}
            onReset={resetFilters}
            isPremium={isPremium}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            likesRemaining={likesRemaining}
            options={PROFILE_OPTIONS}
          />
        </div>

        {/* Mobile Filter Drawer / Bottom Sheet Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMobileFilterOpen(false)}
            />
            {/* Drawer Sheet */}
            <div className="relative z-10 w-full max-h-[88vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onRangeChange={handleRange}
                onToggleInterest={toggleInterest}
                onReset={resetFilters}
                isPremium={isPremium}
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                likesRemaining={likesRemaining}
                options={PROFILE_OPTIONS}
                onClose={() => setIsMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="w-full min-w-0">
          {/* Header Controls: Mobile Filter Button + Sort Strip */}
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="flex items-center justify-between gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex lg:hidden items-center gap-2 rounded-full border-[1.5px] border-[#8b4e2e]/30 bg-gradient-to-r from-[#fdf5ee] to-[#fff] px-3.5 py-2 text-[0.8rem] font-medium text-[#8b4e2e] shadow-sm transition-all active:scale-95"
              >
                <SlidersHorizontal size={15} className="text-[#8b4e2e]" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b4e2e] text-[0.68rem] font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <p className="text-[0.82rem] text-[#9a7060]">
                {sortOrder === "" ? (
                  <span className="italic text-[#c9856a]">Dynamic discovery</span>
                ) : (
                  <span><strong className="text-[#2d1810]">Sorted by</strong> {SORT_OPTIONS.find(s => s.key === sortOrder)?.label}</span>
                )}
              </p>
            </div>

            {/* Horizontally scrollable sort pills on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar sm:pb-0">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.key}
                  id={`sort-${s.key}`}
                  className={`flex shrink-0 items-center gap-1 rounded-full border-[1.5px] px-3 py-1.5 font-['DM_Sans'] text-[0.74rem] font-medium transition-all duration-200 ${
                    sortOrder === s.key
                      ? "border-transparent bg-gradient-to-br from-[#3d1f12] to-[#8b4e2e] text-white shadow-[0_4px_10px_rgba(139,78,46,0.22)]"
                      : "border-[#e8ddd8] bg-[#fdf8f4] text-[#6b4a3a] hover:border-[#c9856a]"
                  }`}
                  onClick={() => handleSortToggle(s.key)}
                  title={sortOrder === s.key ? `Click to deselect ${s.label} sort` : `Sort by ${s.label}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Cards Grid */}
          {status === 'loading' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => <ProfileCardSkeleton key={i} />)}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
              {profiles.map((profile: any, index: number) => {
                const isLiked = profile.interactionType === 'NORMAL';
                const isStarred = profile.interactionType === 'STAR';
                const hasInteraction = profile.interactionType != null;

                return (
                  <ProfileCard
                    key={profile.id}
                    ref={index === profiles.length - 1 ? lastElementRef : null}
                    profile={profile}
                    isLiked={isLiked}
                    isStarred={isStarred}
                    hasInteraction={hasInteraction}
                    onToggleLike={toggleLike}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[20px] bg-white px-6 py-14 text-center shadow-[0_8px_28px_rgba(120,60,30,0.06)] sm:px-8 sm:py-16">
              <div className="mx-auto mb-4 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0]">
                <SearchIcon size={26} className="text-[#c9856a]" />
              </div>
              <h3 className="mb-1.5 font-['Cormorant_Garamond'] text-[1.4rem] font-semibold text-[#2d1810] sm:text-[1.5rem]">No matches found</h3>
              <p className="text-[0.84rem] text-[#9a7060]">Try adjusting your filters to discover more profiles.</p>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#fdf0e8] px-4 py-2 text-[0.8rem] font-medium text-[#8b4e2e] hover:bg-[#fae4d4] transition-colors"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="py-8 text-center text-[#8b4e2e]">
              <Loader2 className="mx-auto animate-spin" size={30} />
            </div>
          )}

          {!hasNextPage && profiles.length > 0 && (
            <div className="py-8 text-center text-[0.82rem] text-[#9a7060]">
              You've reached the end of the matches ✦
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;