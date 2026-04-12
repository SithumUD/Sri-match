package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PremiumPackageResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer timelineMonths;
    private Integer offerPercentage;
    private boolean active;

    public static PremiumPackageResponse fromEntity(com.ceycodez.srimatch.model.PremiumPackage pkg) {
        BigDecimal original = pkg.getPrice();
        BigDecimal current = original;
        
        if (pkg.getOfferPercentage() != null && pkg.getOfferPercentage() > 0) {
            BigDecimal discount = original.multiply(new BigDecimal(pkg.getOfferPercentage()))
                    .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            current = original.subtract(discount);
        }

        return PremiumPackageResponse.builder()
                .id(pkg.getId())
                .title(pkg.getTitle())
                .description(pkg.getDescription())
                .price(current)
                .originalPrice(original)
                .timelineMonths(pkg.getTimelineMonths())
                .offerPercentage(pkg.getOfferPercentage())
                .active(pkg.isActive())
                .build();
    }
}
