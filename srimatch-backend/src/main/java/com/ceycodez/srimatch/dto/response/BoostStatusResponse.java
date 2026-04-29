package com.ceycodez.srimatch.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BoostStatusResponse {
    private Integer remainingBoosts;
    private boolean isBoosted;
    private LocalDateTime boostExpiresAt;
    private LocalDateTime nextRenewalAt;
}
