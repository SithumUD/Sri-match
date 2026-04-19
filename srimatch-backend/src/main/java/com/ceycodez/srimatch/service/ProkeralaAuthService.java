package com.ceycodez.srimatch.service;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProkeralaAuthService {

    private final RestTemplate restTemplate;

    @Value("${prokerala.api.client-id}")
    private String clientId;

    @Value("${prokerala.api.client-secret}")
    private String clientSecret;

    @Value("${prokerala.api.auth-url}")
    private String authUrl;

    private String accessToken;
    private Instant expiryTime;

    public String getAccessToken() {
        if (accessToken != null && expiryTime != null && Instant.now().isBefore(expiryTime.minusSeconds(60))) {
            return accessToken;
        }

        return refreshAccessToken();
    }

    private synchronized String refreshAccessToken() {
        // Double check after acquiring lock
        if (accessToken != null && expiryTime != null && Instant.now().isBefore(expiryTime.minusSeconds(60))) {
            return accessToken;
        }

        log.info("Refreshing Prokerala API access token");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "client_credentials");
        map.add("client_id", clientId);
        map.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<TokenResponse> response = restTemplate.postForEntity(authUrl, request, TokenResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                this.accessToken = response.getBody().getAccess_token();
                // Expire slightly earlier than actual to be safe
                this.expiryTime = Instant.now().plusSeconds(response.getBody().getExpires_in());
                log.info("Successfully refreshed Prokerala API access token. Expires in {} seconds", response.getBody().getExpires_in());
                return this.accessToken;
            } else {
                throw new RuntimeException("Failed to get Prokerala access token: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error refreshing Prokerala access token: {}", e.getMessage());
            throw new RuntimeException("Prokerala API Authentication failed", e);
        }
    }

    @Data
    private static class TokenResponse {
        private String access_token;
        private String token_type;
        private long expires_in;
    }
}
