package com.ceycodez.srimatch.model;

import com.ceycodez.srimatch.model.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches",
        indexes = {
                @Index(name = "idx_user1_id", columnList = "user1_id"),
                @Index(name = "idx_user2_id", columnList = "user2_id"),
                @Index(name = "idx_status", columnList = "status"),
                @Index(name = "idx_created_at", columnList = "created_at"),
                @Index(name = "idx_compatibility_score", columnList = "compatibility_score")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "like_id")
    private Long likeId; // Reference to the like that created this match

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MatchStatus status = MatchStatus.ACTIVE;

    @Column(name = "compatibility_score")
    @Builder.Default
    private Integer compatibilityScore = 0;

    @Column(name = "user1_notified")
    @Builder.Default
    private boolean user1Notified = false;

    @Column(name = "user2_notified")
    @Builder.Default
    private boolean user2Notified = false;

    @Column(name = "matched_at")
    private LocalDateTime matchedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "end_reason", length = 100)
    private String endReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (matchedAt == null) {
            matchedAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusDays(30); // Match expires after 30 days of inactivity
        }
    }

    public User getOtherUser(Long userId) {
        if (user1.getId().equals(userId)) {
            return user2;
        }
        return user1;
    }

    public boolean isActive() {
        return status == MatchStatus.ACTIVE && (expiresAt == null || LocalDateTime.now().isBefore(expiresAt));
    }

    public boolean canSendMessage(User user) {
        return isActive() && (user.getId().equals(user1.getId()) || user.getId().equals(user2.getId()));
    }
}