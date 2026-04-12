package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileSearchRequest {
    // Basic Filters
    private Gender gender;
    private Integer minAge;
    private Integer maxAge;
    private MaritalStatus maritalStatus;
    private Boolean hasChildren;
    private String district;
    private String city;
    private Religion religion;
    private Ethnicity ethnicity;
    private Boolean verifiedOnly;

    // Advanced Filters (Premium Only)
    private EducationLevel educationLevel;
    private String profession;
    private String industry;
    private String incomeRange;
    private Integer minHeight;
    private Integer maxHeight;
    private BodyType bodyType;
    private SmokingHabit smokingHabits;
    private DrinkingHabit drinkingHabits;
    private DietaryPreference dietaryPreference;
    private HoroscopeSign horoscopeSign;
    private String interests;

    // Pagination & Sorting
    @Builder.Default
    private int page = 0;
    @Builder.Default
    private int size = 20;

    @Builder.Default
    private String sortBy = "newest"; // newest, age_asc, age_desc, height_asc, height_desc

    public boolean hasNoFilters() {
        return gender == null && minAge == null && maxAge == null &&
                maritalStatus == null && hasChildren == null &&
                district == null && city == null && religion == null &&
                ethnicity == null && verifiedOnly == null &&
                educationLevel == null && profession == null &&
                industry == null && incomeRange == null &&
                minHeight == null && maxHeight == null &&
                bodyType == null && smokingHabits == null &&
                drinkingHabits == null && dietaryPreference == null &&
                horoscopeSign == null && interests == null;
    }
}
