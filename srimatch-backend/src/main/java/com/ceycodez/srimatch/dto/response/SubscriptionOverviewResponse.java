package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Composite response DTO for the Subscription / Premium Page.
 * Returns packages, bank details, boost packages, active subscription,
 * pending payment status, and user boost status in a single aggregated payload.
 *
 * Includes an `errors` map side-channel for graceful partial failure isolation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionOverviewResponse {

    private List<PremiumPackageResponse> packages;
    private List<BankDetailResponse> bankDetails;
    private List<BoostPackageResponse> boostPackages;
    private List<TikTokPackageResponse> tiktokPackages;
    private List<TikTokPromotionResponse> myTikTokPromotions;
    private SubscriptionResponse activeSubscription;
    private boolean hasPendingApproval;
    private BoostStatusResponse boostStatus;

    /**
     * Side-channel containing errors from any sub-queries that degraded gracefully.
     * Example: {"boostStatus": "unavailable"}
     */
    private Map<String, String> errors;
}
