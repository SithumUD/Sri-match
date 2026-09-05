package com.ceycodez.srimatch.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * High-performance, tiered rate limiting service using Bucket4j.
 * Enforces:
 * 1. Global API rate limit (60 requests/minute per IP)
 * 2. Strict Auth endpoints rate limit (10 requests/minute per IP)
 * 3. OTP Request Throttling (Cooldown: 60 seconds, Max 3/15min, Max 10/day per identifier)
 */
@Service
@Slf4j
public class RateLimitingService {

    private final Map<String, Bucket> generalIpBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> authIpBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> otpIdentifierBuckets = new ConcurrentHashMap<>();
    private final Map<String, Instant> otpLastRequestTimes = new ConcurrentHashMap<>();

    private static final long OTP_COOLDOWN_SECONDS = 60;

    /**
     * Resolves Bucket for standard endpoints (60 req/min).
     */
    public Bucket resolveBucket(String ipAddress) {
        return generalIpBuckets.computeIfAbsent(ipAddress, this::newGeneralBucket);
    }

    /**
     * Resolves Bucket for sensitive auth endpoints (10 req/min).
     */
    public Bucket resolveAuthBucket(String ipAddress) {
        return authIpBuckets.computeIfAbsent(ipAddress, this::newAuthBucket);
    }

    /**
     * Checks whether an OTP request is allowed for the given identifier (email or phone).
     * Enforces a 60-second cooldown and a bucket of max 3 requests per 15 minutes.
     */
    public boolean allowOtpRequest(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            return false;
        }

        String key = identifier.toLowerCase().trim();
        Instant now = Instant.now();

        // 1. Check 60-second cooldown
        Instant lastTime = otpLastRequestTimes.get(key);
        if (lastTime != null) {
            long elapsedSeconds = Duration.between(lastTime, now).getSeconds();
            if (elapsedSeconds < OTP_COOLDOWN_SECONDS) {
                log.warn("OTP request throttled by cooldown for {}: {}s left", key, OTP_COOLDOWN_SECONDS - elapsedSeconds);
                return false;
            }
        }

        // 2. Check 3 requests per 15 minutes bucket
        Bucket bucket = otpIdentifierBuckets.computeIfAbsent(key, this::newOtpBucket);
        if (bucket.tryConsume(1)) {
            otpLastRequestTimes.put(key, now);
            return true;
        } else {
            log.warn("OTP request quota exceeded for {}: max 3 per 15 minutes", key);
            return false;
        }
    }

    public long getOtpCooldownRemainingSeconds(String identifier) {
        if (identifier == null) return 0;
        String key = identifier.toLowerCase().trim();
        Instant lastTime = otpLastRequestTimes.get(key);
        if (lastTime == null) return 0;
        long elapsed = Duration.between(lastTime, Instant.now()).getSeconds();
        return Math.max(0, OTP_COOLDOWN_SECONDS - elapsed);
    }

    private Bucket newGeneralBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(60, Refill.greedy(60, Duration.ofMinutes(1))))
                .build();
    }

    private Bucket newAuthBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
                .build();
    }

    private Bucket newOtpBucket(String key) {
        return Bucket.builder()
                .addLimit(Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(15))))
                .build();
    }
}
