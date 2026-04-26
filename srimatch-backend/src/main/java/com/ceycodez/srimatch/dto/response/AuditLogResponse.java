package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private String userAgent;
    private String requestMethod;
    private String requestUrl;
    private Integer statusCode;
    private Long responseTimeMs;
    private boolean success;
    private LocalDateTime createdAt;

    public static AuditLogResponse fromEntity(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .requestMethod(log.getRequestMethod())
                .requestUrl(log.getRequestUrl())
                .statusCode(log.getStatusCode())
                .responseTimeMs(log.getResponseTimeMs())
                .success(log.isSuccess())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
