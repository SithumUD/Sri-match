package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.VerificationResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.VerificationType;
import com.ceycodez.srimatch.service.UserVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/verifications")
@RequiredArgsConstructor
public class UserVerificationController {

    private final UserVerificationService verificationService;

    @PostMapping("/submit-docs")
    public ResponseEntity<ApiResponse<VerificationResponse>> submitDocs(
            @AuthenticationPrincipal User user,
            @RequestParam VerificationType type,
            @RequestParam MultipartFile front,
            @RequestParam(required = false) MultipartFile back
    ) throws Exception {
        VerificationResponse response = verificationService.submitDocuments(user, type, front, back);
        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .success(true)
                .message("Documents uploaded successfully. Please complete the selfie verification.")
                .data(response)
                .build());
    }

    @PostMapping("/submit-selfie")
    public ResponseEntity<ApiResponse<Void>> submitSelfie(
            @RequestParam String token,
            @RequestParam MultipartFile selfie
    ) throws Exception {
        verificationService.submitSelfie(token, selfie);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Verification request submitted successfully. Admin will review it shortly.")
                .build());
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<VerificationResponse>> getStatus(@AuthenticationPrincipal User user) {
        VerificationResponse response = verificationService.getMyVerification(user);
        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .success(true)
                .data(response)
                .build());
    }
}
