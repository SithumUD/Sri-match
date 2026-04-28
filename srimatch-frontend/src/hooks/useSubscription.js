import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SubscriptionService from '../services/subscription.service';
import CookieService from '../services/cookie.service';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SUBSCRIPTION = {
  plan: "free",
  expiresAt: null,
  features: {
    dailyLikes: 5,
    canSeeWhoLikedYou: false,
    canVoiceVideoCall: false,
    advancedFilters: false,
    messageBeforeAccept: 0,
    hasBoost: false,
    boostExpiresAt: null,
  },
};

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await SubscriptionService.getMyActiveSubscription();
      if (res.success && res.data) {
        return res.data;
      }
      return DEFAULT_SUBSCRIPTION;
    },
    enabled: !!isAuthenticated,
    initialData: DEFAULT_SUBSCRIPTION,
  });
};

export const useUpgradeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId) => {
      const response = await SubscriptionService.initiateSubscription(packageId);
      if (!response.success) {
        throw new Error(response.message || "Failed to upgrade subscription");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
};
