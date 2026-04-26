package com.ceycodez.srimatch.dto.request;

import lombok.Data;

@Data
public class SocialLoginRequest {
    /** "GOOGLE" or "FACEBOOK" */
    private String provider;
    /** ID Token (Google) or Access Token (Facebook) from the frontend SDK */
    private String token;
}
