package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.AuditLogResponse;
import com.ceycodez.srimatch.model.AuditLog;
import com.ceycodez.srimatch.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Page<AuditLogResponse> getPaginatedLogs(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 15, Sort.by("createdAt").descending());
        Page<AuditLog> auditPage;
        if (search != null && !search.trim().isBlank()) {
            auditPage = auditLogRepository.searchAudits(search.trim(), pageable);
        } else {
            auditPage = auditLogRepository.findAll(pageable);
        }
        return auditPage.map(AuditLogResponse::fromEntity);
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
