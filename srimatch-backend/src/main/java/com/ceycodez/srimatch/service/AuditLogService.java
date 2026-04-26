package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.AuditLogResponse;
import com.ceycodez.srimatch.model.AuditLog;
import com.ceycodez.srimatch.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Saves permanent audit trails of all significant administrative actions.
 */
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String adminEmail, Long adminId, String action,
                    String entityType, Long entityId, String details,
                    String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userId(adminId)
                .userEmail(adminEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .success(true)
                .build();
        auditLogRepository.save(log);
    }

    public void logFailure(String email, String action, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userEmail(email)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .success(false)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AuditLogResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getLogsByUser(String email) {
        return auditLogRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(AuditLogResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
