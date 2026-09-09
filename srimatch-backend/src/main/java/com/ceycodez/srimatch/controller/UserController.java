package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.UserEditRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.UserResponse;
import com.ceycodez.srimatch.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyUserData(Authentication authentication) {
        String email = authentication.getName();
        UserResponse response = userService.getMyUserData(email);
        
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User data fetched successfully")
                .data(response)
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyUser(
            @RequestBody @Valid UserEditRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        UserResponse response = userService.updateMyUser(email, request);
        
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User data updated successfully")
                .data(response)
                .build());
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<String>> softDeleteOwnAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.softDeleteOwnAccount(email);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Account deleted successfully (soft delete)")
                .data(null)
                .build());
    }

    @PatchMapping("/me/fcm-token")
    public ResponseEntity<ApiResponse<String>> updateFcmToken(
            @RequestParam("token") String token,
            Authentication authentication
    ) {
        String email = authentication.getName();
        userService.updateFcmToken(email, token);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("FCM token updated successfully")
                .data(null)
                .build());
    }

    /**
     * Save notification preferences (all toggles from Settings > Notifications tab).
     * Body: { "newMessages": true, "newMatches": true, "profileViews": false, "emailSummaries": false, ... }
     */
    @PatchMapping("/me/notifications")
    public ResponseEntity<ApiResponse<UserResponse>> updateNotificationPreferences(
            @RequestBody Map<String, Object> prefs,
            Authentication authentication
    ) {
        String email = authentication.getName();
        UserResponse response = userService.updateNotificationPreferences(email, prefs);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Notification preferences saved successfully")
                .data(response)
                .build());
    }

    @PostMapping("/me/request-phone-otp")
    public ResponseEntity<ApiResponse<String>> requestPhoneOtp(
            @RequestBody @Valid com.ceycodez.srimatch.dto.request.PhoneVerificationRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        userService.requestPhoneVerificationOtp(email, request.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("OTP verification code sent to your mobile phone via SMS")
                .data(null)
                .build());
    }

    @PostMapping("/me/verify-phone")
    public ResponseEntity<ApiResponse<UserResponse>> verifyPhone(
            @RequestBody @Valid com.ceycodez.srimatch.dto.request.PhoneOtpVerifyRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        UserResponse response = userService.verifyPhoneNumberOtp(email, request.getOtp());
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Phone number verified successfully")
                .data(response)
                .build());
    }

    @GetMapping("/me/sessions")
    public ResponseEntity<ApiResponse<java.util.List<com.ceycodez.srimatch.dto.response.UserSessionResponse>>> getActiveSessions(
            Authentication authentication,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        String email = authentication.getName();
        String currentToken = null;
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    currentToken = cookie.getValue();
                    break;
                }
            }
        }
        java.util.List<com.ceycodez.srimatch.dto.response.UserSessionResponse> sessions = userService.getActiveSessions(email, currentToken);
        return ResponseEntity.ok(ApiResponse.<java.util.List<com.ceycodez.srimatch.dto.response.UserSessionResponse>>builder()
                .success(true)
                .message("Active sessions retrieved successfully")
                .data(sessions)
                .build());
    }

    @DeleteMapping("/me/sessions/{id}")
    public ResponseEntity<ApiResponse<String>> revokeSession(
            @PathVariable("id") Long sessionId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        userService.revokeSession(email, sessionId);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Session terminated successfully")
                .data(null)
                .build());
    }

    @DeleteMapping("/me/sessions")
    public ResponseEntity<ApiResponse<String>> revokeAllOtherSessions(
            Authentication authentication
    ) {
        String email = authentication.getName();
        userService.revokeOtherSessions(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("All other active device sessions have been terminated")
                .data(null)
                .build());
    }
}
