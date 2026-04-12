package com.ceycodez.srimatch.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createNotification(User user, String title, String message, NotificationType type, Long relatedEntityId, String relatedEntityType) {
        // Use fully qualified name for local model to avoid conflict with Firebase model
        com.ceycodez.srimatch.model.Notification notification = com.ceycodez.srimatch.model.Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .build();
        notificationRepository.save(notification);

        // Send Push Notification if FCM token is present
        if (user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {
            sendPushNotification(user.getFcmToken(), title, message);
        }
    }

    private void sendPushNotification(String token, String title, String body) {
        try {
            // Use Firebase Notification class
            Notification notification = Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build();

            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(notification)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Successfully sent push notification: " + response);
        } catch (Exception e) {
            log.error("Error sending push notification to token: " + token, e);
        }
    }

    public Page<com.ceycodez.srimatch.model.Notification> getNotifications(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        com.ceycodez.srimatch.model.Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.markAsRead();
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false)
                .forEach(notification -> {
                    notification.markAsRead();
                    notificationRepository.save(notification);
                });
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndRead(user, false);
    }
}
