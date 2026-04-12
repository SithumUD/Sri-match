package com.ceycodez.srimatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyOtpRequest {
    @NotBlank(message = "Identifier (Email or Phone) is required")
    private String identifier;
    
    @NotBlank(message = "OTP is required")
    private String otp;
}
