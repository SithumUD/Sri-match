package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.AdminCreateUserRequest;
import com.ceycodez.srimatch.dto.request.AdminUserEditRequest;
import com.ceycodez.srimatch.dto.request.LockAccountRequest;
import com.ceycodez.srimatch.dto.request.ProfileRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ProfileResponse;
import com.ceycodez.srimatch.dto.response.UserResponse;
import com.ceycodez.srimatch.model.enums.UserRole;
import com.ceycodez.srimatch.service.ProfileService;
import com.ceycodez.srimatch.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminUserController {

    private final UserService userService;
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> response = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.<List<UserResponse>>builder()
                .success(true)
                .message("All users fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse>> getAdminUserDetail(
            @PathVariable Long id
    ) {
        com.ceycodez.srimatch.dto.response.AdminUserDetailResponse response = userService.getAdminUserDetail(id);
        return ResponseEntity.ok(ApiResponse.<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse>builder()
                .success(true)
                .message("Admin user details fetched successfully")
                .data(response)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> adminCreateUser(
            @RequestBody @Valid AdminCreateUserRequest request
    ) {
        UserResponse response = userService.adminCreateUser(request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User created successfully by admin")
                .data(response)
                .build());
    }

    @PutMapping("/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> adminUpdateUser(
            @PathVariable String email,
            @RequestBody @Valid AdminUserEditRequest request
    ) {
        UserResponse response = userService.adminUpdateUser(email, request);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User updated successfully by admin")
                .data(response)
                .build());
    }

    @PutMapping("/{email}/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> adminUpdateUserProfile(
            @PathVariable String email,
            @RequestBody @Valid ProfileRequest request
    ) {
        ProfileResponse response = profileService.adminUpdateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("User profile and basic info updated successfully by admin")
                .data(response)
                .build());
    }

    @PatchMapping("/{email}/role")
    public ResponseEntity<ApiResponse<String>> adminChangeRole(
            @PathVariable String email,
            @RequestParam UserRole role
    ) {
        userService.adminChangeRole(email, role);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("User role updated successfully to " + role)
                .data(null)
                .build());
    }

    @PatchMapping("/{email}/lock")
    public ResponseEntity<ApiResponse<String>> adminLockAccount(
            @PathVariable String email,
            @RequestBody LockAccountRequest request
    ) {
        userService.adminLockAccount(email, request.getLockUntil());
        String message = request.getLockUntil() == null ? "Account locked permanently" : "Account locked until " + request.getLockUntil();
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message(message)
                .data(null)
                .build());
    }

    @DeleteMapping("/{email}/soft")
    public ResponseEntity<ApiResponse<String>> adminSoftDeleteUser(@PathVariable String email) {
        userService.adminSoftDeleteUser(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("User account soft-deleted successfully")
                .data(null)
                .build());
    }

    @DeleteMapping("/{email}/hard")
    public ResponseEntity<ApiResponse<String>> adminHardDeleteUser(@PathVariable String email) {
        userService.adminHardDeleteUser(email);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("User account hard-deleted successfully")
                .data(null)
                .build());
    }

    @DeleteMapping("/purge")
    public ResponseEntity<ApiResponse<String>> purgeSoftDeletedUsers() {
        userService.purgeSoftDeletedUsers();
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("All soft-deleted accounts have been permanently purged")
                .data(null)
                .build());
    }
}
