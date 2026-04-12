package com.ceycodez.srimatch.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReviewRequest {
    private boolean approved;
    private String rejectionReason;
    private String transactionId;
}
