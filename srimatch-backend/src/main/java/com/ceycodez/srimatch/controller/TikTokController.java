package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.TikTokPackageRequest;
import com.ceycodez.srimatch.dto.request.TikTokPublishRequest;
import com.ceycodez.srimatch.dto.request.TikTokRejectRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.TikTokPackageResponse;
import com.ceycodez.srimatch.dto.response.TikTokPromotionResponse;
import com.ceycodez.srimatch.service.TikTokService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/v1")
@RequiredArgsConstructor
public class TikTokController {

    private final TikTokService tikTokService;

    // ────────────────────────────────────────────────
    // Public: List Active Packages
    // ────────────────────────────────────────────────

    @GetMapping("/tiktok/packages")
    public ResponseEntity<ApiResponse<List<TikTokPackageResponse>>> getActivePackages() {
        return ResponseEntity.ok(ApiResponse.<List<TikTokPackageResponse>>builder()
                .success(true)
                .message("TikTok packages fetched successfully")
                .data(tikTokService.getActivePackages())
                .build());
    }

    // ────────────────────────────────────────────────
    // User: Submit Promotion
    // ────────────────────────────────────────────────

    @PostMapping("/tiktok/promotions")
    public ResponseEntity<ApiResponse<TikTokPromotionResponse>> submitPromotion(
            @RequestParam("packageId") Long packageId,
            @RequestParam("slip") MultipartFile slip,
            Authentication authentication
    ) throws IOException {
        Long userId = tikTokService.getUserIdByEmail(authentication.getName());
        TikTokPromotionResponse response = tikTokService.submitPromotion(userId, packageId, slip);
        return ResponseEntity.ok(ApiResponse.<TikTokPromotionResponse>builder()
                .success(true)
                .message("TikTok promotion submitted. Pending admin review.")
                .data(response)
                .build());
    }

    // ────────────────────────────────────────────────
    // User: View Own Promotions
    // ────────────────────────────────────────────────

    @GetMapping("/tiktok/promotions/me")
    public ResponseEntity<ApiResponse<List<TikTokPromotionResponse>>> getMyPromotions(Authentication authentication) {
        Long userId = tikTokService.getUserIdByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<List<TikTokPromotionResponse>>builder()
                .success(true)
                .message("Your TikTok promotions fetched successfully")
                .data(tikTokService.getUserPromotions(userId))
                .build());
    }

    // ────────────────────────────────────────────────
    // Admin: Package Management
    // ────────────────────────────────────────────────

    @GetMapping("/admin/tiktok/packages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<TikTokPackageResponse>>> adminGetPackages() {
        return ResponseEntity.ok(ApiResponse.<List<TikTokPackageResponse>>builder()
                .success(true)
                .message("All TikTok packages fetched successfully")
                .data(tikTokService.adminGetAllPackages())
                .build());
    }

    @PostMapping("/admin/tiktok/packages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPackageResponse>> adminCreatePackage(
            @RequestBody @Valid TikTokPackageRequest request) {
        return ResponseEntity.ok(ApiResponse.<TikTokPackageResponse>builder()
                .success(true)
                .message("TikTok package created successfully")
                .data(tikTokService.createPackage(request))
                .build());
    }

    @PutMapping("/admin/tiktok/packages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPackageResponse>> adminUpdatePackage(
            @PathVariable Long id,
            @RequestBody @Valid TikTokPackageRequest request) {
        return ResponseEntity.ok(ApiResponse.<TikTokPackageResponse>builder()
                .success(true)
                .message("TikTok package updated successfully")
                .data(tikTokService.updatePackage(id, request))
                .build());
    }

    @PatchMapping("/admin/tiktok/packages/{id}/toggle")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPackageResponse>> adminTogglePackage(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<TikTokPackageResponse>builder()
                .success(true)
                .message("TikTok package status toggled")
                .data(tikTokService.togglePackage(id))
                .build());
    }

    // ────────────────────────────────────────────────
    // Admin: Promotion Management
    // ────────────────────────────────────────────────

    @GetMapping("/admin/tiktok/promotions")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<TikTokPromotionResponse>>> adminListPromotions(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.<List<TikTokPromotionResponse>>builder()
                .success(true)
                .message("TikTok promotions fetched successfully")
                .data(tikTokService.adminListPromotions(status))
                .build());
    }

    @PatchMapping("/admin/tiktok/promotions/{id}/process")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPromotionResponse>> adminSetProcessing(
            @PathVariable Long id, Authentication authentication) {
        Long adminId = tikTokService.getUserIdByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<TikTokPromotionResponse>builder()
                .success(true)
                .message("Promotion marked as processing")
                .data(tikTokService.adminSetProcessing(id, adminId))
                .build());
    }

    @PatchMapping("/admin/tiktok/promotions/{id}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPromotionResponse>> adminPublish(
            @PathVariable Long id,
            @RequestBody TikTokPublishRequest request,
            Authentication authentication) {
        Long adminId = tikTokService.getUserIdByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<TikTokPromotionResponse>builder()
                .success(true)
                .message("TikTok promotion published successfully")
                .data(tikTokService.adminPublish(id, adminId, request))
                .build());
    }

    @PatchMapping("/admin/tiktok/promotions/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<TikTokPromotionResponse>> adminReject(
            @PathVariable Long id,
            @RequestBody TikTokRejectRequest request,
            Authentication authentication) {
        Long adminId = tikTokService.getUserIdByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<TikTokPromotionResponse>builder()
                .success(true)
                .message("TikTok promotion rejected")
                .data(tikTokService.adminReject(id, adminId, request))
                .build());
    }
}
