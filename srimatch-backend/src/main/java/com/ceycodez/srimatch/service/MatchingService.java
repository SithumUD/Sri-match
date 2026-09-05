package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.*;
import com.ceycodez.srimatch.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final MatchRepository matchRepository;
    private final NotificationService notificationService;
    private final Optional<StringRedisTemplate> redisTemplate;

    // In-memory fallback cache if Redis is unavailable
    private final Map<String, CachedScore> localScoreCache = new ConcurrentHashMap<>();
    private static final Duration CACHE_TTL = Duration.ofHours(24);

    private record CachedScore(double score, LocalDateTime expiresAt) {}

    /**
     * Calculates or retrieves cached compatibility score between a searcher and a target profile.
     */
    public double calculateCompatibility(Profile searcher, Profile target) {
        if (searcher == null || target == null || searcher.getId() == null || target.getId() == null) {
            return computeScore(searcher, target);
        }

        String cacheKey = "compat:" + searcher.getId() + ":" + target.getId();

        // 1. Try Redis cache
        if (redisTemplate.isPresent()) {
            try {
                String cached = redisTemplate.get().opsForValue().get(cacheKey);
                if (cached != null) {
                    return Double.parseDouble(cached);
                }
            } catch (Exception e) {
                log.debug("Redis cache read skipped: {}", e.getMessage());
            }
        }

        // 2. Try In-Memory cache fallback
        CachedScore local = localScoreCache.get(cacheKey);
        if (local != null && local.expiresAt().isAfter(LocalDateTime.now())) {
            return local.score();
        }

        // 3. Compute score
        double score = computeScore(searcher, target);

        // 4. Store in cache
        if (redisTemplate.isPresent()) {
            try {
                redisTemplate.get().opsForValue().set(cacheKey, String.valueOf(score), CACHE_TTL);
            } catch (Exception e) {
                log.debug("Redis cache write skipped: {}", e.getMessage());
            }
        }
        localScoreCache.put(cacheKey, new CachedScore(score, LocalDateTime.now().plus(CACHE_TTL)));

        return score;
    }

    /**
     * Invalidates cached compatibility scores when a user's profile is updated.
     */
    public void evictUserCompatibilityCache(Long profileId) {
        if (profileId == null) return;
        localScoreCache.keySet().removeIf(k -> k.contains(":" + profileId + ":") || k.endsWith(":" + profileId));
        if (redisTemplate.isPresent()) {
            try {
                Set<String> keys1 = redisTemplate.get().keys("compat:" + profileId + ":*");
                Set<String> keys2 = redisTemplate.get().keys("compat:*:" + profileId);
                if (keys1 != null && !keys1.isEmpty()) redisTemplate.get().delete(keys1);
                if (keys2 != null && !keys2.isEmpty()) redisTemplate.get().delete(keys2);
            } catch (Exception e) {
                log.debug("Redis cache eviction skipped: {}", e.getMessage());
            }
        }
    }

    private double computeScore(Profile searcher, Profile target) {
        if (searcher == null || target == null) return 0;
        double compositeScore = 0;

        // Layer 2: Dimensions (Weighted, sums to 1.0)
        compositeScore += calculateCulturalScore(searcher, target) * 0.25;
        compositeScore += calculateLifestyleScore(searcher, target) * 0.20;
        compositeScore += calculateEducationScore(searcher, target) * 0.15;
        compositeScore += calculateLocationScore(searcher, target) * 0.10;
        compositeScore += calculateInterestsScore(searcher, target) * 0.10;
        compositeScore += calculateDemographicScore(searcher, target) * 0.10;
        compositeScore += calculateFamilyScore(searcher, target) * 0.05;
        compositeScore += calculateQuizScore(searcher, target) * 0.05;

        // Compatibility score must be a true percentage strictly bounded between 0% and 100%
        return Math.max(0.0, Math.min(100.0, compositeScore));
    }

    private double calculateCulturalScore(Profile s, Profile t) {
        double score = 0;
        
        // Religion matching
        if (s.getReligion() != null && t.getReligion() != null && s.getReligion() == t.getReligion()) {
            score += 60;
            // Practices alignment
            if (s.getReligiousPractices() != null && t.getReligiousPractices() != null) {
                if (s.getReligiousPractices().equalsIgnoreCase(t.getReligiousPractices())) score += 20;
            }
        } else {
            // Baseline for different religions
            score += 10; 
        }

        // Ethnicity matching
        if (s.getEthnicity() != null && t.getEthnicity() != null && s.getEthnicity() == t.getEthnicity()) {
            score += 20;
        }

        return Math.max(0.0, Math.min(100.0, score)); // Max 100
    }

    private double calculateLifestyleScore(Profile s, Profile t) {
        double score = 70; // Baseline
        
        if (s.getSmoking() != null && t.getSmoking() != null && s.getSmoking() != t.getSmoking()) score -= 20;
        if (s.getDrinking() != null && t.getDrinking() != null && s.getDrinking() != t.getDrinking()) score -= 20;
        if (s.getDietaryPreferences() != null && t.getDietaryPreferences() != null && s.getDietaryPreferences() == t.getDietaryPreferences()) score += 30;
        
        return Math.max(0.0, Math.min(100.0, score));
    }

    private double calculateEducationScore(Profile s, Profile t) {
        double score = 50;
        if (s.getEducation() != null && t.getEducation() != null && s.getEducation() == t.getEducation()) score += 30;
        if (s.getIndustry() != null && t.getIndustry() != null && s.getIndustry().equalsIgnoreCase(t.getIndustry())) score += 20;
        return Math.max(0.0, Math.min(100.0, score));
    }

    private double calculateLocationScore(Profile s, Profile t) {
        if (s.getCity() != null && t.getCity() != null && s.getCity().equalsIgnoreCase(t.getCity())) return 100;
        if (s.getRelocationWillingness() == RelocationWillingness.ANYWHERE || 
            t.getRelocationWillingness() == RelocationWillingness.ANYWHERE) return 70;
        return 30;
    }

    private double calculateInterestsScore(Profile s, Profile t) {
        List<String> sInterests = s.getInterests();
        List<String> tInterests = t.getInterests();
        if (sInterests == null || tInterests == null || sInterests.isEmpty() || tInterests.isEmpty()) return 50;

        long common = sInterests.stream().filter(tInterests::contains).count();
        double jaccard = (double) common / (sInterests.size() + tInterests.size() - common);
        return Math.max(0.0, Math.min(100.0, jaccard * 100));
    }

    private double calculateDemographicScore(Profile s, Profile t) {
        double score = 100;
        
        // Age Difference
        if (s.getAge() != null && t.getAge() != null) {
            int diff = Math.abs(s.getAge() - t.getAge());
            if (diff > 10) score -= 50;
            else if (diff > 5) score -= 20;
        }

        // Height (Traditional preference: man taller)
        if (s.getGender() == Gender.FEMALE && t.getGender() == Gender.MALE) {
            if (t.getHeight() != null && s.getHeight() != null && t.getHeight() <= s.getHeight()) score -= 20;
        }

        return Math.max(0.0, Math.min(100.0, score));
    }

    private double calculateFamilyScore(Profile s, Profile t) {
        return (s.getFamilyType() != null && t.getFamilyType() != null && s.getFamilyType() == t.getFamilyType()) ? 100 : 50;
    }

    private double calculateQuizScore(Profile s, Profile t) {
        Map<String, String> sQuiz = s.getQuizAnswers();
        Map<String, String> tQuiz = t.getQuizAnswers();
        if (sQuiz == null || tQuiz == null || sQuiz.isEmpty() || tQuiz.isEmpty()) return 50;

        long matches = sQuiz.entrySet().stream()
                .filter(e -> tQuiz.containsKey(e.getKey()) && Objects.equals(tQuiz.get(e.getKey()), e.getValue()))
                .count();
        
        return Math.max(0.0, Math.min(100.0, ((double) matches / sQuiz.size()) * 100));
    }

    @Transactional
    public Match createMatch(User u1, User u2, Long likeId) {
        // Double check if match already exists
        return matchRepository.findByUsers(u1, u2)
                .orElseGet(() -> {
                    Match match = Match.builder()
                            .user1(u1)
                            .user2(u2)
                            .likeId(likeId)
                            .status(MatchStatus.ACTIVE)
                            .matchedAt(LocalDateTime.now())
                            .build();
                    
                    if (u1.getProfile() != null && u2.getProfile() != null) {
                        match.setCompatibilityScore((int) calculateCompatibility(u1.getProfile(), u2.getProfile()));
                    }
                    
                    match = matchRepository.save(match);
                    
                    // Notify both users
                    notificationService.createNotification(
                            u1,
                            "New Match!",
                            "You matched with " + u2.getFullName() + "!",
                            NotificationType.MATCH_CREATED,
                            match.getId(),
                            "MATCH"
                    );
                    
                    notificationService.createNotification(
                            u2,
                            "New Match!",
                            "You matched with " + u1.getFullName() + "!",
                            NotificationType.MATCH_CREATED,
                            match.getId(),
                            "MATCH"
                    );
                    
                    return match;
                });
    }
}
