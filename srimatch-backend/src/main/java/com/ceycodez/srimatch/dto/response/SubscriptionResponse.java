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
        if (sub == null) return null;
        long days = 0;
        long hours = 0;
        if (sub.getEndDate() != null && sub.getEndDate().isAfter(LocalDateTime.now())) {
            days = ChronoUnit.DAYS.between(LocalDateTime.now(), sub.getEndDate());
            hours = ChronoUnit.HOURS.between(LocalDateTime.now(), sub.getEndDate()) % 24;
        }

        String pkgName = "Premium Package";
        try {
            if (sub.getPremiumPackage() != null && sub.getPremiumPackage().getTitle() != null) {
                pkgName = sub.getPremiumPackage().getTitle();
            }
        } catch (Exception e) {
            pkgName = "Premium Package";
        }

        return SubscriptionResponse.builder()
                .id(sub.getId())
                .packageName(pkgName)
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .status(sub.getStatus() != null ? sub.getStatus().name() : "ACTIVE")
                .daysRemaining(days)
                .hoursRemaining(hours)
                .build();
    }
}
