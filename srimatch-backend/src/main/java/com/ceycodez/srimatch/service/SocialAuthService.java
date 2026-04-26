package com.ceycodez.srimatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * Verifies Google and Facebook social login tokens sent from the frontend.
 *
 * Flow:
 * 1. Frontend shows native Google/Facebook login button (using their SDK).
 * 2. On success, frontend receives an ID Token (Google) or Access Token (Facebook).
 * 3. Frontend sends that token to POST /v1/auth/social-login.
 * 4. This service verifies it with the provider's public API.
 * 5. If valid, we locate or create the SriMatch User and return our own JWT.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SocialAuthService {

    private final RestTemplate restTemplate;

    /**
     * Verifies a Google ID Token and extracts the user's email and name.
     * Uses Google's public tokeninfo endpoint.
     */
    public SocialUserInfo verifyGoogleToken(String idToken) {
        String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || body.containsKey("error")) {
                throw new RuntimeException("Invalid Google ID token");
            }

            String email = (String) body.get("email");
            String firstName = (String) body.getOrDefault("given_name", "");
            String lastName = (String) body.getOrDefault("family_name", "");
            String providerId = (String) body.get("sub");

            return new SocialUserInfo(email, firstName, lastName, providerId, "GOOGLE");

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to verify Google token", e);
            throw new RuntimeException("Google authentication failed. Please try again.");
        }
    }

    /**
     * Verifies a Facebook Access Token and extracts user info.
     * Uses Facebook's Graph API.
     */
    public SocialUserInfo verifyFacebookToken(String accessToken) {
        String url = "https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=" + accessToken;
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || body.containsKey("error")) {
                throw new RuntimeException("Invalid Facebook access token");
            }

            String email = (String) body.get("email");
            String firstName = (String) body.getOrDefault("first_name", "");
            String lastName = (String) body.getOrDefault("last_name", "");
            String providerId = (String) body.get("id");

            if (email == null) {
                throw new RuntimeException("Facebook account has no email associated. Please use email/password login.");
            }

            return new SocialUserInfo(email, firstName, lastName, providerId, "FACEBOOK");

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to verify Facebook token", e);
            throw new RuntimeException("Facebook authentication failed. Please try again.");
        }
    }

    public record SocialUserInfo(
            String email,
            String firstName,
            String lastName,
            String providerId,
            String provider
    ) {}
}
