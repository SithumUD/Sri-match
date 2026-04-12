package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.BankDetailRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.BankDetailResponse;
import com.ceycodez.srimatch.service.BankDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/bank-details")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminBankDetailController {

    private final BankDetailService bankDetailService;

    @PostMapping
    public ResponseEntity<ApiResponse<BankDetailResponse>> addBankDetail(@RequestBody BankDetailRequest request) {
        BankDetailResponse response = bankDetailService.addBankDetail(request);
        return ResponseEntity.ok(ApiResponse.<BankDetailResponse>builder()
                .success(true)
                .message("Bank detail added successfully")
                .data(response)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BankDetailResponse>> updateBankDetail(
            @PathVariable Long id,
            @RequestBody BankDetailRequest request
    ) {
        BankDetailResponse response = bankDetailService.updateBankDetail(id, request);
        return ResponseEntity.ok(ApiResponse.<BankDetailResponse>builder()
                .success(true)
                .message("Bank detail updated successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        bankDetailService.toggleBankDetailStatus(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Bank detail status toggled successfully")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BankDetailResponse>>> getAllBankDetails() {
        List<BankDetailResponse> response = bankDetailService.getAllBankDetails(false);
        return ResponseEntity.ok(ApiResponse.<List<BankDetailResponse>>builder()
                .success(true)
                .message("All bank details fetched successfully")
                .data(response)
                .build());
    }
}
