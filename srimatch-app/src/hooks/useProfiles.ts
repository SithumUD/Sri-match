import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import ProfileService from '../services/profile.service';
import useAuthStore from '../store/useAuthStore';

export const useProfiles = (filters: any = {}, sortOrder = '') => {
  const { isAuthenticated } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ['profiles', 'discover', filters, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0))
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
