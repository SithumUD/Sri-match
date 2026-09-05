package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeQuotaResponse {
    private Integer likeLimit;
    private Integer likesUsed;
    private Integer likesRemaining;
    private LocalDateTime resetsAt;
    private boolean canSendLike;
    private boolean isPremium;
    private String message;
}
