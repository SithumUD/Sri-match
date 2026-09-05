package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private UserRole role;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean profileCompleted;
    private boolean hasProfile;
    private boolean idVerified;
    private String verificationStatus;
    private boolean premium;
    private LocalDateTime premiumExpiryDate;
    private LocalDateTime lastLoginAt;
    private LocalDateTime accountLockedUntil;
    private boolean isDeleted;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
