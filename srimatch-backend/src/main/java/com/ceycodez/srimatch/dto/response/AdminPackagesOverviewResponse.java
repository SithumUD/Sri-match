package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPackagesOverviewResponse {

    private List<PremiumPackageResponse> packages;
    private List<BoostPackageResponse> boostPackages;
    private List<BankDetailResponse> bankDetails;
    private List<TikTokPackageResponse> tiktokPackages;
}
