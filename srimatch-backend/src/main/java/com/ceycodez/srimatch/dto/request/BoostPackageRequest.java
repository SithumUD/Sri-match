package com.ceycodez.srimatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BoostPackageRequest {
    @NotBlank(message = "Name is mandatory")
    private String name;

    private String description;

    @NotNull(message = "Price is mandatory")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Boost count is mandatory")
    @Positive(message = "Boost count must be positive")
    private Integer boostCount;

    private boolean active = true;
}
