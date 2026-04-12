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
}
