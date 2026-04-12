package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private String packageName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Long daysRemaining;
    private Long hoursRemaining;

    public static SubscriptionResponse fromEntity(com.ceycodez.srimatch.model.Subscription sub) {
        long days = 0;
        long hours = 0;
        if (sub.getEndDate() != null && sub.getEndDate().isAfter(LocalDateTime.now())) {
            days = ChronoUnit.DAYS.between(LocalDateTime.now(), sub.getEndDate());
            hours = ChronoUnit.HOURS.between(LocalDateTime.now(), sub.getEndDate()) % 24;
        }

        return SubscriptionResponse.builder()
                .id(sub.getId())
                .packageName(sub.getPremiumPackage().getTitle())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .status(sub.getStatus().name())
                .daysRemaining(days)
                .hoursRemaining(hours)
                .build();
    }
}
