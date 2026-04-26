package com.ceycodez.srimatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Verifies Cloudflare Turnstile CAPTCHA tokens.
 * Since Cloudflare sits in front of your production server, it already provides
 * DDoS protection at the network layer. This service adds an extra application-layer
 * check to prevent bot account creation / brute force login attempts.
 *
 * In dev mode (if secret key is not configured), verification is skipped.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CaptchaVerificationService {

    private static final String TURNSTILE_VERIFY_URL =
            "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    @Value("${cloudflare.turnstile.secret-key:}")
    private String secretKey;

    @Value("${cloudflare.turnstile.enabled:false}")
    private boolean enabled;

    private final RestTemplate restTemplate;

    /**
     * Verifies the Turnstile token from the client.
     * @param token  the cf-turnstile-response token sent by the frontend
     * @param remoteIp  the client's IP address for additional verification
     * @throws RuntimeException if the CAPTCHA is invalid (when enabled)
     */
    public void verify(String token, String remoteIp) {
        if (!enabled) {
            log.debug("Cloudflare Turnstile verification is disabled (dev mode)");
            return;
        }

        if (token == null || token.isBlank()) {
            throw new RuntimeException("CAPTCHA token is required");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("secret", secretKey);
        body.put("response", token);
        if (remoteIp != null) {
            body.put("remoteip", remoteIp);
        }

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    TURNSTILE_VERIFY_URL, entity, Map.class);

            if (response.getBody() == null || !Boolean.TRUE.equals(response.getBody().get("success"))) {
                log.warn("Turnstile CAPTCHA verification failed for IP: {}", remoteIp);
                throw new RuntimeException("CAPTCHA verification failed. Please try again.");
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error calling Cloudflare Turnstile API", e);
            throw new RuntimeException("CAPTCHA service unavailable. Please try again shortly.");
        }
    }
}
