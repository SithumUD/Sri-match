package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.enums.*;
import com.ceycodez.srimatch.repository.MatchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private NotificationService notificationService;

    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        matchingService = new MatchingService(matchRepository, notificationService, Optional.empty());
    }

    @Test
    @DisplayName("Compatibility score is strictly between 0 and 100")
    void testCompatibilityScoreRange() {
        Profile p1 = Profile.builder()
                .id(1L)
                .religion(Religion.BUDDHIST)
                .ethnicity(Ethnicity.SINHALESE)
                .city("Colombo")
                .interests(List.of("Travel", "Music", "Reading"))
                .education(EducationLevel.BACHELORS)
                .industry("Technology")
                .smoking(SmokingHabit.NEVER)
                .drinking(DrinkingHabit.NEVER)
                .dietaryPreferences(DietaryPreference.VEGETARIAN)
                .dateOfBirth(java.time.LocalDate.now().minusYears(28))
                .gender(Gender.MALE)
                .height(175)
                .familyType(FamilyType.NUCLEAR)
                .build();

        Profile p2 = Profile.builder()
                .id(2L)
                .religion(Religion.BUDDHIST)
                .ethnicity(Ethnicity.SINHALESE)
                .city("Colombo")
                .interests(List.of("Travel", "Music", "Cooking"))
                .education(EducationLevel.BACHELORS)
                .industry("Technology")
                .smoking(SmokingHabit.NEVER)
                .drinking(DrinkingHabit.NEVER)
                .dietaryPreferences(DietaryPreference.VEGETARIAN)
                .dateOfBirth(java.time.LocalDate.now().minusYears(26))
                .gender(Gender.FEMALE)
                .height(165)
                .familyType(FamilyType.NUCLEAR)
                .build();

        double score = matchingService.calculateCompatibility(p1, p2);

        assertTrue(score >= 0.0, "Score should be >= 0");
        assertTrue(score <= 100.0, "Score should never exceed 100%");
        assertTrue(score > 70.0, "High compatibility profiles should score high");
    }

    @Test
    @DisplayName("Handles null fields gracefully without NullPointerException")
    void testNullFieldsSafety() {
        Profile p1 = Profile.builder()
                .id(1L)
                .interests(null)
                .quizAnswers(null)
                .build();

        Profile p2 = Profile.builder()
                .id(2L)
                .interests(null)
                .quizAnswers(null)
                .build();

        assertDoesNotThrow(() -> {
            double score = matchingService.calculateCompatibility(p1, p2);
            assertTrue(score >= 0.0 && score <= 100.0);
        });
    }
}
