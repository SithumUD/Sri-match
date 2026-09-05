package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.JwtBlacklist;
import com.ceycodez.srimatch.repository.JwtBlacklistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;

/**
 * Manages JWT blacklisting for immediate session revocation.
 * Blacklists tokens by SHA-256 hash to protect against database leaks
 * and enable fast O(1) indexed lookups.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtBlacklistService {

    private final JwtBlacklistRepository jwtBlacklistRepository;

    public void blacklistToken(String token, String userEmail, LocalDateTime expiresAt) {
        if (token == null || token.isBlank()) return;
        String tokenHash = hashToken(token);
        JwtBlacklist entry = JwtBlacklist.builder()
                .token(tokenHash)
                .userEmail(userEmail)
                .expiresAt(expiresAt)
                .build();
        jwtBlacklistRepository.save(entry);
    }

    public boolean isTokenBlacklisted(String token) {
        if (token == null || token.isBlank()) return false;
        String tokenHash = hashToken(token);
        return jwtBlacklistRepository.existsByToken(tokenHash) || jwtBlacklistRepository.existsByToken(token);
    }

    // Runs daily at midnight to purge expired tokens from the database
    @Scheduled(cron = "0 0 0 * * *")
    public void purgeExpiredTokens() {
        jwtBlacklistRepository.deleteExpiredTokens(LocalDateTime.now());
    }

    public static String hashToken(String token) {
        if (token == null) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (byte b : encodedhash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 not supported: {}", e.getMessage());
            return token;
        }
    }
}
