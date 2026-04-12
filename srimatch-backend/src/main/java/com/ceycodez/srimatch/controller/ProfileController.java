package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.ProfileRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ProfileResponse;
import com.ceycodez.srimatch.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> createOrUpdateProfile(
            @RequestBody @Valid ProfileRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        ProfileResponse response = profileService.createOrUpdateProfile(email, request);
        
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("Profile saved successfully")
                .data(response)
                .build());
    }

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "isPrimary", defaultValue = "false") boolean isPrimary,
            Authentication authentication
    ) {
        String email = authentication.getName();
        ProfileResponse response = profileService.uploadProfileImage(email, file, isPrimary);
        
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("Image uploaded successfully")
                .data(response)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        ProfileResponse response = profileService.getMyProfile(email);
        
        return ResponseEntity.ok(ApiResponse.<ProfileResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(response)
                .build());
    }
}
