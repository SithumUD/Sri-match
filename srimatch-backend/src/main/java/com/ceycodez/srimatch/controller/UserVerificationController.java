package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.VerificationResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.VerificationType;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.service.UserVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/verifications")
@RequiredArgsConstructor
public class UserVerificationController {

    private final UserVerificationService verificationService;
    private final UserRepository userRepository;

    @PostMapping("/submit-docs")
    public ResponseEntity<ApiResponse<VerificationResponse>> submitDocs(
            Authentication authentication,
            @RequestParam("type") VerificationType type,
            @RequestParam("front") MultipartFile front,
            @RequestParam(value = "back", required = false) MultipartFile back
    ) throws Exception {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + authentication.getName()));
        VerificationResponse response = verificationService.submitDocuments(user, type, front, back);
        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .success(true)
                .message("Documents uploaded successfully. Please complete the selfie verification.")
                .data(response)
                .build());
    }

    @PostMapping("/submit-selfie")
    public ResponseEntity<ApiResponse<Void>> submitSelfie(
            @RequestParam("token") String token,
            @RequestParam("selfie") MultipartFile selfie
    ) throws Exception {
        verificationService.submitSelfie(token, selfie);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Verification request submitted successfully. Admin will review it shortly.")
                .build());
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<VerificationResponse>> getStatus(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + authentication.getName()));
        VerificationResponse response = verificationService.getMyVerification(user);
        return ResponseEntity.ok(ApiResponse.<VerificationResponse>builder()
                .success(true)
                .data(response)
                .build());
    }
}

