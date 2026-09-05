package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailResponse {

    private UserResponse user;
    private ProfileResponse profile;

    // Likes activity
    private List<AdminLikeItem> sentLikes;
    private List<AdminLikeItem> receivedLikes;
    private long totalSentLikes;
    private long totalReceivedLikes;

    // Reports activity
    private List<AdminReportItem> sentReports;
    private List<AdminReportItem> receivedReports;
    private long totalSentReports;
    private long totalReceivedReports;

    // Subscriptions, Boosts & TikTok history
    private List<SubscriptionResponse> subscriptions;
    private List<TikTokPromotionResponse> tiktokPromotions;
    private List<PaymentResponse> payments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminLikeItem {
        private Long id;
        private Long targetUserId;
        private String targetUserName;
        private String targetUserEmail;
        private String targetUserImage;
        private Integer targetUserAge;
        private String targetUserCity;
        private String type;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminReportItem {
        private Long id;
        private Long otherUserId;
        private String otherUserName;
        private String otherUserEmail;
        private String otherUserImage;
        private String reason;
        private String description;
        private String status;
        private String adminNotes;
        private String evidenceUrls;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;
    }
}
