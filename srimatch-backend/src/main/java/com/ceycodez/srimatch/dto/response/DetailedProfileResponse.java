package com.ceycodez.srimatch.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailedProfileResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private Integer age;
    private String city;
    private LocalDate dateOfBirth;
    private Double latitude;
    private Double longitude;
    private String profession;
    private String education;
    private String religion;
    private String about;
    private List<String> interests;
    private List<String> profileImages;
    private String primaryImageUrl;
    private boolean isVerified;
    private boolean isBoosted;
    private Integer compatibilityScore;

    // Interaction status with the currently logged-in user
    @JsonProperty("interactionType")
    private String interactionType; // NORMAL, STAR, null
    
    @JsonProperty("interactionStatus")
    private String interactionStatus; // PENDING, ACCEPTED, etc., null

    // Basic Details
    private String gender;
    private String maritalStatus;
    private Boolean hasChildren;
    private Integer numberOfChildren;
    private String horoscopeSign;

    // Physical
    private Integer height;
    private String bodyType;
    private String complexion;

    // Lifestyle
    private String smoking;
    private String drinking;
    private String dietaryPreferences;
    private String healthHabits;
    private String lifestyle;

    // Career & Education
    private String industry;
    private String employer;
    private String workLocation;
    private String income;
    private String educationLevel;
    private String fieldOfStudy;
    private String relocationWillingness;

    // Cultural
    private String ethnicity;
    private List<String> languages;
    private String religiousPractices;
    private String culturalValues;

    // Family
    private String familyBackground;
    private String familyType;
    private String familyInvolvement;
    private String weddingPreferences;

    // Additional
    private Map<String, String> favoriteThings;
    private String personalityTraits;
    private String travelPreferences;
    private String dealbreakers;
    private Map<String, Object> partnerPreferences;
    private Map<String, String> quizAnswers;
    
    // Stats
    private Integer profileViews;
    private Integer completionScore;

    // Premium Status
    private boolean premium;
    private java.time.LocalDateTime premiumExpiryDate;
}
