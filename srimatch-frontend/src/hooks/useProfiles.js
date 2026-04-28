import { useInfiniteQuery } from '@tanstack/react-query';
import ProfileService from '../services/profile.service';

export const useProfiles = (filters, searchTerm, sortOrder) => {
  return useInfiniteQuery({
    queryKey: ['profiles', filters, searchTerm, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const mapEnum = (val) => val ? val.toUpperCase().replace(/\s+/g, '_') : null;
      
      const searchParams = {
        ...filters,
        page: pageParam,
        size: 12,
        sortBy: sortOrder,
        query: searchTerm,
        maritalStatus: mapEnum(filters.maritalStatus),
        religion: mapEnum(filters.religion),
        ethnicity: mapEnum(filters.ethnicity),
        education: mapEnum(filters.education),
        gender: mapEnum(filters.gender),
        bodyType: mapEnum(filters.bodyType),
        smoking: mapEnum(filters.smoking),
        drinking: mapEnum(filters.drinking),
        dietaryPreferences: mapEnum(filters.dietaryPreferences),
        horoscopeSign: mapEnum(filters.horoscopeSign),
        hasChildren: filters.hasChildren === "" ? null : filters.hasChildren === "true"
      };

      const res = await ProfileService.searchProfiles(searchParams);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });
};
