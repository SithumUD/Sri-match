package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ProfileRequest {
    @NotBlank(message = "First name is mandatory")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotNull(message = "Marital status is required")
    private MaritalStatus maritalStatus;

    private Boolean hasChildren;
    private Integer numberOfChildren;

    private String city;
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
    private RelocationWillingness relocationWillingness;

    private Integer height; // in cm
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
    private FamilyType familyType;

    private String about;
    private List<String> interests;
    private Map<String, String> favoriteThings;
    private String travelPreferences;
    private String personalityTraits;

    private Map<String, Object> partnerPreferences;
    private String dealbreakers;
    
    private Map<String, String> quizAnswers;
}
