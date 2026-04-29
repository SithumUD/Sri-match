package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.*;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.AuthResponse;
import com.ceycodez.srimatch.service.AuthenticationService;
import com.ceycodez.srimatch.service.CaptchaVerificationService;
import com.ceycodez.srimatch.service.JwtService;
import com.ceycodez.srimatch.service.TotpService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CaptchaVerificationService captchaVerificationService;
    private final JwtService jwtService;

    // ── Standard Register & Login ──────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @RequestBody @Valid RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        captchaVerificationService.verify(request.getCaptchaToken(), httpRequest.getRemoteAddr());
        authenticationService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful. Please check your email for OTP.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody @Valid LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        captchaVerificationService.verify(request.getCaptchaToken(), httpRequest.getRemoteAddr());
        AuthResponse response = authenticationService.login(request);
        
        // Set HttpOnly Cookies
        setAuthCookies(httpResponse, response, request.isRememberMe());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
    }

    // ── Social Login ──────────────────────────────────────────────────────────

    @PostMapping("/social-login")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(
            @RequestBody @Valid SocialLoginRequest request,
            HttpServletResponse httpResponse
    ) {
        AuthResponse response = authenticationService.socialLogin(request);
        
        // Set HttpOnly Cookies (default to no remember me for social login for now, or extract if available)
        setAuthCookies(httpResponse, response, false);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Social login successful", response));
    }

    // ── Logout (JWT Blacklist & Clear Cookies) ─────────────────────────────────

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            Authentication authentication
    ) {
        if (authentication != null) {
            authenticationService.logout(httpRequest.getHeader("Authorization"), authentication.getName());
        }
        
        // Clear Cookies
        clearAuthCookies(httpResponse);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged out successfully. Token has been invalidated.", null));
    }

    // ── Admin 2FA Setup ───────────────────────────────────────────────────────

    @PostMapping("/2fa/setup")
    public ResponseEntity<ApiResponse<Map<String, String>>> setup2FA(Authentication authentication) {
        TotpService.TotpSetupResult result = authenticationService.setup2FA(authentication.getName());
        Map<String, String> data = Map.of(
                "secret", result.secret(),
                "otpauthUrl", result.otpauthUrl(),
                "instructions", "Scan the QR code at 'otpauthUrl' with Google Authenticator, then call /2fa/confirm to activate."
        );
        return ResponseEntity.ok(new ApiResponse<>(true, "2FA setup initiated", data));
    }

    @PostMapping("/2fa/confirm")
    public ResponseEntity<ApiResponse<String>> confirm2FA(
            @RequestBody Map<String, Integer> body,
            Authentication authentication
    ) {
        Integer totpCode = body.get("totpCode");
        if (totpCode == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "totpCode is required", null));
        }
        authenticationService.confirm2FA(authentication.getName(), totpCode);
        return ResponseEntity.ok(new ApiResponse<>(true, "2FA has been enabled successfully for your account.", null));
    }

    // ── Email / Phone Verification ─────────────────────────────────────────────

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestBody @Valid VerifyOtpRequest request) {
        authenticationService.verifyEmail(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Email verified successfully", null));
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<ApiResponse<String>> verifyPhone(
            @RequestBody @Valid PhoneVerificationRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized", null));
        }
        authenticationService.updatePhoneNumberAndVerify(authentication.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Phone number verified successfully", null));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<String>> resendVerification(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized - You must be logged in", null));
        }
        authenticationService.resendVerificationEmail(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Verification email resent successfully.", null));
    }

    // ── Token Management ───────────────────────────────────────────────────────

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        String refreshToken = null;

        // 1. Try to get from request body
        if (request != null && request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshToken = request.getRefreshToken();
        } 
        // 2. Try to get from HttpOnly cookie
        else if (httpRequest.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : httpRequest.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Refresh token is missing", null));
        }

        AuthResponse response = authenticationService.refreshToken(new RefreshTokenRequest(refreshToken));
        
        // Check if the old token was a 'remember me' token to maintain persistence
        // For simplicity, we can check the cookie or let the service handle it.
        // For now, let's assume if they have a refresh token, we should give them a new one with 
        // the same 'remember me' status if we can determine it.
        // IMPROVEMENT: We'll modify AuthenticationService to return if it was rememberMe.
        
        setAuthCookies(httpResponse, response, response.isRememberMe());
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Token refreshed successfully", response));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        authenticationService.initiateForgotPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset OTP sent to your email", null));
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<ApiResponse<String>> verifyResetOtp(@RequestBody @Valid VerifyOtpRequest request) {
        authenticationService.verifyPasswordResetOtp(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "OTP verified successfully. You can now reset your password.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successful", null));
    }

    @PostMapping("/update-password")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @RequestBody @Valid UpdatePasswordRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new ApiResponse<>(false, "Unauthorized - You must be logged in", null));
        }
        authenticationService.updatePassword(authentication.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password updated successfully", null));
    }

    // ── Helper Methods ─────────────────────────────────────────────────────────

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse, boolean rememberMe) {
        ResponseCookie accessCookie = jwtService.createAccessTokenCookie(authResponse.getAccessToken(), rememberMe);
        ResponseCookie refreshCookie = jwtService.createRefreshTokenCookie(authResponse.getRefreshToken(), rememberMe);
        
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    private void clearAuthCookies(HttpServletResponse response) {
        ResponseCookie accessCookie = jwtService.createEmptyCookie("accessToken");
        ResponseCookie refreshCookie = jwtService.createEmptyCookie("refreshToken");
        
        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }
}