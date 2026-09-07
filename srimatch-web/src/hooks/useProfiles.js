import { useInfiniteQuery } from '@tanstack/react-query';
import ProfileService from '../services/profile.service';

/**
 * Cursor-based (keyset) infinite query for profile discovery.
 *
 * Ranking applied by backend (in order of priority):
 *   1. Selected sort field (Newest / Age / Height) — when user chooses a sort
 *   2. Active boost (is_boosted=true AND not expired) — always a secondary factor
 *   3. Completion score (DESC) — higher completeness profiles rank higher
 *   4. Profile ID (DESC) — stable tiebreaker preventing cursor instability
 *
 * Pagination: TRUE keyset cursor (no OFFSET). The server returns a nextCursor token
 * that encodes the exact rank position of the last item seen, so subsequent pages
 * start from a precise index rather than skipping rows.
 *
 * Filter-to-backend-DTO mapping:
 *   Frontend key         → Backend DTO field
 *   ageFrom              → minAge
 *   ageTo                → maxAge
 *   heightFrom           → minHeight
 *   heightTo             → maxHeight
 *   education            → educationLevel  (enum, uppercased)
 *   smoking              → smokingHabits   (enum, uppercased)
 *   drinking             → drinkingHabits  (enum, uppercased)
 *   dietaryPreferences   → dietaryPreference (enum, uppercased)
 *   income               → incomeRange
 *   verified             → verifiedOnly
 *   sortOrder (empty)    → null (triggers dynamic discovery mode)
 */
export const useProfiles = (filters, sortOrder, partnerPreferences = {}) => {
  return useInfiniteQuery({
    queryKey: ['profiles', filters, sortOrder, partnerPreferences],
    queryFn: async ({ pageParam = null }) => {
      const pref = partnerPreferences || {};
      const mapEnum = (val) => (val && val !== '' ? val.toUpperCase().replace(/\s+/g, '_') : null);

      // Explicit filter wins over preference; fall back only when filter is absent/default.
      // Each pairing handles the key-name mismatch between the filter state and JSONB keys.
      const resolve = (filterVal, prefVal) =>
        (filterVal !== undefined && filterVal !== null && filterVal !== '') ? filterVal : prefVal;

      // Age range: preferences use ageRange array OR minAge/maxAge scalars
      const prefAgeRange  = Array.isArray(pref.ageRange) ? pref.ageRange : [];
      const prefMinAge    = prefAgeRange[0] != null ? Number(prefAgeRange[0]) : (pref.minAge    != null ? Number(pref.minAge)    : null);
      const prefMaxAge    = prefAgeRange[1] != null ? Number(prefAgeRange[1]) : (pref.maxAge    != null ? Number(pref.maxAge)    : null);

      // Height range: preferences use heightPreference array OR minHeight/maxHeight scalars
      const prefHeightRange = Array.isArray(pref.heightPreference) ? pref.heightPreference : [];
      const prefMinHeight   = prefHeightRange[0] != null ? Number(prefHeightRange[0]) : (pref.minHeight != null ? Number(pref.minHeight) : null);
      const prefMaxHeight   = prefHeightRange[1] != null ? Number(prefHeightRange[1]) : (pref.maxHeight != null ? Number(pref.maxHeight) : null);

      const params = {
        // ── Filter keys mapped to backend DTO names ──────────────────────────
        // For each field: explicit filter wins; preference value is fallback.
        gender:             mapEnum(resolve(filters.gender,            pref.preferredGender || pref.gender)),
        maritalStatus:      mapEnum(resolve(filters.maritalStatus,     pref.maritalStatusPreference || pref.maritalStatus)),
        hasChildren:        filters.hasChildren === '' ? null : filters.hasChildren === 'true',
        city:               resolve(filters.city, pref.locationPreference || pref.location) || null,
        religion:           mapEnum(resolve(filters.religion,          pref.religionPreference || pref.religion)),
        ethnicity:          mapEnum(filters.ethnicity),
        verifiedOnly:       filters.verified === true ? true : null,

        // Age range: filter slider at default = no explicit filter, fall back to preference
        minAge:             filters.ageFrom !== 18 ? filters.ageFrom : prefMinAge,
        maxAge:             filters.ageTo   !== 60 ? filters.ageTo   : prefMaxAge,

        // Premium filters (backend checks isPremium server-side)
        educationLevel:     mapEnum(resolve(filters.education,         pref.educationLevel || pref.education)),
        smokingHabits:      mapEnum(filters.smoking),
        drinkingHabits:     mapEnum(filters.drinking),
        dietaryPreference:  mapEnum(filters.dietaryPreferences),
        incomeRange:        filters.income || null,
        bodyType:           mapEnum(filters.bodyType),
        horoscopeSign:      mapEnum(filters.horoscopeSign),

        // Height range: filter slider at default = no explicit filter, fall back to preference
        minHeight:          filters.heightFrom !== 140 ? filters.heightFrom : prefMinHeight,
        maxHeight:          filters.heightTo   !== 220 ? filters.heightTo   : prefMaxHeight,

        // ── Sort (null = dynamic discovery mode) ─────────────────────────────
        sortBy:             sortOrder || null,

        // ── Cursor pagination ─────────────────────────────────────────────────
        cursor:             pageParam,
        limit:              12,
      };

      // Remove null/undefined keys before sending to avoid backend enum parse errors
      Object.keys(params).forEach((k) => {
        if (params[k] === null || params[k] === undefined) {
          delete params[k];
        }
      });

      const res = await ProfileService.searchProfilesCursor(params);
      return res.data; // CursorPageResponse: { items, nextCursor, hasMore, count }
    },
    // Backend returns { hasMore, nextCursor } — pass nextCursor as next pageParam
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.nextCursor) return undefined;
      return lastPage.nextCursor;
    },
    initialPageParam: null,

    // ── Cache freshness settings ────────────────────────────────────────────
    // staleTime: 30 s — data is considered fresh for 30 seconds after it is fetched.
    //
    //  • SPA navigate-away-and-back within 30 s: served instantly from cache, zero
    //    network requests. Optimistic updates from useToggleLike are preserved.
    //  • SPA navigate-away-and-back after 30 s: cached data renders immediately
    //    (no loading flicker), then a background refetch corrects any drift silently.
    //    This is React Query's "stale-while-revalidate" pattern.
    //  • 30 s is deliberately short: matrimonial platforms commonly see family
    //    members sharing one account across devices. A 30 s convergence window
    //    ensures state from another device is reflected quickly without hammering
    //    the API on every micro-navigation.
    //
    // gcTime: default (5 min) — cache is garbage-collected 5 min after the last
    // consumer unmounts. Not extended — we don't want a user returning after a long
    // break to see data that silently won't revalidate.
    staleTime: 30_000,
    refetchOnMount: true,       // background refetch on mount when data is stale
    refetchOnWindowFocus: true, // background refetch when tab regains focus
  });
};
