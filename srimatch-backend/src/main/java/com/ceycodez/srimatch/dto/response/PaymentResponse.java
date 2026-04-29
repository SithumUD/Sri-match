package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long subscriptionId;
    private Long boostPackageId;
    private String packageName;
    private String paymentType;
    private BigDecimal amount;
    private String paymentMethod;
    private String receiptUrl;
    private String paymentStatus;
    private String transactionId;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;

    public static PaymentResponse fromEntity(Payment payment) {
        String pkgName = null;
        Long subId = null;
        Long boostPkgId = null;

        if (payment.getSubscription() != null) {
            subId = payment.getSubscription().getId();
            pkgName = payment.getSubscription().getPremiumPackage().getTitle();
        } else if (payment.getBoostPackage() != null) {
            boostPkgId = payment.getBoostPackage().getId();
            pkgName = payment.getBoostPackage().getName();
        }

        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUser().getId())
                .userEmail(payment.getUser().getEmail())
                .subscriptionId(subId)
                .boostPackageId(boostPkgId)
                .packageName(pkgName)
                .paymentType(payment.getPaymentType())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .receiptUrl(payment.getReceiptUrl())
                .paymentStatus(payment.getPaymentStatus().name())
                .transactionId(payment.getTransactionId())
                .submittedAt(payment.getSubmittedAt())
                .reviewedAt(payment.getReviewedAt())
                .rejectionReason(payment.getRejectionReason())
                .build();
    }
}
