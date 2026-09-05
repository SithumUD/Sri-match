package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.AuditLogResponse;
import com.ceycodez.srimatch.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/v1/admin/audits")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminAuditController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAllAudits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String email
    ) {
        String query = (search != null && !search.isBlank()) ? search : email;
        Page<AuditLogResponse> logs = auditLogService.getPaginatedLogs(page, size, query);
        
        return ResponseEntity.ok(ApiResponse.<Page<AuditLogResponse>>builder()
                .success(true)
                .message("Audit logs fetched successfully")
                .data(logs)
                .build());
    }
}
