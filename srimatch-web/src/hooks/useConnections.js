import { useQuery } from '@tanstack/react-query';
import ConnectionService from '../services/connection.service';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to fetch the unified connections overview.
 * Uses staleTime: 30s so navigating back and forth across the application
 * renders from cache instantly without redundant network requests.
 */
export const useConnectionsOverview = (limit = 50) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['connections', 'overview', limit],
    queryFn: async () => {
      const res = await ConnectionService.getOverview(limit);
      return res.data || {
        profileViews: 0,
        isPremium: false,
        totalLikesCount: 0,
        totalMatchesCount: 0,
        matches: [],
        receivedLikes: [],
        starLikes: []
      };
    },
    enabled: !!isAuthenticated,
    staleTime: 30_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};

export const useConnections = useConnectionsOverview;

