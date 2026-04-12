package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.PremiumPackageRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.PremiumPackageResponse;
import com.ceycodez.srimatch.service.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/packages")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminPackageController {

    private final PackageService packageService;

    @PostMapping
    public ResponseEntity<ApiResponse<PremiumPackageResponse>> createPackage(@RequestBody PremiumPackageRequest request) {
        PremiumPackageResponse response = packageService.createPackage(request);
        return ResponseEntity.ok(ApiResponse.<PremiumPackageResponse>builder()
                .success(true)
                .message("Package created successfully")
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PremiumPackageResponse>> updatePackage(
            @PathVariable Long id,
            @RequestBody PremiumPackageRequest request
    ) {
        PremiumPackageResponse response = packageService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.<PremiumPackageResponse>builder()
                .success(true)
                .message("Package updated successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        packageService.togglePackageStatus(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Package status toggled successfully")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PremiumPackageResponse>>> getAllPackages() {
        List<PremiumPackageResponse> response = packageService.getAllPackages(false);
        return ResponseEntity.ok(ApiResponse.<List<PremiumPackageResponse>>builder()
                .success(true)
                .message("All packages fetched successfully")
                .data(response)
                .build());
    }
}
