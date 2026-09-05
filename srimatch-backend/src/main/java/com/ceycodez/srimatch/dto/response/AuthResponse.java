package com.ceycodez.srimatch.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String role;
    private String email;
    private String firstName;
    private String lastName;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean profileCompleted;
    private boolean hasProfile;
    private boolean verified;
    private Integer profileCompletionScore;
    private boolean rememberMe;
}
