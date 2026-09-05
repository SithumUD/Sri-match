package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.NotificationResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.repository.NotificationRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public NotificationResponse createNotification(User user, String title, String message, NotificationType type, Long relatedEntityId, String relatedEntityType) {
        return createNotification(user, title, message, type, relatedEntityId, relatedEntityType, null);
    }

    @Transactional
    public NotificationResponse createNotification(User user, String title, String message, NotificationType type, Long relatedEntityId, String relatedEntityType, String actionUrl) {
        com.ceycodez.srimatch.model.Notification notification = com.ceycodez.srimatch.model.Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .actionUrl(actionUrl)
                .build();
        com.ceycodez.srimatch.model.Notification saved = notificationRepository.save(notification);
        NotificationResponse response = NotificationResponse.fromEntity(saved);

        // 1. Broadcast via STOMP WebSocket for real-time in-app delivery
        try {
            if (user != null && user.getEmail() != null) {
                messagingTemplate.convertAndSendToUser(
                        user.getEmail(),
                        "/queue/notifications",
                        response
                );
            }
        } catch (Exception e) {
            log.warn("Could not send WebSocket notification to {}: {}", user != null ? user.getEmail() : "null", e.getMessage());
        }

        // 2. Send Push Notification if FCM token is present
        if (user != null && user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {
            sendPushNotification(user.getFcmToken(), title, message);
        }

        return response;
    }

    private void sendPushNotification(String token, String title, String body) {
        try {
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(notification)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent push notification: {}", response);
        } catch (Exception e) {
            log.warn("Push notification skipped/failed for token {}: {}", token, e.getMessage());
        }
    }

    public Page<NotificationResponse> getNotifications(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(NotificationResponse::fromEntity);
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, User user) {
        com.ceycodez.srimatch.model.Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.markAsRead();
        return NotificationResponse.fromEntity(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user);
    }

    @Transactional
    public void deleteNotification(Long notificationId, User user) {
        com.ceycodez.srimatch.model.Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notificationRepository.delete(notification);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndRead(user, false);
    }
}
