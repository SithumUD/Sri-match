import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LikeService from '../services/like.service';
import { useAuth } from '../context/AuthContext';

export const useSentLikes = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['likes', 'sent'],
    queryFn: async () => {
      const res = await LikeService.getSentLikes(0, 100);
      if (res.success) {
        const sentData = res.data.content || res.data || [];
        return sentData.map(l => ({ 
          profileId: l.receiver?.id || l.receiverId, 
          type: l.type 
        }));
      }
      return [];
    },
    enabled: !!isAuthenticated,
  });
};

export const useReceivedLikes = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['likes', 'received'],
    queryFn: async () => {
      const res = await LikeService.getReceivedLikes(0, 100);
      if (res.success) {
        return res.data.content || res.data || [];
      }
      return [];
    },
    enabled: !!isAuthenticated,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, type = 'NORMAL' }) => {
      const targetId = Number(profileId);
      if (!targetId || isNaN(targetId)) {
        throw new Error("Invalid profile ID");
      }
      return await LikeService.sendLike(targetId, type);
    },
    onSuccess: () => {
      // Invalidate both sent and received likes, and connections just in case it caused a match
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};
