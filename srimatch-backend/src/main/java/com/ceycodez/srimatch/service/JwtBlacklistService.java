package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.JwtBlacklist;
import com.ceycodez.srimatch.repository.JwtBlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Manages JWT blacklisting for immediate session revocation.
 * When a user logs out or an admin locks an account, the token
 * is stored here and checked on every request by JwtAuthenticationFilter.
 */
@Service
@RequiredArgsConstructor
public class JwtBlacklistService {

    private final JwtBlacklistRepository jwtBlacklistRepository;

    public void blacklistToken(String token, String userEmail, LocalDateTime expiresAt) {
        JwtBlacklist entry = JwtBlacklist.builder()
                .token(token)
                .userEmail(userEmail)
                .expiresAt(expiresAt)
                .build();
        jwtBlacklistRepository.save(entry);
    }

    public boolean isTokenBlacklisted(String token) {
        return jwtBlacklistRepository.existsByToken(token);
    }

    // Runs daily at midnight to purge expired tokens from the database
    @Scheduled(cron = "0 0 0 * * *")
    public void purgeExpiredTokens() {
        jwtBlacklistRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
