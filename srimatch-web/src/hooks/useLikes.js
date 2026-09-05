import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import LikeService from '../services/like.service';
import { useAuth } from '../context/AuthContext';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'sonner';


export const useSentLikes = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['likes', 'sent'],
    queryFn: async () => {
      const res = await LikeService.getSentLikes(0, 100);
      if (res.success) {
        const sentData = res.data.content || res.data || [];
        return sentData.map(l => ({ 
          userId: l.receiver?.id,
          profileId: l.receiver?.profile?.id || l.receiverId || l.receiver?.id, 
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

  // Rapid-fire guard: tracks profile IDs that have an in-flight mutation.
  // If a second tap arrives for the same profile before the first resolves,
  // the mutationFn returns null early — no duplicate request is sent.
  const pendingIds = useRef(new Set());

  return useMutation({
    mutationFn: async ({ profileId, type = 'NORMAL' }) => {
      const targetId = Number(profileId);
      if (!targetId || isNaN(targetId)) throw new Error('Invalid profile ID');

      // Rapid-fire guard: block if already in-flight for this profile
      if (pendingIds.current.has(targetId)) return null;

      if (type === 'STAR') {
        const user = useAuthStore.getState().user;
        const isPremiumUser = Boolean(
          user?.premium || 
          user?.isPremium || 
          user?.subscription?.plan === 'premium' || 
          user?.subscription?.plan === 'PRO' || 
          user?.subscription?.plan === 'VIP' ||
          user?.role === 'PREMIUM'
        );
        if (!isPremiumUser) {
          toast.error("Star Likes are an exclusive Premium feature. Please upgrade to send Star Likes.");
          return null;
        }
      }

      pendingIds.current.add(targetId);

      return await LikeService.sendLike(targetId, type);
    },

    // ── Optimistic update ─────────────────────────────────────────────────
    onMutate: async ({ profileId, type }) => {
      const targetId = Number(profileId);

      // 1. Cancel any outgoing ['profiles', ...] refetches so they don't
      //    overwrite the optimistic state we're about to apply.
      await queryClient.cancelQueries({ queryKey: ['profiles'], exact: false });

      // 2. Snapshot the current cache so we can roll back on error.
      const previousData = queryClient.getQueriesData({ queryKey: ['profiles'] });

      // 3. Optimistically update the profile across all infinite-query pages.
      //    interactionStatus is set to 'PENDING' — onSuccess will overwrite this
      //    with the server's authoritative value (which could be 'ACCEPTED' if a
      //    mutual match was created).
      queryClient.setQueriesData({ queryKey: ['profiles'], exact: false }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((p) =>
              p.id === targetId
                ? { ...p, interactionType: type, interactionStatus: 'PENDING' }
                : p
            ),
          })),
        };
      });

      return { previousData }; // passed to onError for rollback
    },

    // ── Rollback on failure ───────────────────────────────────────────────
    onError: (error, { profileId }, context) => {
      // Restore the snapshot — every page, every profile, exactly as it was.
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Never fail silently. On a matrimonial platform, a silent rollback on an
      // "I'm interested" action is a trust problem — the user must know it failed.
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Could not send interest. Please try again.';
      toast.error(message);
    },

    // ── Reconcile with authoritative server state ─────────────────────────
    onSuccess: (res, { type, profileId }) => {
      // Short-circuit: if the rapid-fire guard suppressed this call, res is null
      if (!res) return;

      const targetId = Number(profileId);

      // The backend now returns { interactionType, interactionStatus } — use the
      // real server values to overwrite the optimistic guess.
      // This is critical for the ACCEPTED case: if both parties liked each other,
      // the backend returns 'ACCEPTED' and the UI can immediately reflect a match.
      const serverType   = res?.data?.interactionType;
      const serverStatus = res?.data?.interactionStatus;

      if (serverType && serverStatus) {
        queryClient.setQueriesData({ queryKey: ['profiles'], exact: false }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                p.id === targetId
                  ? { ...p, interactionType: serverType, interactionStatus: serverStatus }
                  : p
              ),
            })),
          };
        });
      }

      // User-facing success toast
      if (type === 'STAR') {
        toast.success('⭐ Star Like sent! The recipient has been notified.');
      } else {
        toast.success('❤️ Interest sent successfully!');
      }
    },

    // ── Cleanup ───────────────────────────────────────────────────────────
    onSettled: (data, error, { profileId }) => {
      // Always release the in-flight guard for this profile, regardless of outcome.
      pendingIds.current.delete(Number(profileId));

      // Invalidate connections only — a new like may have created a mutual match
      // that needs to appear in the Connections page.
      // We do NOT invalidate ['profiles'] or ['likes', 'sent'] — that would
      // discard the reconciled cache state and cause an unnecessary re-fetch.
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });
};

