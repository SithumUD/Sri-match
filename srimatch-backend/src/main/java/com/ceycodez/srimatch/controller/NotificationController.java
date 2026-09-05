package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.NotificationResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.NotificationService;
import com.ceycodez.srimatch.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 20, Sort.by("createdAt").descending());
        Page<NotificationResponse> notifications = notificationService.getNotifications(user, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<NotificationResponse>>builder()
                .success(true)
                .message("Notifications fetched successfully")
                .data(notifications)
                .build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        long unreadCount = notificationService.getUnreadCount(user);

        return ResponseEntity.ok(ApiResponse.<Map<String, Long>>builder()
                .success(true)
                .message("Unread notification count fetched")
                .data(Map.of("unreadCount", unreadCount))
                .build());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        NotificationResponse response = notificationService.markAsRead(id, user);

        return ResponseEntity.ok(ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("Notification marked as read")
                .data(response)
                .build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        notificationService.markAllAsRead(user);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("All notifications marked as read")
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        notificationService.deleteNotification(id, user);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Notification deleted")
                .build());
    }
}
