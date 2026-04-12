package com.ceycodez.srimatch.model;

import com.ceycodez.srimatch.model.enums.MessageStatus;
import com.ceycodez.srimatch.model.enums.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages",
        indexes = {
                @Index(name = "idx_match_id", columnList = "match_id"),
                @Index(name = "idx_sender_id", columnList = "sender_id"),
                @Index(name = "idx_receiver_id", columnList = "receiver_id"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_created_at", columnList = "created_at"),
                @Index(name = "idx_is_premium_message", columnList = "is_premium_message")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private Match match; // Null for premium direct messages without match

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MessageStatus status = MessageStatus.SENT;

    @Column(name = "is_read")
    @Builder.Default
    private boolean read = false;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "is_premium_message")
    @Builder.Default
    private boolean premiumMessage = false;

    @Column(name = "is_delivered")
    @Builder.Default
    private boolean delivered = false;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "is_deleted_by_sender")
    @Builder.Default
    private boolean deletedBySender = false;

    @Column(name = "is_deleted_by_receiver")
    @Builder.Default
    private boolean deletedByReceiver = false;

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    @Column(name = "media_type", length = 50)
    private String mediaType;

    @Column(name = "media_size")
    private Long mediaSize;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public boolean isDirectPremiumMessage() {
        return premiumMessage && match == null;
    }

    public boolean isVisibleToUser(Long userId) {
        if (userId.equals(sender.getId())) {
            return !deletedBySender;
        }
        if (userId.equals(receiver.getId())) {
            return !deletedByReceiver;
        }
        return false;
    }
}