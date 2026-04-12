package com.ceycodez.srimatch.model;

import com.ceycodez.srimatch.util.JsonListConverter;
import com.ceycodez.srimatch.util.JsonMapConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ceycodez.srimatch.model.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "profiles", indexes = {
        @Index(name = "idx_gender", columnList = "gender"),
        @Index(name = "idx_religion", columnList = "religion"),
        @Index(name = "idx_district", columnList = "district"),
        @Index(name = "idx_marital_status", columnList = "marital_status"),
        @Index(name = "idx_completion_score", columnList = "completion_score"),
        @Index(name = "idx_last_active", columnList = "last_active_at")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonBackReference
    private User user;

    // Basic Information
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "marital_status")
    private MaritalStatus maritalStatus;

    @Column(name = "has_children")
    private Boolean hasChildren;

    @Column(name = "number_of_children")
    private Integer numberOfChildren;

    // Location Information
    @Column(length = 100)
    private String district;

    @Column(length = 100)
    private String city;

    @Column(name = "place_of_birth", length = 100)
    private String placeOfBirth;

    // Cultural & Religious Information
    @Enumerated(EnumType.STRING)
    private Religion religion;

    @Column(name = "religious_practices", columnDefinition = "TEXT")
    private String religiousPractices;

    @Enumerated(EnumType.STRING)
    private Ethnicity ethnicity;

    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private List<String> languages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "horoscope_sign")
    private HoroscopeSign horoscopeSign;

    @Column(name = "birth_star", length = 50)
    private String birthStar;

    @Column(name = "horoscope_details", columnDefinition = "TEXT")
    private String horoscopeDetails;

    // Education & Career
    @Enumerated(EnumType.STRING)
    private EducationLevel education;

    @Column(name = "field_of_study", length = 100)
    private String fieldOfStudy;

    @Column(length = 100)
    private String profession;

    @Column(length = 100)
    private String industry;

    @Column(length = 200)
    private String employer;

    @Column(name = "work_location", length = 100)
    private String workLocation;

    @Column(name = "income_range", length = 50)
    private String income;

    @Enumerated(EnumType.STRING)
    @Column(name = "relocation_willingness")
    @Builder.Default
    private RelocationWillingness relocationWillingness = RelocationWillingness.NOT_WILLING;

    // Physical Attributes
    private Integer height;

    @Enumerated(EnumType.STRING)
    @Column(name = "body_type")
    private BodyType bodyType;

    @Enumerated(EnumType.STRING)
    private Complexion complexion;

    // Lifestyle
    @Enumerated(EnumType.STRING)
    private SmokingHabit smoking;

    @Enumerated(EnumType.STRING)
    private DrinkingHabit drinking;

    @Enumerated(EnumType.STRING)
    @Column(name = "dietary_preferences")
    private DietaryPreference dietaryPreferences;

    @Column(name = "health_habits", columnDefinition = "TEXT")
    private String healthHabits;

    @Column(columnDefinition = "TEXT")
    private String lifestyle;

    // Family & Cultural
    @Column(name = "family_background", columnDefinition = "TEXT")
    private String familyBackground;

    @Column(name = "cultural_values", columnDefinition = "TEXT")
    private String culturalValues;

    @Column(name = "family_involvement", columnDefinition = "TEXT")
    private String familyInvolvement;

    @Column(name = "wedding_preferences", columnDefinition = "TEXT")
    private String weddingPreferences;

    @Enumerated(EnumType.STRING)
    @Column(name = "family_type")
    @Builder.Default
    private FamilyType familyType = FamilyType.NUCLEAR;

    // About Me
    @Column(columnDefinition = "TEXT")
    private String about;

    @Convert(converter = JsonListConverter.class)
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private List<String> interests = new ArrayList<>();

    @Convert(converter = JsonMapConverter.class)
    @Column(name = "favorite_things", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, String> favoriteThings = new HashMap<>();

    @Column(name = "travel_preferences", columnDefinition = "TEXT")
    private String travelPreferences;

    @Column(name = "personality_traits", length = 500)
    private String personalityTraits;

    // Partner Preferences
    @Convert(converter = JsonMapConverter.class)
    @Column(name = "partner_preferences", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, Object> partnerPreferences = new HashMap<>();

    @Column(columnDefinition = "TEXT")
    private String dealbreakers;

    // Photos
    @Convert(converter = JsonListConverter.class)
    @Column(name = "profile_images", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> profileImages = new ArrayList<>();

    @Column(name = "primary_image_url", length = 500)
    private String primaryImageUrl;

    // Quiz Answers
    @Convert(converter = JsonMapConverter.class)
    @Column(name = "quiz_answers", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, String> quizAnswers = new HashMap<>();

    // Verification Status
    @Convert(converter = JsonMapConverter.class)
    @Column(name = "verification_status", columnDefinition = "TEXT")
    @Builder.Default
    private Map<String, Boolean> verificationStatus = new HashMap<>();

    // Matching & Analytics
    @Column(name = "completion_score")
    @Builder.Default
    private Integer completionScore = 0;

    @Column(name = "is_boosted")
    @Builder.Default
    private boolean isBoosted = false;

    @Column(name = "id_verified")
    @Builder.Default
    private boolean idVerified = false;

    @Column(name = "profile_views")
    @Builder.Default
    private Integer profileViews = 0;

    @Column(name = "last_active_at")
    private LocalDateTime lastActiveAt;

    @Column(name = "is_visible")
    @Builder.Default
    private boolean visible = true;

    @Column(name = "is_deleted")
    @Builder.Default
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Integer getAge() {
        if (dateOfBirth == null) return null;
        return LocalDate.now().getYear() - dateOfBirth.getYear();
    }
}