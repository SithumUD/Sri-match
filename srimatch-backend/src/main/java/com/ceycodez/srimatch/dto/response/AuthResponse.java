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
    @JsonIgnore
    private String accessToken;
    @JsonIgnore
    private String refreshToken;
    private String role;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isEmailVerified;
    private boolean isPhoneVerified;
    private boolean isProfileCompleted;
    private boolean hasProfile;
    private Integer profileCompletionScore;
}
