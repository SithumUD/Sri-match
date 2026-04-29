package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.BoostPackageResponse;
import com.ceycodez.srimatch.dto.response.BoostStatusResponse;
import com.ceycodez.srimatch.dto.response.PaymentResponse;
import com.ceycodez.srimatch.service.BoostService;
import com.ceycodez.srimatch.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/v1/boost")
@RequiredArgsConstructor
public class BoostController {

    private final BoostService boostService;
    private final PaymentService paymentService;

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<BoostStatusResponse>> getBoostStatus(Authentication authentication) {
        BoostStatusResponse response = boostService.getBoostStatus(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<BoostStatusResponse>builder()
                .success(true)
                .message("Boost status fetched successfully")
                .data(response)
                .build());
    }

    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<BoostStatusResponse>> activateBoost(Authentication authentication) {
        BoostStatusResponse response = boostService.activateBoost(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<BoostStatusResponse>builder()
                .success(true)
                .message("Profile boosted successfully for 1 hour")
                .data(response)
                .build());
    }

    @GetMapping("/packages")
    public ResponseEntity<ApiResponse<List<BoostPackageResponse>>> getAvailablePackages() {
        List<BoostPackageResponse> response = boostService.getAllPackages(true);
        return ResponseEntity.ok(ApiResponse.<List<BoostPackageResponse>>builder()
                .success(true)
                .message("Boost packages fetched successfully")
                .data(response)
                .build());
    }

    /**
     * Submit a bank transfer receipt for a boost package purchase.
     * Goes through the same payment approval flow as subscriptions.
     */
    @PostMapping("/purchase/{packageId}/receipt")
    public ResponseEntity<ApiResponse<PaymentResponse>> submitBoostReceipt(
            @PathVariable Long packageId,
            @RequestParam("receipt") MultipartFile receipt,
            Authentication authentication
    ) throws IOException {
        Long userId = boostService.getUserIdByEmail(authentication.getName());
        PaymentResponse response = paymentService.submitBoostBankReceipt(userId, packageId, receipt);
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Boost purchase receipt submitted. Pending admin approval.")
                .data(response)
                .build());
    }
}
