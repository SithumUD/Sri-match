"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useToggleLike, useLikeQuota } from "../hooks/useLikes";
import { useSubscription } from "../hooks/useSubscription";
import { useProfiles } from "../hooks/useProfiles";
import { Loader2, Search as SearchIcon } from "lucide-react";


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
  districts: ["Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Moneragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"],
  interests: ["Music", "Travel", "Photography", "Reading", "Movies", "Gaming", "Cooking", "Sports", "Yoga", "Dancing"],
  industries: ["Technology", "Healthcare", "Finance", "Education", "Engineering", "Arts", "Government", "Other"],
  incomeRanges: ["Less than 50k", "50k - 100k", "100k - 200k", "200k - 500k", "Above 500k"]
};

/**
 * Sort options — all optional, none selected by default.
 * Boost priority, Completion Score, and Dynamic Discovery apply automatically
 * when no sort is selected (handled server-side).
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
  const { data: likeQuota } = useLikeQuota();
  const { data: subscription = {} } = useSubscription();

  const [showAdvanced, setShowAdvanced] = useState(false);
  // Sort is optional — empty string means "no sort selected" (dynamic discovery mode)
  const [sortOrder, setSortOrder] = useState("");

  const [filters, setFilters] = useState({
    ageFrom: 18, ageTo: 60, gender: "", maritalStatus: "", hasChildren: "",
    city: "", ethnicity: "", religion: "", education: "",
    profession: "", industry: "", income: "", heightFrom: 140, heightTo: 220,
    bodyType: "", smoking: "", drinking: "", dietaryPreferences: "",
    verified: false, interests: [],
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

  const totalCount = data?.pages[0]?.count || 0;
  const isPremium = likeQuota?.isPremium ?? (subscription?.plan === "premium" || currentUser?.premium);
  const likesRemaining = likeQuota ? likeQuota.likesRemaining : (subscription?.remainingLikes ?? 15);
  const likeLimit = likeQuota?.likeLimit ?? 15;

  // Infinite Scroll Observer
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleRange = useCallback((name, val, isMax) => {
    setFilters(p => ({ ...p, [isMax ? `${name}To` : `${name}From`]: val }));
  }, []);

  const toggleInterest = useCallback((interest) => {
    setFilters(p => {
      const cur = p.interests || [];
      return { ...p, interests: cur.includes(interest) ? cur.filter(i => i !== interest) : [...cur, interest] };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      ageFrom: 18, ageTo: 60, gender: "", maritalStatus: "", hasChildren: "",
      city: "", ethnicity: "", religion: "", education: "",
      profession: "", industry: "", income: "", heightFrom: 140, heightTo: 220,
      bodyType: "", smoking: "", drinking: "", dietaryPreferences: "",
      verified: false, interests: [],
    });
  }, []);

  // Toggle: clicking an already-active sort button deselects it (returns to dynamic discovery)
  const handleSortToggle = useCallback((key) => {
    setSortOrder(prev => prev === key ? "" : key);
  }, []);

  const toggleLike = useCallback((profileId, type = 'NORMAL') => mutateToggleLike({ profileId, type }), [mutateToggleLike]);

  return (
    <div className="min-h-screen bg-[#fdf8f4] px-4 pt-8 pb-16 font-['DM_Sans'] text-[#2d1810] sm:px-6">
      

      <div className="mx-auto mt-4 grid max-w-[1200px] grid-cols-1 items-start gap-7 lg:grid-cols-[272px_1fr]">
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
          likeLimit={likeLimit}
          options={PROFILE_OPTIONS}
        />

        <main>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.85rem] text-[#9a7060]">
                {sortOrder === "" ? (
                  <span className="italic text-[#c9856a]">Dynamic discovery</span>
                ) : (
                  <span><strong className="text-[#2d1810]">Sorted by</strong> {SORT_OPTIONS.find(s => s.key === sortOrder)?.label}</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.key}
                  id={`sort-${s.key}`}
                  className={`flex items-center gap-1 rounded-full border-[1.5px] px-3 py-1.5 font-['DM_Sans'] text-[0.74rem] font-medium transition-all duration-200 ${
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

          {status === 'loading' ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => <ProfileCardSkeleton key={i} />)}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile, index) => {
                // Interaction state comes solely from the embedded `interactionType`
                // field returned by the cursor endpoint — no secondary /likes/sent
                // fetch needed. Optimistic updates in useToggleLike keep this
                // in sync without any extra network call.
                const isLiked       = profile.interactionType === 'NORMAL';
                const isStarred     = profile.interactionType === 'STAR';
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
            <div className="rounded-[20px] bg-white px-8 py-16 text-center shadow-[0_8px_28px_rgba(120,60,30,0.06)]">
              <div className="mx-auto mb-4 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-[#fdf0e8] to-[#f5ddd0]">
                <SearchIcon size={28} className="text-[#c9856a]" />
              </div>
              <h3 className="mb-1.5 font-['Cormorant_Garamond'] text-[1.5rem] font-semibold text-[#2d1810]">No matches found</h3>
              <p className="text-[0.85rem] text-[#9a7060]">Try adjusting your filters to discover more profiles.</p>
            </div>
          )}

          {isFetchingNextPage && (
            <div className="py-8 text-center text-[#8b4e2e]">
              <Loader2 className="mx-auto animate-spin" size={32} />
            </div>
          )}

          {!hasNextPage && profiles.length > 0 && (
            <div className="py-8 text-center text-[0.85rem] text-[#9a7060]">
              You've reached the end of the matches ✦
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;