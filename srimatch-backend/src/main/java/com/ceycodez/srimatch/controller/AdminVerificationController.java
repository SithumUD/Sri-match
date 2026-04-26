package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.VerificationResponse;
import com.ceycodez.srimatch.service.UserVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/verifications")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminVerificationController {

    private final UserVerificationService verificationService;

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<VerificationResponse>>> getPending() {
        List<VerificationResponse> response = verificationService.getPendingVerifications();
        return ResponseEntity.ok(ApiResponse.<List<VerificationResponse>>builder()
                .success(true)
                .data(response)
                .build());
    }

    @GetMapping("/{id}/view/{side}")
    public ResponseEntity<byte[]> viewFile(@PathVariable Long id, @PathVariable String side) throws Exception {
        byte[] data = verificationService.getDecryptedFile(id, side);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Assumption, could be dynamic
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approve(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        verificationService.approve(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User verified successfully")
                .build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> reject(@PathVariable Long id, @RequestParam String reason, @AuthenticationPrincipal UserDetails userDetails) {
        verificationService.reject(id, userDetails.getUsername(), reason);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Verification rejected")
                .build());
    }
}
