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
    private String rejectionReason;
    private String privacyAssurance;
    private String instructions;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public static VerificationResponse fromEntity(UserVerification v) {
        String privacyStatement = "Your ID documents and selfie are encrypted using AES-256 at rest and permanently purged from server storage upon review completion.";
        String instruction;
        String reason = null;

        if (v.getStatus() == VerificationStatus.PENDING) {
            instruction = "Documents received. Please submit your selfie to finalize your verification request.";
        } else if (v.getStatus() == VerificationStatus.UNDER_REVIEW) {
            instruction = "Your verification documents and selfie are currently being reviewed by our security team (typically within 24 hours).";
        } else if (v.getStatus() == VerificationStatus.APPROVED) {
            instruction = "Congratulations! Your identity has been verified and your profile displays the Verified Badge.";
        } else if (v.getStatus() == VerificationStatus.REJECTED) {
            reason = v.getAdminNotes() != null ? v.getAdminNotes() : "Document details were unclear or mismatched.";
            instruction = "Verification was rejected. Reason: " + reason + ". You may resubmit clear photos of your valid ID.";
        } else {
            instruction = "Please submit your verification documents.";
        }

        return VerificationResponse.builder()
                .id(v.getId())
                .userId(v.getUser().getId())
                .userEmail(v.getUser().getEmail())
                .userName(v.getUser().getFirstName() + " " + v.getUser().getLastName())
                .type(v.getType())
                .status(v.getStatus())
                .selfieSessionToken(v.getSelfieSessionToken())
                .adminNotes(v.getAdminNotes())
                .rejectionReason(reason)
                .privacyAssurance(privacyStatement)
                .instructions(instruction)
                .createdAt(v.getCreatedAt())
                .resolvedAt(v.getResolvedAt())
                .build();
    }
}
