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

@RestController
@RequestMapping("/v1/admin/audits")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminAuditController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAllAudits(@RequestParam(required = false) String email) {
        List<AuditLogResponse> logs;
        if (email != null && !email.isEmpty()) {
            logs = auditLogService.getLogsByUser(email);
        } else {
            logs = auditLogService.getAllLogs();
        }
        
        return ResponseEntity.ok(ApiResponse.<List<AuditLogResponse>>builder()
                .success(true)
                .message("Audit logs fetched successfully")
                .data(logs)
                .build());
    }
}
