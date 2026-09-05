package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.TikTokPackage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TikTokPackageResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer durationDays;
    private Integer offerPercentage;
    private boolean active;
    private LocalDateTime createdAt;

    public static TikTokPackageResponse fromEntity(TikTokPackage entity) {
        return TikTokPackageResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .durationDays(entity.getDurationDays())
                .offerPercentage(entity.getOfferPercentage())
                .active(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
