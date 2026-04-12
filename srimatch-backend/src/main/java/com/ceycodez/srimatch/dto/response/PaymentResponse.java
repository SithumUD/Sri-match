package com.ceycodez.srimatch.dto.response;

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
    private String packageName;
    private BigDecimal amount;
    private String paymentMethod;
    private String receiptUrl;
    private String paymentStatus;
    private String transactionId;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;

    public static PaymentResponse fromEntity(com.ceycodez.srimatch.model.Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUser().getId())
                .userEmail(payment.getUser().getEmail())
                .subscriptionId(payment.getSubscription().getId())
                .packageName(payment.getSubscription().getPremiumPackage().getTitle())
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
