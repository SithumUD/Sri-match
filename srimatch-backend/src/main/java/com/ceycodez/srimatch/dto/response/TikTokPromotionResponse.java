package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.TikTokPromotion;
import com.ceycodez.srimatch.model.enums.TikTokPromotionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
public class TikTokPromotionResponse {

    private Long id;

    // User info
    private Long userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private String profileImageUrl;

    // Package info
    private Long packageId;
    private String packageName;
    private Integer durationDays;
    private BigDecimal paidAmount;

    // Payment info
    private Long paymentId;
    private String receiptUrl;
    private String paymentStatus;

    // Promotion lifecycle
    private TikTokPromotionStatus status;
    private String tiktokPostUrl;
    private String adminNotes;
    private String rejectionReason;
    private LocalDateTime submittedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime expiresAt;

    // Computed
    private Long timeRemainingSeconds;

    public static TikTokPromotionResponse fromEntity(TikTokPromotion entity) {
        Long remaining = null;
        if (entity.getStatus() == TikTokPromotionStatus.PUBLISHED
                && entity.getExpiresAt() != null
                && entity.getExpiresAt().isAfter(LocalDateTime.now())) {
            remaining = ChronoUnit.SECONDS.between(LocalDateTime.now(), entity.getExpiresAt());
        }

        String firstName = entity.getUser() != null ? entity.getUser().getFirstName() : null;
        String lastName = entity.getUser() != null ? entity.getUser().getLastName() : null;
        String email = entity.getUser() != null ? entity.getUser().getEmail() : null;
        Long userId = entity.getUser() != null ? entity.getUser().getId() : null;

        String packageName = entity.getTiktokPackage() != null ? entity.getTiktokPackage().getName() : null;
        Long packageId = entity.getTiktokPackage() != null ? entity.getTiktokPackage().getId() : null;
        Integer durationDays = entity.getTiktokPackage() != null ? entity.getTiktokPackage().getDurationDays() : null;

        Long paymentId = entity.getPayment() != null ? entity.getPayment().getId() : null;
        String receiptUrl = entity.getPayment() != null ? entity.getPayment().getReceiptUrl() : null;
        String paymentStatus = entity.getPayment() != null ? entity.getPayment().getPaymentStatus().name() : null;
        BigDecimal paidAmount = entity.getPayment() != null ? entity.getPayment().getAmount() : null;

        return TikTokPromotionResponse.builder()
                .id(entity.getId())
                .userId(userId)
                .userFirstName(firstName)
                .userLastName(lastName)
                .userEmail(email)
                .packageId(packageId)
                .packageName(packageName)
                .durationDays(durationDays)
                .paidAmount(paidAmount)
                .paymentId(paymentId)
                .receiptUrl(receiptUrl)
                .paymentStatus(paymentStatus)
                .status(entity.getStatus())
                .tiktokPostUrl(entity.getTiktokPostUrl())
                .adminNotes(entity.getAdminNotes())
                .rejectionReason(entity.getRejectionReason())
                .submittedAt(entity.getSubmittedAt())
                .publishedAt(entity.getPublishedAt())
                .expiresAt(entity.getExpiresAt())
                .timeRemainingSeconds(remaining)
                .build();
    }
}
