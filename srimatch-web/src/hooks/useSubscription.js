import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SubscriptionService from '../services/subscription.service';
import BoostService from '../services/boost.service';
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

/**
 * Composite query hook for the Subscription page.
 * Fetches packages, bank details, boost packages, active subscription,
 * pending payment status, and boost status in a single request.
 *
 * Cached for 60 seconds with window focus refetch disabled to save backend costs.
 */
export const useSubscriptionOverview = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['subscription-overview'],
    queryFn: async () => {
      const res = await SubscriptionService.getOverview();
      if (res.success && res.data) {
        return res.data;
      }
      return {
        packages: [],
        bankDetails: [],
        boostPackages: [],
        tiktokPackages: [],
        myTikTokPromotions: [],
        activeSubscription: null,
        hasPendingApproval: false,
        boostStatus: null,
        errors: null,
      };
    },
    enabled: !!isAuthenticated,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Targeted conditional polling hook for Boost Status.
 * Only polls if a boost is actively running (isBoosted === true).
 * Disabled completely for idle/un-boosted users to eliminate wasteful polling traffic.
 */
export const useBoostStatusPolling = (isBoosted) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['boost-status'],
    queryFn: async () => {
      const res = await BoostService.getBoostStatus();
      return res.success ? res.data : null;
    },
    enabled: !!isAuthenticated && !!isBoosted,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling once boost has expired
      return data?.isBoosted ? 30_000 : false;
    },
    refetchOnWindowFocus: false,
  });
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
    staleTime: 60_000,
    refetchOnWindowFocus: false,
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
      queryClient.invalidateQueries({ queryKey: ['subscription-overview'] });
    },
  });
};

