package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.ReportRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ReportResponse;
import com.ceycodez.srimatch.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReportResponse>> submitReport(
            @RequestBody @Valid ReportRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReportResponse response = reportService.submitReport(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .success(true)
                .message("Report submitted successfully. Our moderation team will review it shortly.")
                .data(response)
                .build());
    }
}
