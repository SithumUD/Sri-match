package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String email;
    private boolean isEmailVerified;
    private boolean isPhoneVerified;
    private boolean isProfileCompleted;
    private boolean hasProfile;
    private Integer profileCompletionScore;
}
