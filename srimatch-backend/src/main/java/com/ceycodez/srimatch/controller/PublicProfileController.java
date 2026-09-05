package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.DetailedProfileResponse;
import com.ceycodez.srimatch.dto.response.PublicProfileResponse;
import com.ceycodez.srimatch.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/profiles")
@RequiredArgsConstructor
public class PublicProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PublicProfileResponse>>> searchProfiles(
            @ModelAttribute ProfileSearchRequest request,
            Authentication authentication
    ) {
        String email = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        Page<PublicProfileResponse> response = profileService.searchProfiles(request, email);
        
        return ResponseEntity.ok(ApiResponse.<Page<PublicProfileResponse>>builder()
                .success(true)
                .message("Profiles fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/cursor")
    public ResponseEntity<ApiResponse<com.ceycodez.srimatch.dto.response.CursorPageResponse<PublicProfileResponse>>> searchProfilesCursor(
            @ModelAttribute ProfileSearchRequest request,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication
    ) {
        String email = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        com.ceycodez.srimatch.dto.response.CursorPageResponse<PublicProfileResponse> response =
                profileService.searchProfilesCursor(request, cursor, limit, email);

        return ResponseEntity.ok(ApiResponse.<com.ceycodez.srimatch.dto.response.CursorPageResponse<PublicProfileResponse>>builder()
                .success(true)
                .message("Profiles fetched successfully via keyset pagination")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DetailedProfileResponse>> getProfile(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        DetailedProfileResponse response = profileService.getDetailedProfile(id, email);
        
        return ResponseEntity.ok(ApiResponse.<DetailedProfileResponse>builder()
                .success(true)
                .message("Profile details fetched successfully")
                .data(response)
                .build());
    }
}
