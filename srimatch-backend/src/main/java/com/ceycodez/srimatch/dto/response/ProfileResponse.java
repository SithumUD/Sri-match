package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.*;
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
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String phoneNumber;
    
    private Gender gender;
    private LocalDate dateOfBirth;
    private LocalTime timeOfBirth;
    private Integer age;
    private MaritalStatus maritalStatus;
    private Boolean hasChildren;
    private Integer numberOfChildren;

    private String district;
    private String city;
    private String placeOfBirth;
    private Double latitude;
    private Double longitude;

    private Religion religion;
    private String religiousPractices;
    private Ethnicity ethnicity;
    private List<String> languages;

    private EducationLevel education;
    private String fieldOfStudy;
    private String profession;
    private String industry;
    private String employer;
    private String workLocation;
    private String income;

    private Integer height;
    private BodyType bodyType;
    private Complexion complexion;

    private SmokingHabit smoking;
    private DrinkingHabit drinking;
    private DietaryPreference dietaryPreferences;
    
    private String healthHabits;
    private String lifestyle;
    private String familyBackground;
    private String culturalValues;
    private String familyInvolvement;
    private String weddingPreferences;

    private String about;
    private List<String> interests;
    private Map<String, String> favoriteThings;
    private String travelPreferences;
    private String personalityTraits;

    private Map<String, Object> partnerPreferences;
    private String dealbreakers;

    private List<String> profileImages;
    private String primaryImageUrl;
    private Map<String, String> quizAnswers;
    private Map<String, Boolean> verificationStatus;

    private Integer completionScore;
    private boolean visible;
    private boolean profileCompleted;

    // Premium Status
    private boolean premium;
    private java.time.LocalDateTime premiumExpiryDate;
}
