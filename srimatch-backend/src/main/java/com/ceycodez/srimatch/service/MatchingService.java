package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.*;
import com.ceycodez.srimatch.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final MatchRepository matchRepository;
    private final NotificationService notificationService;

    /**
     * Calculates the full compatibility score between a searcher and a target profile.
     * Incorporates Layer 2 (Dimensions) and Layer 4 (Boosting).
     */
    public double calculateCompatibility(Profile searcher, Profile target) {
        double compositeScore = 0;

        // Layer 2: Dimensions (Weighted)
        compositeScore += calculateCulturalScore(searcher, target) * 0.25;
        compositeScore += calculateLifestyleScore(searcher, target) * 0.20;
        compositeScore += calculateEducationScore(searcher, target) * 0.15;
        compositeScore += calculateLocationScore(searcher, target) * 0.10;
        compositeScore += calculateInterestsScore(searcher, target) * 0.10;
        compositeScore += calculateDemographicScore(searcher, target) * 0.10;
        compositeScore += calculateFamilyScore(searcher, target) * 0.05;
        compositeScore += calculateQuizScore(searcher, target) * 0.05;

        // Layer 4: Engagement & Recency Boosting
        double boostMultiplier = calculateBoostMultiplier(target);
        
        return compositeScore * boostMultiplier;
    }

    private double calculateCulturalScore(Profile s, Profile t) {
        double score = 0;
        
        // Religion matching
        if (s.getReligion() == t.getReligion()) {
            score += 60;
            // Practices alignment (simplified string matching for now)
            if (s.getReligiousPractices() != null && t.getReligiousPractices() != null) {
                if (s.getReligiousPractices().equals(t.getReligiousPractices())) score += 20;
            }
        } else {
            // Check if searcher is open to other religions (logic to be refined based on preference map)
            score += 10; 
        }

        // Ethnicity matching
        if (s.getEthnicity() == t.getEthnicity()) score += 10;

        // Horoscope matching (simplified standard matrix)
        if (s.getHoroscopeSign() != null && t.getHoroscopeSign() != null) {
            score += getHoroscopeCompatibility(s.getHoroscopeSign(), t.getHoroscopeSign()) * 10;
        }

        return score; // Max 100
    }

    private double calculateLifestyleScore(Profile s, Profile t) {
        double score = 70; // Baseline
        
        if (s.getSmoking() != t.getSmoking()) score -= 20;
        if (s.getDrinking() != t.getDrinking()) score -= 20;
        if (s.getDietaryPreferences() == t.getDietaryPreferences()) score += 30;
        
        return Math.max(0, Math.min(100, score));
    }

    private double calculateEducationScore(Profile s, Profile t) {
        double score = 50;
        if (s.getEducation() == t.getEducation()) score += 30;
        if (s.getIndustry() != null && s.getIndustry().equals(t.getIndustry())) score += 20;
        return score;
    }

    private double calculateLocationScore(Profile s, Profile t) {
        if (s.getDistrict() != null && s.getDistrict().equals(t.getDistrict())) return 100;
        if (s.getRelocationWillingness() == RelocationWillingness.ANYWHERE || 
            t.getRelocationWillingness() == RelocationWillingness.ANYWHERE) return 70;
        return 30;
    }

    private double calculateInterestsScore(Profile s, Profile t) {
        List<String> sInterests = s.getInterests();
        List<String> tInterests = t.getInterests();
        if (sInterests.isEmpty() || tInterests.isEmpty()) return 50;

        long common = sInterests.stream().filter(tInterests::contains).count();
        double jaccard = (double) common / (sInterests.size() + tInterests.size() - common);
        return jaccard * 100;
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

        return Math.max(0, score);
    }

    private double calculateFamilyScore(Profile s, Profile t) {
        return (s.getFamilyType() == t.getFamilyType()) ? 100 : 50;
    }

    private double calculateQuizScore(Profile s, Profile t) {
        Map<String, String> sQuiz = s.getQuizAnswers();
        Map<String, String> tQuiz = t.getQuizAnswers();
        if (sQuiz.isEmpty() || tQuiz.isEmpty()) return 50;

        long matches = sQuiz.entrySet().stream()
                .filter(e -> tQuiz.containsKey(e.getKey()) && tQuiz.get(e.getKey()).equals(e.getValue()))
                .count();
        
        return ((double) matches / sQuiz.size()) * 100;
    }

    private double calculateBoostMultiplier(Profile p) {
        double multiplier = 1.0;

        // Recency Boost
        if (p.getLastActiveAt() != null) {
            long hours = ChronoUnit.HOURS.between(p.getLastActiveAt(), java.time.LocalDateTime.now());
            if (hours < 24) multiplier += 0.5;
            else if (hours < 72) multiplier += 0.3;
            else if (hours < 168) multiplier += 0.1;
            else if (hours > 720) multiplier -= 0.5; // Inactive > 30 days
        }

        // Profile Completion Boost
        if (p.getCompletionScore() != null) {
            multiplier += (p.getCompletionScore() / 100.0) * 0.3;
        }

        // Verification Boost
        if (p.isIdVerified()) multiplier += 0.2;
        
        // Paid Boost
        if (p.isBoosted()) multiplier += 1.0;

        return multiplier;
    }

    private double getHoroscopeCompatibility(HoroscopeSign s1, HoroscopeSign s2) {
        // Simplified standard compatibility: Elements matching
        // Fire: Aries, Leo, Sagittarius
        // Earth: Taurus, Virgo, Capricorn
        // Air: Gemini, Libra, Aquarius
        // Water: Cancer, Scorpio, Pisces
        
        String e1 = getElement(s1);
        String e2 = getElement(s2);
        
        if (e1.equals(e2)) return 1.0;
        if ((e1.equals("Fire") && e2.equals("Air")) || (e1.equals("Air") && e2.equals("Fire"))) return 0.8;
        if ((e1.equals("Earth") && e2.equals("Water")) || (e1.equals("Water") && e2.equals("Earth"))) return 0.8;
        
        return 0.3;
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

    private String getElement(HoroscopeSign sign) {
        return switch (sign) {
            case ARIES, LEO, SAGITTARIUS -> "Fire";
            case TAURUS, VIRGO, CAPRICORN -> "Earth";
            case GEMINI, LIBRA, AQUARIUS -> "Air";
            case CANCER, SCORPIO, PISCES -> "Water";
        };
    }
}
