package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.BoostPackage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BoostPackageResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer boostCount;
    private boolean active;

    public static BoostPackageResponse fromEntity(BoostPackage entity) {
        return BoostPackageResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .boostCount(entity.getBoostCount())
                .active(entity.isActive())
                .build();
    }
}
