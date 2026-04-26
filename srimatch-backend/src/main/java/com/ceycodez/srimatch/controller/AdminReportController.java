package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.ReportActionRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ReportResponse;
import com.ceycodez.srimatch.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports() {
        List<ReportResponse> response = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.<List<ReportResponse>>builder()
                .success(true)
                .message("All reports fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReport(@PathVariable Long id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .success(true)
                .message("Report fetched successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/action")
    public ResponseEntity<ApiResponse<ReportResponse>> takeAction(
            @PathVariable Long id,
            @RequestBody ReportActionRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReportResponse response = reportService.updateReportStatus(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .success(true)
                .message("Report action updated successfully")
                .data(response)
                .build());
    }
}
