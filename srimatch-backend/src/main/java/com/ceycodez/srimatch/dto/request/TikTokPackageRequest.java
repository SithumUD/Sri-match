package com.ceycodez.srimatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TikTokPackageRequest {

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String description;

    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Duration days is mandatory")
    @Positive(message = "Duration must be at least 1 day")
    private Integer durationDays;

    private Integer offerPercentage;

    private boolean active = true;
}
