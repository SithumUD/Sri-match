package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.LoginRequest;
import com.ceycodez.srimatch.dto.request.ForgotPasswordRequest;
import com.ceycodez.srimatch.dto.request.PhoneVerificationRequest;
import com.ceycodez.srimatch.dto.request.RefreshTokenRequest;
import com.ceycodez.srimatch.dto.request.RegisterRequest;
import com.ceycodez.srimatch.dto.request.ResetPasswordRequest;
import com.ceycodez.srimatch.dto.request.UpdatePasswordRequest;
import com.ceycodez.srimatch.dto.request.VerifyOtpRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.AuthResponse;
import com.ceycodez.srimatch.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody @Valid RegisterRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Registration successful. Please check your email for OTP.")
                .data(null)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build());
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestBody @Valid VerifyOtpRequest request) {
        authenticationService.verifyEmail(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Email verified successfully")
                .data(null)
                .build());
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<ApiResponse<String>> verifyPhone(
            @RequestBody @Valid PhoneVerificationRequest request,
            Authentication authentication
    ) {
        // authentication represents the currently logged in user (via JWT)
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.<String>builder()
                    .success(false)
                    .message("Unauthorized")
                    .data(null)
                    .build());
        }

        String email = authentication.getName(); // JWT subject is email
        authenticationService.updatePhoneNumberAndVerify(email, request);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Phone number verified successfully")
                .data(null)
                .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        AuthResponse response = authenticationService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Token refreshed successfully")
                .data(response)
                .build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        authenticationService.initiateForgotPassword(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Password reset OTP sent to your email")
                .data(null)
                .build());
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<String>> verifyResetOtp(@RequestBody @Valid VerifyOtpRequest request) {
        authenticationService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("OTP verified successfully. You can now reset your password.")
                .data(null)
                .build());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Password reset successful")
                .data(null)
                .build());
    }

    @PostMapping("/update-password")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @RequestBody @Valid UpdatePasswordRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.<String>builder()
                    .success(false)
                    .message("Unauthorized - You must be logged in to update your password")
                    .data(null)
                    .build());
        }

        String email = authentication.getName();
        authenticationService.updatePassword(email, request);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Password updated successfully")
                .data(null)
                .build());
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerification(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.<String>builder()
                    .success(false)
                    .message("Unauthorized - You must be logged in to resend verification email")
                    .data(null)
                    .build());
        }

        String email = authentication.getName();
        authenticationService.resendVerificationEmail(email);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Verification email resent successfully. Please check your inbox.")
                .data(null)
                .build());
    }
}
