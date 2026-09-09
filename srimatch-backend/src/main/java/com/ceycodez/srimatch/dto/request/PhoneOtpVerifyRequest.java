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
public class PhoneOtpVerifyRequest {
    @NotBlank(message = "OTP code is required")
    private String otp;
}
