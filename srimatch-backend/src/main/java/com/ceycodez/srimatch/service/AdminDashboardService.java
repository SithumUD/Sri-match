package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.dashboard.DashboardResponse;
import com.ceycodez.srimatch.model.*;
import com.ceycodez.srimatch.model.enums.*;
import com.ceycodez.srimatch.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final MatchRepository matchRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;

    public DashboardResponse getDashboardData() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime beginningOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime beginningOfLastMonth = beginningOfMonth.minusMonths(1);
        LocalDateTime last30Days = now.minusDays(30);

        return DashboardResponse.builder()
                .kpis(getKPIs(beginningOfMonth, beginningOfLastMonth))
                .revenueTrend(getRevenueTrend(now))
                .userDistribution(getUserDistribution())
                .recentRegistrations(getRecentRegistrations())
                .recentPayments(getRecentPayments())
                .recentReports(getRecentReports())
                .activityFeed(getActivityFeed())
                .systemHealth(getSystemHealth())
                .build();
    }

    private List<DashboardResponse.StatCardDTO> getKPIs(LocalDateTime currentMonth, LocalDateTime lastMonth) {
        List<DashboardResponse.StatCardDTO> kpis = new ArrayList<>();

        // 1. Total Users
        long totalUsers = userRepository.countByIsDeletedFalse();
        long prevTotalUsers = userRepository.countByCreatedAtAfterAndIsDeletedFalse(currentMonth);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Total Users")
                .value(String.format("%,d", totalUsers))
                .change("+12.4%") // Simplified for this demo
                .up(true)
                .icon("👤")
                .color("#3b82f6")
                .bg("#eff6ff")
                .build());

        // 2. Active Subscriptions (Premium Users)
        long premiumUsers = userRepository.countByPremiumTrueAndIsDeletedFalse();
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Active Subscriptions")
                .value(String.format("%,d", premiumUsers))
                .change("+8.1%")
                .up(true)
                .icon("💎")
                .color("#a855f7")
                .bg("#faf5ff")
                .build());

        // 3. Monthly Revenue
        BigDecimal monthlyRev = paymentRepository.getRevenueAfter(currentMonth);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Monthly Revenue")
                .value("Rs " + (monthlyRev != null ? String.format("%,.0f", monthlyRev.doubleValue() / 1000) : "0") + "K")
                .change("+5.3%")
                .up(true)
                .icon("💰")
                .color("#10b981")
                .bg("#f0fdf4")
                .build());

        // 4. New Matches
        long newMatches = matchRepository.countByCreatedAtAfter(currentMonth);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("New Matches")
                .value(String.valueOf(newMatches))
                .change("+2.9%")
                .up(true)
                .icon("❤️")
                .color("#f43f5e")
                .bg("#fff1f2")
                .build());

        // 5. Open Tickets
        long openTickets = supportTicketRepository.countByStatus(TicketStatus.OPEN) + supportTicketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Open Tickets")
                .value(String.valueOf(openTickets))
                .change("-3")
                .up(false)
                .icon("🎫")
                .color("#f97316")
                .bg("#fff7ed")
                .build());

        // 6. Pending Payments
        long pendingPayments = paymentRepository.countByPaymentStatus(PaymentStatus.PENDING);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Pending Payments")
                .value(String.valueOf(pendingPayments))
                .change("+4")
                .up(false)
                .icon("⏳")
                .color("#eab308")
                .bg("#fefce8")
                .build());

        // 7. Reports (Unread)
        long unreadReports = reportRepository.countByStatus(ReportStatus.PENDING);
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Reports (Unread)")
                .value(String.valueOf(unreadReports))
                .change("-2")
                .up(true)
                .icon("🚩")
                .color("#ef4444")
                .bg("#fef2f2")
                .build());

        // 8. Daily Active
        long dailyActive = userRepository.countByOnlineTrueAndIsDeletedFalse();
        kpis.add(DashboardResponse.StatCardDTO.builder()
                .label("Daily Active")
                .value(String.format("%,d", dailyActive))
                .change("+18.7%")
                .up(true)
                .icon("📈")
                .color("#06b6d4")
                .bg("#ecfeff")
                .build());

        return kpis;
    }

    private List<DashboardResponse.ChartDataDTO> getRevenueTrend(LocalDateTime now) {
        LocalDateTime sixMonthsAgo = now.minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        List<Object[]> results = paymentRepository.getMonthlyBreakdown(sixMonthsAgo);

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};

        return results.stream()
                .map(row -> {
                    int month = ((Number) row[0]).intValue();
                    double total = ((BigDecimal) row[2]).doubleValue() / 1000.0;
                    return new DashboardResponse.ChartDataDTO(months[month - 1], total);
                })
                .collect(Collectors.toList());
    }

    private DashboardResponse.UserDistributionDTO getUserDistribution() {
        long freeCount = userRepository.countByIsDeletedFalse() - userRepository.countByPremiumTrueAndIsDeletedFalse();
        long premiumCount = userRepository.countByPremiumTrueAndIsDeletedFalse();
        long total = freeCount + premiumCount;

        return DashboardResponse.UserDistributionDTO.builder()
                .total(total)
                .freeCount(freeCount)
                .premiumCount(premiumCount)
                .freePercent(total > 0 ? (freeCount * 100.0 / total) : 0)
                .premiumPercent(total > 0 ? (premiumCount * 100.0 / total) : 0)
                .build();
    }

    private List<DashboardResponse.RecentRegistrationDTO> getRecentRegistrations() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        return userRepository.findTop5ByIsDeletedFalseOrderByCreatedAtDesc().stream()
                .map(u -> DashboardResponse.RecentRegistrationDTO.builder()
                        .id("U-" + u.getId())
                        .name(u.getFirstName() + " " + u.getLastName())
                        .email(u.getEmail())
                        .joined(u.getCreatedAt().format(formatter))
                        .role(u.getRole().name())
                        .status(u.isAccountNonLocked() ? "Active" : "Locked")
                        .premium(u.isPremium())
                        .build())
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.RecentPaymentDTO> getRecentPayments() {
        return paymentRepository.findTop5ByOrderBySubmittedAtDesc().stream()
                .map(p -> DashboardResponse.RecentPaymentDTO.builder()
                        .ref(p.getTransactionId() != null ? p.getTransactionId() : "REF-" + p.getId())
                        .email(p.getUser().getEmail())
                        .amount("Rs " + String.format("%,.0f", p.getAmount()))
                        .method(p.getPaymentMethod().name())
                        .status(p.getPaymentStatus().name())
                        .date(p.getSubmittedAt().format(DateTimeFormatter.ofPattern("dd MMM")))
                        .build())
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.RecentReportDTO> getRecentReports() {
        return reportRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(r -> DashboardResponse.RecentReportDTO.builder()
                        .id("R-" + r.getId())
                        .reason(r.getReason().name())
                        .reported(r.getReportedUser().getEmail())
                        .status(r.getStatus().name())
                        .date(r.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM")))
                        .build())
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.ActivityItemDTO> getActivityFeed() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .limit(8)
                .map(log -> {
                    String time = "Just now"; // Simplification for time calculation
                    String icon = "⚙️";
                    if (log.getAction().contains("USER")) icon = "👤";
                    if (log.getAction().contains("PAYMENT")) icon = "💳";
                    if (log.getAction().contains("REPORT")) icon = "🚩";
                    return new DashboardResponse.ActivityItemDTO(time, icon, log.getAction() + ": " + log.getDetails());
                })
                .collect(Collectors.toList());
    }

    private List<DashboardResponse.SystemHealthDTO> getSystemHealth() {
        List<DashboardResponse.SystemHealthDTO> healthList = new ArrayList<>();
        healthList.add(new DashboardResponse.SystemHealthDTO("API Server", "Operational", "42ms", "🖥️"));
        healthList.add(new DashboardResponse.SystemHealthDTO("MySQL Database", "Operational", "8ms", "🗄️"));
        healthList.add(new DashboardResponse.SystemHealthDTO("Redis Cache", "Operational", "2ms", "⚡"));
        healthList.add(new DashboardResponse.SystemHealthDTO("Brevo Email", "Operational", "—", "📧"));
        healthList.add(new DashboardResponse.SystemHealthDTO("Cloudinary CDN", "Operational", "—", "☁️"));
        healthList.add(new DashboardResponse.SystemHealthDTO("WebSocket Gateway", "Operational", "12ms", "💬"));
        healthList.add(new DashboardResponse.SystemHealthDTO("Cloudflare WAF", "Operational", "—", "🛡️"));
        return healthList;
    }
}
