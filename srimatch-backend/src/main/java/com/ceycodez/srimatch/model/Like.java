package com.ceycodez.srimatch.model;

import com.ceycodez.srimatch.model.enums.LikeStatus;
import com.ceycodez.srimatch.model.enums.LikeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"sender_id", "receiver_id"})
        },
        indexes = {
                @Index(name = "idx_sender_id", columnList = "sender_id"),
                @Index(name = "idx_receiver_id", columnList = "receiver_id"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_type", columnList = "type"),
                @Index(name = "idx_created_at", columnList = "created_at")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LikeStatus status = LikeStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private LikeType type = LikeType.NORMAL;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusDays(7);
        }
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isPending() {
        return status == LikeStatus.PENDING;
    }

    public boolean isAccepted() {
        return status == LikeStatus.ACCEPTED;
    }

    public boolean isRejected() {
        return status == LikeStatus.REJECTED;
    }
}