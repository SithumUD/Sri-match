package com.ceycodez.srimatch.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PremiumPackageRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private Integer timelineMonths;
    private Integer offerPercentage;
}
