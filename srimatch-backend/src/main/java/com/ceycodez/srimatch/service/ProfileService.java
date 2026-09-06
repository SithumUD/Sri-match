package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.ProfileRequest;
import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
import com.ceycodez.srimatch.dto.response.CursorPageResponse;
import com.ceycodez.srimatch.dto.response.ProfileResponse;
import com.ceycodez.srimatch.dto.response.DetailedProfileResponse;
import com.ceycodez.srimatch.dto.response.PublicProfileResponse;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.ProfileView;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.Like;
import com.ceycodez.srimatch.model.enums.LikeStatus;
import com.ceycodez.srimatch.model.enums.LikeType;
import com.ceycodez.srimatch.repository.LikeRepository;
import com.ceycodez.srimatch.repository.ProfileRepository;
import com.ceycodez.srimatch.repository.ProfileViewRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.repository.specification.ProfileSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final MatchingService matchingService;
    private final ProfileViewRepository profileViewRepository;
    private final LikeRepository likeRepository;

    @Transactional
    public ProfileResponse createOrUpdateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Cannot create profile without verifying email address");
        }

        // Update User basic info
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(new Profile());

        if (profile.getId() == null) {
            profile.setUser(user);
        }

        // Copy matching properties from DTO to entity ignoring nulls using BeanUtils or manually
        BeanUtils.copyProperties(request, profile);

        int completionScore = calculateCompletionScore(profile);
        profile.setCompletionScore(completionScore);
        
        Profile savedProfile = profileRepository.save(profile);

        if (!user.isProfileCompleted()) {
            user.setProfileCompleted(true);
            userRepository.save(user);
        }

        return mapToResponse(savedProfile);
    }

    @Transactional
    public ProfileResponse adminUpdateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Admin can update regardless of verification status
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(new Profile());

        if (profile.getId() == null) {
            profile.setUser(user);
        }

        BeanUtils.copyProperties(request, profile);
        
        int completionScore = calculateCompletionScore(profile);
        profile.setCompletionScore(completionScore);

        Profile savedProfile = profileRepository.save(profile);
        
        if (!user.isProfileCompleted()) {
            user.setProfileCompleted(true);
            userRepository.save(user);
        }

        return mapToResponse(savedProfile);
    }

    @Transactional
    public ProfileResponse uploadProfileImage(String email, MultipartFile file, boolean isPrimary) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found. Please create profile first."));
        
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            
            if (profile.getProfileImages() == null) {
                profile.setProfileImages(new ArrayList<>());
            }
            
            profile.getProfileImages().add(imageUrl);
            
            if (isPrimary || profile.getPrimaryImageUrl() == null) {
                profile.setPrimaryImageUrl(imageUrl);
            }
            
            Profile savedProfile = profileRepository.save(profile);
            return mapToResponse(savedProfile);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public ProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
                
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    private ProfileResponse mapToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        BeanUtils.copyProperties(profile, response);
        response.setUserId(profile.getUser().getId());
        response.setFirstName(profile.getUser().getFirstName());
        response.setLastName(profile.getUser().getLastName());
        response.setEmail(profile.getUser().getEmail());
        response.setPhone(profile.getUser().getPhoneNumber());
        response.setPhoneNumber(profile.getUser().getPhoneNumber());
        response.setAge(profile.getAge());
        response.setProfileCompleted(profile.getUser().isProfileCompleted());
        response.setPremium(profile.getUser().isPremiumActive());
        response.setPremiumExpiryDate(profile.getUser().getPremiumExpiryDate());
        return response;
    }

    public Page<PublicProfileResponse> searchProfiles(ProfileSearchRequest request, String currentUserEmail) {
        boolean isPremium = false;
        Profile searcher = null;
        User currentUser = null;
        if (currentUserEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(currentUserEmail);
            if (userOpt.isPresent()) {
                currentUser = userOpt.get();
                isPremium = currentUser.isPremiumActive();
                searcher = currentUser.getProfile();
            }
        }
        final Profile finalSearcher = searcher;

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), Sort.unsorted());
        Specification<Profile> spec = ProfileSpecification.buildSpecification(request, finalSearcher, isPremium);
        Page<Profile> profiles = profileRepository.findAll(spec, pageable);

        Map<Long, Like> interactionMap = new HashMap<>();
        if (currentUser != null) {
            Long senderId = currentUser.getId();
            List<Long> receiverIds = profiles.getContent().stream()
                    .map(p -> p.getUser().getId()).collect(Collectors.toList());
            if (!receiverIds.isEmpty()) {
                List<Like> interactions = likeRepository.findBySenderIdAndReceiverIdIn(senderId, receiverIds);
                interactions.forEach(l -> interactionMap.put(l.getReceiver().getId(), l));
            }
        }

        List<PublicProfileResponse> responseList = profiles.stream()
                .map(p -> mapToPublicResponse(p, finalSearcher, interactionMap.get(p.getUser().getId())))
                .collect(Collectors.toList());

        if (responseList.size() > 2) {
            return new PageImpl<>(applyDiversityFilter(responseList), pageable, profiles.getTotalElements());
        }
        return new PageImpl<>(responseList, pageable, profiles.getTotalElements());
    }

    /**
    /**
     * Production cursor-based (keyset) discovery endpoint.
     *
     * Ranking priority for all sort modes:
     *   1. Primary sort field (if selected: newest, age_asc/desc, height_asc/desc)
     *   2. Active boost (is_boosted = true AND boost not expired) — always a secondary factor
     *   3. Completion score (DESC) — higher profile completeness ranks higher
     *   4. Profile ID (DESC) — stable deterministic tiebreaker, prevents cursor instability
     *
     * Uses dedicated native @Query methods per sort mode so the ORDER BY (including
     * the CASE WHEN boost expression) is hardcoded in SQL and cannot be overridden
     * by Spring Data JPA's internal sort handling.
     */
    @Transactional(readOnly = true)
    public CursorPageResponse<PublicProfileResponse> searchProfilesCursor(
            ProfileSearchRequest request, String cursor, int limit, String email) {

        int pageSize = (limit > 0 && limit <= 50) ? limit : 20;

        User currentUser = null;
        Profile searcher = null;
        if (email != null) {
            currentUser = userRepository.findByEmail(email).orElse(null);
            if (currentUser != null) {
                searcher = currentUser.getProfile();
            }
        }
        final Profile finalSearcher = searcher;

        String sortBy = (request.getSortBy() != null && !request.getSortBy().isBlank())
                ? request.getSortBy().toLowerCase().trim()
                : "none";

        // ── Extract filter params for native queries ──────────────────────────────
        Long excludeId = (searcher != null) ? searcher.getId() : null;
        String gender = request.getGender() != null ? request.getGender().name() : null;
        String maritalStatus = request.getMaritalStatus() != null ? request.getMaritalStatus().name() : null;
        String district = (request.getDistrict() != null && !request.getDistrict().isBlank()) ? request.getDistrict().trim() : null;
        String city = (request.getCity() != null && !request.getCity().isBlank()) ? request.getCity().trim() : null;
        String religion = request.getReligion() != null ? request.getReligion().name() : null;
        String ethnicity = request.getEthnicity() != null ? request.getEthnicity().name() : null;
        String educationLevel = request.getEducationLevel() != null ? request.getEducationLevel().name() : null;
        String smokingHabits = request.getSmokingHabits() != null ? request.getSmokingHabits().name() : null;
        String drinkingHabits = request.getDrinkingHabits() != null ? request.getDrinkingHabits().name() : null;
        String dietaryPreference = request.getDietaryPreference() != null ? request.getDietaryPreference().name() : null;
        String bodyType = request.getBodyType() != null ? request.getBodyType().name() : null;
        String interests = null;
        if (request.getInterests() != null && !request.getInterests().isBlank()) {
            String[] parts = request.getInterests().split(",");
            List<String> cleaned = java.util.Arrays.stream(parts)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(s -> s.replaceAll("[\\[\\](){}.*+?^$|\\\\]", "\\\\$0"))
                    .collect(Collectors.toList());
            if (!cleaned.isEmpty()) {
                interests = "(" + String.join("|", cleaned) + ")";
            }
        }
        String profession = (request.getProfession() != null && !request.getProfession().isBlank()) ? request.getProfession().trim() : null;
        String industry = (request.getIndustry() != null && !request.getIndustry().isBlank()) ? request.getIndustry().trim() : null;

        // ── Parse pageIndex from opaque cursor ───────────────────────────────────
        int pageIndex = parsePageIndex(cursor, sortBy);
        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        // ── Dispatch to correct native query per sort mode ────────────────────────
        Page<Profile> page;
        switch (sortBy) {
            case "newest":
                page = profileRepository.findDiscoveryNewest(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
            case "age_asc":
                page = profileRepository.findDiscoveryAgeAsc(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
            case "age_desc":
                page = profileRepository.findDiscoveryAgeDesc(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
            case "height_asc":
                page = profileRepository.findDiscoveryHeightAsc(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
            case "height_desc":
                page = profileRepository.findDiscoveryHeightDesc(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
            default:
                // Dynamic discovery: boost → completionScore → random → id
                page = profileRepository.findDiscoveryDynamic(
                    excludeId, gender, request.getMinAge(), request.getMaxAge(),
                    maritalStatus, request.getHasChildren(), district, city,
                    religion, ethnicity, request.getVerifiedOnly(),
                    request.getMinHeight(), request.getMaxHeight(),
                    educationLevel, smokingHabits, drinkingHabits, dietaryPreference,
                    request.getIncomeRange(), bodyType, interests,
                    profession, industry, pageable);
                break;
        }

        List<Profile> resultProfiles = page.getContent();
        boolean hasMore = page.hasNext();

        // ── Batch fetch interactions (no N+1) ─────────────────────────────────────
        Map<Long, Like> interactionMap = new HashMap<>();
        if (currentUser != null && !resultProfiles.isEmpty()) {
            Long senderId = currentUser.getId();
            List<Long> receiverIds = resultProfiles.stream()
                    .map(p -> p.getUser().getId()).collect(Collectors.toList());
            List<Like> interactions = likeRepository.findBySenderIdAndReceiverIdIn(senderId, receiverIds);
            interactions.forEach(l -> interactionMap.put(l.getReceiver().getId(), l));
        }

        List<PublicProfileResponse> responseList = resultProfiles.stream()
                .map(p -> mapToPublicResponse(p, finalSearcher, interactionMap.get(p.getUser().getId())))
                .collect(Collectors.toList());

        // ── Encode next cursor token ──────────────────────────────────────────────
        String nextCursor = hasMore ? encodeCursor(sortBy, pageIndex + 1) : null;

        // Apply diversity filter ONLY when in dynamic discovery mode.
        // Explicit sorts (newest, age, height) must preserve strict order.
        List<PublicProfileResponse> items = "none".equals(sortBy)
                ? applyDiversityFilter(responseList)
                : responseList;

        return CursorPageResponse.<PublicProfileResponse>builder()
                .items(items)
                .nextCursor(nextCursor)
                .hasMore(hasMore)
                .count(responseList.size())
                .build();
    }

    private List<PublicProfileResponse> applyDiversityFilter(List<PublicProfileResponse> list) {
        if (list.size() <= 2) return list;

        List<PublicProfileResponse> prioritised = new ArrayList<>();
        List<PublicProfileResponse> moved = new ArrayList<>();
        Map<String, Integer> comboCount = new HashMap<>();

        for (PublicProfileResponse p : list) {
            String combo = (p.getProfession() != null ? p.getProfession() : "unknown")
                    + "|" + (p.getDistrict() != null ? p.getDistrict() : "unknown");
            int count = comboCount.getOrDefault(combo, 0);
            if (count < 2) {
                prioritised.add(p);
                comboCount.put(combo, count + 1);
            } else {
                moved.add(p);
            }
        }

        prioritised.addAll(moved);
        return prioritised;
    }

    private int parsePageIndex(String cursor, String currentSortBy) {
        if (cursor == null || cursor.isBlank()) {
            return 0;
        }
        try {
            String decoded = new String(java.util.Base64.getUrlDecoder().decode(cursor), java.nio.charset.StandardCharsets.UTF_8);
            String[] parts = decoded.split(":");
            if (parts.length >= 3 && "v1".equals(parts[0])) {
                if (parts[1].equalsIgnoreCase(currentSortBy)) {
                    return Integer.parseInt(parts[2]);
                }
                return 0;
            }
            return Integer.parseInt(decoded);
        } catch (Exception e) {
            return 0;
        }
    }

    private String encodeCursor(String sortBy, int nextPageIndex) {
        String raw = "v1:" + sortBy + ":" + nextPageIndex;
        return java.util.Base64.getUrlEncoder().withoutPadding()
                .encodeToString(raw.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    @Transactional
    public DetailedProfileResponse getDetailedProfile(Long profileId, String viewerEmail) {
        Profile profile = profileRepository.findById(profileId)
                .or(() -> profileRepository.findByUserId(profileId))
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        Profile searcher = null;
        Like interaction = null;
        if (viewerEmail != null) {
            User viewer = userRepository.findByEmail(viewerEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            searcher = viewer.getProfile();
            
            // Layer 3: Tracking (Log View)
            ProfileView view = ProfileView.builder()
                    .viewer(viewer)
                    .viewedProfile(profile)
                    .build();
            profileViewRepository.save(view);
            
            // Increment profile view count
            Integer currentViews = profile.getProfileViews();
            profile.setProfileViews((currentViews != null ? currentViews : 0) + 1);
            profileRepository.save(profile);

            // Fetch interaction status
            interaction = likeRepository.findBySenderAndReceiver(viewer, profile.getUser())
                    .orElse(null);
        }
        
        return mapToDetailedResponse(profile, searcher, interaction);
    }

    private DetailedProfileResponse mapToDetailedResponse(Profile profile, Profile searcher, Like interaction) {
        Integer compatibilityScore = null;
        if (searcher != null) {
            compatibilityScore = (int) Math.round(matchingService.calculateCompatibility(searcher, profile));
        }

        return DetailedProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .firstName(profile.getUser().getFirstName())
                .lastName(profile.getUser().getLastName())
                .age(profile.getAge())
                .city(profile.getCity())
                .district(profile.getDistrict())
                .dateOfBirth(profile.getDateOfBirth())
                .timeOfBirth(profile.getTimeOfBirth())
                .latitude(profile.getLatitude())
                .longitude(profile.getLongitude())
                .profession(profile.getProfession())
                .education(profile.getEducation() != null ? profile.getEducation().name() : null)
                .religion(profile.getReligion() != null ? profile.getReligion().name() : null)
                .about(profile.getAbout())
                .interests(profile.getInterests())
                .profileImages(profile.getProfileImages())
                .primaryImageUrl(profile.getPrimaryImageUrl())
                .isVerified(profile.isIdVerified())
                .isBoosted(profile.isBoosted())
                .compatibilityScore(compatibilityScore)
                // Interaction
                .interactionType(interaction != null ? interaction.getType().name() : null)
                .interactionStatus(interaction != null ? interaction.getStatus().name() : null)
                // Basic Details
                .gender(profile.getGender() != null ? profile.getGender().name() : null)
                .maritalStatus(profile.getMaritalStatus() != null ? profile.getMaritalStatus().name() : null)
                .hasChildren(profile.getHasChildren())
                .numberOfChildren(profile.getNumberOfChildren())
                .horoscopeSign(calculateHoroscopeSign(profile.getDateOfBirth()))
                // Physical
                .height(profile.getHeight())
                .bodyType(profile.getBodyType() != null ? profile.getBodyType().name() : null)
                .complexion(profile.getComplexion() != null ? profile.getComplexion().name() : null)
                // Lifestyle
                .smoking(profile.getSmoking() != null ? profile.getSmoking().name() : null)
                .drinking(profile.getDrinking() != null ? profile.getDrinking().name() : null)
                .dietaryPreferences(profile.getDietaryPreferences() != null ? profile.getDietaryPreferences().name() : null)
                .healthHabits(profile.getHealthHabits())
                .lifestyle(profile.getLifestyle())
                // Career & Education
                .industry(profile.getIndustry())
                .employer(profile.getEmployer())
                .workLocation(profile.getWorkLocation())
                .income(profile.getIncome())
                .educationLevel(profile.getEducation() != null ? profile.getEducation().name() : null)
                .fieldOfStudy(profile.getFieldOfStudy())
                .relocationWillingness(profile.getRelocationWillingness() != null ? profile.getRelocationWillingness().name() : null)
                // Cultural
                .ethnicity(profile.getEthnicity() != null ? profile.getEthnicity().name() : null)
                .languages(profile.getLanguages())
                .religiousPractices(profile.getReligiousPractices())
                .culturalValues(profile.getCulturalValues())
                // Family
                .familyBackground(profile.getFamilyBackground())
                .familyType(profile.getFamilyType() != null ? profile.getFamilyType().name() : null)
                .familyInvolvement(profile.getFamilyInvolvement())
                .weddingPreferences(profile.getWeddingPreferences())
                // Additional
                .partnerPreferences(profile.getPartnerPreferences())
                .favoriteThings(profile.getFavoriteThings())
                .personalityTraits(profile.getPersonalityTraits())
                .travelPreferences(profile.getTravelPreferences())
                .dealbreakers(profile.getDealbreakers())
                .quizAnswers(profile.getQuizAnswers())
                // Stats
                .profileViews(profile.getProfileViews())
                .completionScore(profile.getCompletionScore())
                .premium(profile.getUser().isPremiumActive())
                .premiumExpiryDate(profile.getUser().getPremiumExpiryDate())
                .build();
    }

    public static String calculateHoroscopeSign(LocalDate dob) {
        if (dob == null) return null;
        int day = dob.getDayOfMonth();
        int month = dob.getMonthValue();
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries (Mesha)";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus (Vrishabha)";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini (Mithuna)";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer (Kataka)";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo (Simha)";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo (Kanya)";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra (Thula)";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio (Vrischika)";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius (Dhanu)";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn (Makara)";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius (Kumbha)";
        return "Pisces (Meena)";
    }

    private PublicProfileResponse mapToPublicResponse(Profile profile, Profile searcher, Like interaction) {
        Integer compatibilityScore = null;
        if (searcher != null) {
            compatibilityScore = (int) Math.round(matchingService.calculateCompatibility(searcher, profile));
        }
 
        return PublicProfileResponse.builder()
                .id(profile.getId())
                .firstName(profile.getUser().getFirstName())
                .age(profile.getAge())
                .city(profile.getCity())
                .district(profile.getDistrict())
                .profession(profile.getProfession())
                .education(profile.getEducation() != null ? profile.getEducation().name() : null)
                .religion(profile.getReligion() != null ? profile.getReligion().name() : null)
                .about(profile.getAbout() != null && profile.getAbout().length() > 100 
                        ? profile.getAbout().substring(0, 100) + "..." 
                        : profile.getAbout())
                .interests(profile.getInterests() != null && profile.getInterests().size() > 3 
                        ? profile.getInterests().subList(0, 3) 
                        : profile.getInterests())
                .profileImage(profile.getPrimaryImageUrl())
                .isVerified(profile.isIdVerified())
                .isBoosted(profile.isBoosted())
                .compatibilityScore(compatibilityScore)
                .interactionType(interaction != null ? interaction.getType().name() : null)
                .interactionStatus(interaction != null ? interaction.getStatus().name() : null)
                .build();
    }

    public ProfileResponse setPrimaryImage(String email, String imageUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
                
        if (profile.getProfileImages() != null && profile.getProfileImages().contains(imageUrl)) {
            profile.setPrimaryImageUrl(imageUrl);
            Profile saved = profileRepository.save(profile);
            return mapToResponse(saved);
        }
        throw new RuntimeException("Image not found in profile");
    }

    public ProfileResponse deleteImage(String email, String imageUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
                
        if (profile.getProfileImages() != null) {
            profile.getProfileImages().remove(imageUrl);
            if (imageUrl.equals(profile.getPrimaryImageUrl())) {
                profile.setPrimaryImageUrl(profile.getProfileImages().isEmpty() ? null : profile.getProfileImages().get(0));
            }
            Profile saved = profileRepository.save(profile);
            return mapToResponse(saved);
        }
        return mapToResponse(profile);
    }

    public com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse getCompletionStatus(User user) {
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        if (profile == null) {
            return com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.builder()
                    .score(0)
                    .isComplete(false)
                    .missingFields(List.of("Basic Information", "Profile Photos", "Education & Career", "About & Bio", "Partner Preferences"))
                    .topRecommendation("Complete your basic profile details to appear in match searches.")
                    .visibilityImpact("0% discovery visibility")
                    .build();
        }

        List<com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus> sections = new ArrayList<>();
        List<String> missingFields = new ArrayList<>();

        // 1. Basic details (20)
        List<String> basicMissing = new ArrayList<>();
        if (profile.getGender() == null) basicMissing.add("Gender");
        if (profile.getDateOfBirth() == null) basicMissing.add("Date of Birth");
        if (profile.getCity() == null) basicMissing.add("City");
        boolean basicComplete = basicMissing.isEmpty();
        if (!basicComplete) missingFields.add("Basic Information (" + basicMissing.size() + " missing)");
        sections.add(com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus.builder()
                .sectionName("Basic Details")
                .weight(20)
                .completed(basicComplete)
                .missingItems(basicMissing)
                .build());

        // 2. Photos (20)
        List<String> photoMissing = new ArrayList<>();
        if (profile.getProfileImages() == null || profile.getProfileImages().isEmpty()) photoMissing.add("Profile Photos");
        boolean photoComplete = photoMissing.isEmpty();
        if (!photoComplete) missingFields.add("Profile Photos (+20% views)");
        sections.add(com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus.builder()
                .sectionName("Profile Photos")
                .weight(20)
                .completed(photoComplete)
                .missingItems(photoMissing)
                .build());

        // 3. Education & Career (20)
        List<String> eduMissing = new ArrayList<>();
        if (profile.getEducation() == null) eduMissing.add("Education");
        if (profile.getProfession() == null) eduMissing.add("Profession");
        boolean eduComplete = eduMissing.isEmpty();
        if (!eduComplete) missingFields.add("Education & Career");
        sections.add(com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus.builder()
                .sectionName("Education & Career")
                .weight(20)
                .completed(eduComplete)
                .missingItems(eduMissing)
                .build());

        // 4. Bio & Interests (20)
        List<String> bioMissing = new ArrayList<>();
        if (profile.getAbout() == null || profile.getAbout().isBlank()) bioMissing.add("About Me");
        if (profile.getInterests() == null || profile.getInterests().isEmpty()) bioMissing.add("Interests");
        boolean bioComplete = bioMissing.isEmpty();
        if (!bioComplete) missingFields.add("Bio & Interests");
        sections.add(com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus.builder()
                .sectionName("Bio & Interests")
                .weight(20)
                .completed(bioComplete)
                .missingItems(bioMissing)
                .build());

        // 5. Partner Preferences (20)
        List<String> prefMissing = new ArrayList<>();
        if (profile.getPartnerPreferences() == null || profile.getPartnerPreferences().isEmpty()) prefMissing.add("Partner Preferences");
        boolean prefComplete = prefMissing.isEmpty();
        if (!prefComplete) missingFields.add("Partner Preferences");
        sections.add(com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.SectionStatus.builder()
                .sectionName("Partner Preferences")
                .weight(20)
                .completed(prefComplete)
                .missingItems(prefMissing)
                .build());

        int score = calculateCompletionScore(profile);
        String topRecommendation;
        if (!photoComplete) {
            topRecommendation = "Upload at least 2 clear profile photos to gain up to 300% more likes and match requests.";
        } else if (!prefComplete) {
            topRecommendation = "Specify your partner preferences to get higher accuracy AI match compatibility scores.";
        } else if (!bioComplete) {
            topRecommendation = "Write a brief description in 'About Me' to let potential matches know more about your personality.";
        } else {
            topRecommendation = "Your profile is fully complete! Boost your profile for maximum discovery.";
        }

        String impact = score >= 90 ? "Maximum Search Ranking" : (score >= 60 ? "Moderate Search Ranking" : "Low Search Ranking (Needs Completion)");

        return com.ceycodez.srimatch.dto.response.ProfileCompletionStatusResponse.builder()
                .score(score)
                .isComplete(score >= 80)
                .sections(sections)
                .missingFields(missingFields)
                .topRecommendation(topRecommendation)
                .visibilityImpact(impact)
                .build();
    }

    private int calculateCompletionScore(Profile profile) {
        int score = 20; // Base score for creating profile
        
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) score += 10;
        if (profile.getProfileImages() != null && !profile.getProfileImages().isEmpty()) score += 20;
        if (profile.getEducation() != null) score += 10;
        if (profile.getProfession() != null) score += 10;
        if (profile.getInterests() != null && !profile.getInterests().isEmpty()) score += 10;
        if (profile.getPartnerPreferences() != null && !profile.getPartnerPreferences().isEmpty()) score += 20;
        
        return Math.min(score, 100);
    }
}
