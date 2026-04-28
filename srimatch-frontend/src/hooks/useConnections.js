import { useQuery } from '@tanstack/react-query';
import MatchService from '../services/match.service';
import { useAuth } from '../context/AuthContext';

export const useConnections = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['connections'],
    queryFn: async () => {
      const res = await MatchService.getMyMatches(0, 100);
      if (res.success) {
        return res.data.content || res.data || [];
      }
      return [];
    },
    enabled: !!isAuthenticated,
  });
};
