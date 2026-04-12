package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.BankDetailResponse;
import com.ceycodez.srimatch.service.BankDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/bank-details")
@RequiredArgsConstructor
public class BankDetailController {

    private final BankDetailService bankDetailService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BankDetailResponse>>> getActiveBankDetails() {
        List<BankDetailResponse> response = bankDetailService.getAllBankDetails(true);
        return ResponseEntity.ok(ApiResponse.<List<BankDetailResponse>>builder()
                .success(true)
                .message("Active bank details fetched successfully")
                .data(response)
                .build());
    }
}
