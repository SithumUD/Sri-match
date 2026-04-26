package com.ceycodez.srimatch.dto.response.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private List<StatCardDTO> kpis;
    private List<ChartDataDTO> revenueTrend;
    private UserDistributionDTO userDistribution;
    private List<RecentRegistrationDTO> recentRegistrations;
    private List<RecentPaymentDTO> recentPayments;
    private List<RecentReportDTO> recentReports;
    private List<ActivityItemDTO> activityFeed;
    private List<SystemHealthDTO> systemHealth;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatCardDTO {
        private String label;
        private String value;
        private String change;
        private boolean up;
        private String icon;
        private String color;
        private String bg;
    }

    @Data
    @AllArgsConstructor
    public static class ChartDataDTO {
        private String month;
        private double value;
    }

    @Data
    @Builder
    public static class UserDistributionDTO {
        private long total;
        private long freeCount;
        private long premiumCount;
        private double freePercent;
        private double premiumPercent;
    }

    @Data
    @Builder
    public static class RecentRegistrationDTO {
        private String id;
        private String name;
        private String email;
        private String joined;
        private String role;
        private String status;
        private boolean premium;
    }

    @Data
    @Builder
    public static class RecentPaymentDTO {
        private String ref;
        private String email;
        private String amount;
        private String method;
        private String status;
        private String date;
    }

    @Data
    @Builder
    public static class RecentReportDTO {
        private String id;
        private String reason;
        private String reported;
        private String status;
        private String date;
    }

    @Data
    @AllArgsConstructor
    public static class ActivityItemDTO {
        private String time;
        private String icon;
        private String msg;
    }

    @Data
    @AllArgsConstructor
    public static class SystemHealthDTO {
        private String name;
        private String status;
        private String ping;
        private String icon;
    }
}
