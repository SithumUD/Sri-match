package com.ceycodez.srimatch.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ceycodez.srimatch.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email"),
                @UniqueConstraint(columnNames = "phone_number")
        },
        indexes = {
                @Index(name = "idx_email", columnList = "email"),
                @Index(name = "idx_phone", columnList = "phone_number"),
                @Index(name = "idx_role", columnList = "role"),
                @Index(name = "idx_created_at", columnList = "created_at")
        })
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", unique = true, length = 20)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Column(name = "is_email_verified")
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "is_phone_verified")
    @Builder.Default
    private boolean phoneVerified = false;

    @Column(name = "is_profile_completed")
    @Builder.Default
    private boolean profileCompleted = false;

    @Column(name = "is_premium")
    @Builder.Default
    private boolean premium = false;

    @Column(name = "premium_expiry_date")
    private LocalDateTime premiumExpiryDate;

    @Column(name = "referral_code_used")
    private String referralCodeUsed;

    @Column(name = "agree_to_marketing")
    @Builder.Default
    private boolean agreeToMarketing = false;

    @Column(name = "agree_to_terms")
    @Builder.Default
    private boolean agreeToTerms = false;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "failed_login_attempts")
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "account_locked_until")
    private LocalDateTime accountLockedUntil;

    @Column(name = "is_deleted")
    @Builder.Default
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "password_changed_at")
    private LocalDateTime passwordChangedAt;

    @Column(name = "like_limit")
    @Builder.Default
    private Integer likeLimit = 15;

    @Column(name = "likes_used")
    @Builder.Default
    private Integer likesUsed = 0;

    @Column(name = "last_like_reset")
    private LocalDateTime lastLikeReset;

    @Column(name = "is_online")
    @Builder.Default
    private boolean online = false;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "fcm_token")
    private String fcmToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private Profile profile;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Like> sentLikes = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Like> receivedLikes = new ArrayList<>();

    @OneToMany(mappedBy = "user1", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Match> matchesAsUser1 = new ArrayList<>();

    @OneToMany(mappedBy = "user2", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Match> matchesAsUser2 = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Message> receivedMessages = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountLockedUntil == null || accountLockedUntil.isBefore(LocalDateTime.now());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !isDeleted;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public boolean isPremiumActive() {
        return premium && (premiumExpiryDate == null || premiumExpiryDate.isAfter(LocalDateTime.now()));
    }

    public void incrementLikesUsed() {
        if (shouldResetLikes()) {
            likesUsed = 0;
            lastLikeReset = LocalDateTime.now();
        }
        likesUsed++;
    }

    public boolean canSendLike() {
        if (isPremiumActive()) {
            return true;
        }
        if (shouldResetLikes()) {
            return true;
        }
        return likesUsed < likeLimit;
    }

    private boolean shouldResetLikes() {
        if (lastLikeReset == null) {
            return true;
        }
        return lastLikeReset.plusDays(5).isBefore(LocalDateTime.now());
    }
}