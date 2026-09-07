import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import ProfileService from '../services/profile.service';
import useAuthStore from '../store/useAuthStore';

export const useProfiles = (filters: any = {}, sortOrder = '', partnerPreferences: any = {}) => {
  const { isAuthenticated } = useAuthStore();
  const pref = partnerPreferences || {};

  // Resolve age range from preferences (supports both array and scalar formats)
  const prefAgeRange    = Array.isArray(pref.ageRange) ? pref.ageRange : [];
  const prefMinAge      = prefAgeRange[0]  != null ? Number(prefAgeRange[0])  : (pref.minAge    != null ? Number(pref.minAge)    : undefined);
  const prefMaxAge      = prefAgeRange[1]  != null ? Number(prefAgeRange[1])  : (pref.maxAge    != null ? Number(pref.maxAge)    : undefined);

  // Resolve height range from preferences
  const prefHeightRange = Array.isArray(pref.heightPreference) ? pref.heightPreference : [];
  const prefMinHeight   = prefHeightRange[0] != null ? Number(prefHeightRange[0]) : (pref.minHeight != null ? Number(pref.minHeight) : undefined);
  const prefMaxHeight   = prefHeightRange[1] != null ? Number(prefHeightRange[1]) : (pref.maxHeight != null ? Number(pref.maxHeight) : undefined);

  // Helper: use explicit filter if set, otherwise fall back to preference
  const resolve = (filterVal: any, prefVal: any) =>
    (filterVal !== undefined && filterVal !== null && filterVal !== '') ? filterVal : prefVal;

  return useInfiniteQuery({
    queryKey: ['profiles', 'discover', filters, sortOrder, partnerPreferences],
    queryFn: async ({ pageParam = 0 }) => {
      // Build merged filters: explicit filter wins, preference is fallback
      const mergedFilters: any = {
        ...filters,
        gender:        resolve(filters.gender,        pref.preferredGender || pref.gender),
        religion:      resolve(filters.religion,      pref.religionPreference || pref.religion),
        maritalStatus: resolve(filters.maritalStatus, pref.maritalStatusPreference || pref.maritalStatus),
        city:          resolve(filters.city,          pref.locationPreference || pref.location),
        educationLevel: resolve(filters.educationLevel, pref.educationLevel || pref.education),
        minAge:        filters.minAge  != null ? filters.minAge  : prefMinAge,
        maxAge:        filters.maxAge  != null ? filters.maxAge  : prefMaxAge,
        minHeight:     filters.minHeight != null ? filters.minHeight : prefMinHeight,
        maxHeight:     filters.maxHeight != null ? filters.maxHeight : prefMaxHeight,
      };

      const cleanedFilters = Object.fromEntries(
        Object.entries(mergedFilters).filter(([_, v]) => v !== '' && v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0))
      );

      const params: any = {
        page: pageParam,
        size: 15,
        ...cleanedFilters,
      };

      if (sortOrder) {
        params.sort = sortOrder;
      }

      const res: any = await ProfileService.getDiscoverProfiles(params);
      const data = res?.data || res || {};
      const items = data.content || data.items || [];
      const isLast = data.last ?? (items.length < 15);

      return {
        items,
        nextPage: isLast ? undefined : Number(pageParam) + 1,
        totalElements: data.totalElements || items.length,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 3,
  });
};

export const usePublicProfile = (profileId: string | number) => {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      const res: any = await ProfileService.getPublicProfile(profileId);
      return res?.data || res;
    },
    enabled: !!profileId,
  });
};
