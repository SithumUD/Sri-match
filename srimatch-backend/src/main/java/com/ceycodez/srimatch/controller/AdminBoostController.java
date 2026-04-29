package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.BoostPackageRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.BoostPackageResponse;
import com.ceycodez.srimatch.service.BoostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/boost")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminBoostController {

    private final BoostService boostService;

    @PostMapping("/packages")
    public ResponseEntity<ApiResponse<BoostPackageResponse>> createPackage(@RequestBody @Valid BoostPackageRequest request) {
        BoostPackageResponse response = boostService.createPackage(request);
        return ResponseEntity.ok(ApiResponse.<BoostPackageResponse>builder()
                .success(true)
                .message("Boost package created successfully")
                .data(response)
                .build());
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<ApiResponse<BoostPackageResponse>> updatePackage(
            @PathVariable Long id,
            @RequestBody @Valid BoostPackageRequest request
    ) {
        BoostPackageResponse response = boostService.updatePackage(id, request);
        return ResponseEntity.ok(ApiResponse.<BoostPackageResponse>builder()
                .success(true)
                .message("Boost package updated successfully")
                .data(response)
                .build());
    }

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<BoostPackageResponse>>> getAllPackages() {
        List<BoostPackageResponse> response = boostService.getAllPackages(false);
        return ResponseEntity.ok(ApiResponse.<List<BoostPackageResponse>>builder()
                .success(true)
                .message("All boost packages fetched successfully")
                .data(response)
                .build());
    }
}
