package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.Report;
import com.ceycodez.srimatch.model.enums.ReportReason;
import com.ceycodez.srimatch.model.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private Long id;
    private Long reporterId;
    private String reporterEmail;
    private Long reportedUserId;
    private String reportedUserEmail;
    private String reportedUserName;
    private ReportReason reason;
    private String description;
    private String evidenceUrls;
    private ReportStatus status;
    private String adminNotes;
    private LocalDateTime resolvedAt;
    private String actionTaken;
    private LocalDateTime createdAt;

    public static ReportResponse fromEntity(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterEmail(report.getReporter().getEmail())
                .reportedUserId(report.getReportedUser().getId())
                .reportedUserEmail(report.getReportedUser().getEmail())
                .reportedUserName(report.getReportedUser().getFirstName() + " " + report.getReportedUser().getLastName())
                .reason(report.getReason())
                .description(report.getDescription())
                .evidenceUrls(report.getEvidenceUrls())
                .status(report.getStatus())
                .adminNotes(report.getAdminNotes())
                .resolvedAt(report.getResolvedAt())
                .actionTaken(report.getActionTaken())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
