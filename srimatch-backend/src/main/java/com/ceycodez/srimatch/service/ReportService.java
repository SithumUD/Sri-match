package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.ReportActionRequest;
import com.ceycodez.srimatch.dto.request.ReportRequest;
import com.ceycodez.srimatch.dto.response.ReportResponse;
import com.ceycodez.srimatch.model.Report;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.ReportStatus;
import com.ceycodez.srimatch.repository.ReportRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(ReportResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ReportResponse getReportById(Long id) {
        return reportRepository.findById(id)
                .map(ReportResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Transactional
    public ReportResponse updateReportStatus(Long id, ReportActionRequest request, String adminEmail) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        report.setStatus(request.getStatus());
        report.setAdminNotes(request.getAdminNotes());
        report.setActionTaken(request.getActionTaken());
        
        if (request.getStatus() == ReportStatus.RESOLVED || request.getStatus() == ReportStatus.DISMISSED) {
            report.setResolvedAt(LocalDateTime.now());
            report.setResolvedBy(admin);
        }

        return ReportResponse.fromEntity(reportRepository.save(report));
    }

    @Transactional
    public ReportResponse submitReport(ReportRequest request, String reporterEmail) {
        User reporter = userRepository.findByEmail(reporterEmail)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        User reportedUser = userRepository.findById(request.getReportedUserId())
                .orElseThrow(() -> new RuntimeException("Reported user not found"));

        if (reporter.getId().equals(reportedUser.getId())) {
            throw new RuntimeException("You cannot report yourself");
        }

        Report report = Report.builder()
                .reporter(reporter)
                .reportedUser(reportedUser)
                .reason(request.getReason())
                .description(request.getDescription())
                .evidenceUrls(request.getEvidenceUrls())
                .status(ReportStatus.PENDING)
                .build();

        return ReportResponse.fromEntity(reportRepository.save(report));
    }
}
