package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.UserVerification;
import com.ceycodez.srimatch.model.enums.VerificationStatus;
import com.ceycodez.srimatch.model.enums.VerificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private VerificationType type;
    private VerificationStatus status;
    private String selfieSessionToken;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public static VerificationResponse fromEntity(UserVerification v) {
        return VerificationResponse.builder()
                .id(v.getId())
                .userId(v.getUser().getId())
                .userEmail(v.getUser().getEmail())
                .userName(v.getUser().getFirstName() + " " + v.getUser().getLastName())
                .type(v.getType())
                .status(v.getStatus())
                .selfieSessionToken(v.getSelfieSessionToken())
                .adminNotes(v.getAdminNotes())
                .createdAt(v.getCreatedAt())
                .resolvedAt(v.getResolvedAt())
                .build();
    }
}
