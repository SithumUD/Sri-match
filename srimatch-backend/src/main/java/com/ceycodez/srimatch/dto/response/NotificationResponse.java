package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.Notification;
import com.ceycodez.srimatch.model.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long relatedEntityId;
    private String relatedEntityType;
    private String actionUrl;
    private boolean read;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
    private String senderAvatar;
    private String senderName;

    public static NotificationResponse fromEntity(Notification entity) {
        if (entity == null) return null;

        String actionUrl = entity.getActionUrl();
        if (actionUrl == null || actionUrl.isBlank()) {
            actionUrl = resolveDefaultActionUrl(entity.getType(), entity.getRelatedEntityId());
        }

        return NotificationResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .type(entity.getType())
                .relatedEntityId(entity.getRelatedEntityId())
                .relatedEntityType(entity.getRelatedEntityType())
                .actionUrl(actionUrl)
                .read(entity.isRead())
                .readAt(entity.getReadAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private static String resolveDefaultActionUrl(NotificationType type, Long relatedEntityId) {
        if (type == null) return "/home";
        switch (type) {
            case LIKE_RECEIVED:
            case STAR_LIKE_RECEIVED:
                return "/connections";
            case LIKE_ACCEPTED:
            case MATCH_CREATED:
            case NEW_MESSAGE:
                return "/messages";
            case ACCOUNT_VERIFIED:
                return "/my-profile";
            case PAYMENT_STATUS_UPDATE:
            case PREMIUM_EXPIRING:
            case PREMIUM_ACTIVATED:
            case BOOST_EXPIRED:
                return "/subscription";
            case TIKTOK_PROMOTION_PUBLISHED:
            case TIKTOK_PROMOTION_REJECTED:
            case TIKTOK_PROMOTION_EXPIRED:
                return "/subscription";
            default:
                return "/home";
        }
    }
}
