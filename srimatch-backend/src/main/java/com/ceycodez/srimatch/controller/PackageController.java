package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.PremiumPackageResponse;
import com.ceycodez.srimatch.service.PackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PremiumPackageResponse>>> getActivePackages() {
        List<PremiumPackageResponse> response = packageService.getAllPackages(true);
        return ResponseEntity.ok(ApiResponse.<List<PremiumPackageResponse>>builder()
                .success(true)
                .message("Active packages fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PremiumPackageResponse>> getPackage(@PathVariable Long id) {
        PremiumPackageResponse response = packageService.getPackageById(id);
        return ResponseEntity.ok(ApiResponse.<PremiumPackageResponse>builder()
                .success(true)
                .message("Package details fetched successfully")
                .data(response)
                .build());
    }
}
