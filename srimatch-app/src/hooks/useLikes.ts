import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LikeService, ConnectionService, SubscriptionService, ChatService } from '../services';
import useAuthStore from '../store/useAuthStore';
import { Alert } from 'react-native';

export const useSentLikes = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['likes', 'sent'],
    queryFn: async () => {
      const res: any = await LikeService.getSentLikes();
      const content = res?.data?.content || res?.data || [];
      if (!Array.isArray(content)) return [];
      return content.map((l: any) => ({
        ...l,
        userId: l.receiver?.id,
        profileId: l.receiver?.profile?.id || l.receiverId || l.receiver?.id,
        type: l.type,
      }));
    },
    enabled: !!isAuthenticated,
  });
};

export const useReceivedLikes = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['likes', 'received'],
    queryFn: async () => {
      const res: any = await LikeService.getReceivedLikes();
      return res?.data?.likes || res?.data?.content || (Array.isArray(res?.data) ? res.data : []);
    },
    enabled: !!isAuthenticated,
  });
};

export const useLikeQuota = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['likes', 'quota'],
    queryFn: async () => {
      const res: any = await LikeService.getLikeQuota();
      return res?.data || {
        likeLimit: 15,
        likesUsed: 0,
        likesRemaining: 15,
        canSendLike: true,
        isPremium: false,
        resetsAt: null,
      };
    },
    enabled: !!isAuthenticated,
    staleTime: 30000,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, type = 'NORMAL' }: { profileId: number | string; type?: 'NORMAL' | 'STAR' | 'SUPER' }) => {
      const targetId = Number(profileId);
      if (!targetId || isNaN(targetId)) throw new Error('Invalid profile ID');

      const user = useAuthStore.getState().user;
      if (type === 'STAR') {
        const isPremium = Boolean(
          user?.premium ||
          user?.isPremium ||
          user?.subscription?.plan === 'premium' ||
          user?.subscription?.plan === 'PRO' ||
          user?.subscription?.plan === 'VIP' ||
          user?.role === 'PREMIUM'
        );
        if (!isPremium) {
          Alert.alert(
            'Premium Feature 👑',
            'Star Likes are an exclusive Premium feature. Upgrade to send priority Star Likes with highlighted visibility!',
            [{ text: 'OK' }]
          );
          return null;
        }
      }

      return await LikeService.sendLike(targetId, type);
    },

    onMutate: async ({ profileId, type = 'NORMAL' }) => {
      const targetId = Number(profileId);
      await queryClient.cancelQueries({ queryKey: ['profiles'] });

      // Optimistically update sent likes cache
      queryClient.setQueryData(['likes', 'sent'], (old: any) => {
        if (!Array.isArray(old)) return [{ profileId: targetId, type }];
        const existing = old.findIndex((item) => Number(item.profileId) === targetId);
        if (existing >= 0) {
          const updated = [...old];
          updated[existing] = { ...updated[existing], type };
          return updated;
        }
        return [...old, { profileId: targetId, type }];
      });

      // Optimistically update profiles cache
      queryClient.setQueriesData({ queryKey: ['profiles'], exact: false }, (old: any) => {
        if (!old) return old;
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              items: (page.items || page.content || []).map((p: any) =>
                Number(p.id) === targetId ? { ...p, interactionType: type, interactionStatus: 'PENDING' } : p
              ),
            })),
          };
        }
        return old;
      });
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Could not send like. Please try again.';
      Alert.alert('Notice', msg);
    },

    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['likes'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

export const useConnections = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['connections', 'overview'],
    queryFn: async () => {
      const res: any = await ConnectionService.getOverview();
      return res?.data || { matches: [], pendingReceived: [], pendingSent: [] };
    },
    enabled: !!isAuthenticated,
  });
};

export const useSubscriptionOverview = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['subscription', 'overview'],
    queryFn: async () => {
      const res: any = await SubscriptionService.getOverview();
      return res?.data || { packages: [], bankDetails: [] };
    },
    enabled: !!isAuthenticated,
  });
};

export const useConversations = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: async () => {
      const res: any = await ChatService.getConversations();
      return res?.data?.content || res?.data || [];
    },
    enabled: !!isAuthenticated,
    refetchInterval: 10000,
  });
};

export const useChatMessages = (conversationId: string | number) => {
  return useQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const res: any = await ChatService.getMessages(conversationId);
      const content = res?.data?.content || res?.data || [];
      return Array.isArray(content) ? [...content].reverse() : [];
    },
    enabled: !!conversationId,
    refetchInterval: 4000,
  });
};
