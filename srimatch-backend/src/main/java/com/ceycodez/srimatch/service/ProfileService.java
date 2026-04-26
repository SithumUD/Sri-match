package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.ProfileRequest;
import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
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
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
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

    private ProfileResponse mapToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        BeanUtils.copyProperties(profile, response);
        response.setUserId(profile.getUser().getId());
        response.setFirstName(profile.getUser().getFirstName());
        response.setLastName(profile.getUser().getLastName());
        response.setAge(profile.getAge());
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

        // Handle Sorting
        Sort sort = Sort.unsorted();
        String sortBy = request.getSortBy() != null ? request.getSortBy().toLowerCase() : "newest";
        boolean shuffle = false;

        // If no filters are provided, the user wants random display
        if (request.hasNoFilters() || "random".equals(sortBy)) {
            shuffle = true;
        } else {
            switch (sortBy) {
                case "age_asc":
                    sort = Sort.by(Sort.Direction.DESC, "dateOfBirth");
                    break;
                case "age_desc":
                    sort = Sort.by(Sort.Direction.ASC, "dateOfBirth");
                    break;
                case "height_asc":
                    sort = Sort.by(Sort.Direction.ASC, "height");
                    break;
                case "height_desc":
                    sort = Sort.by(Sort.Direction.DESC, "height");
                    break;
                case "newest":
                default:
                    // Primary Sort: Boosted first, then Newest
                    sort = Sort.by(Sort.Order.desc("isBoosted"), Sort.Order.desc("createdAt"));
                    break;
            }
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        Specification<Profile> spec = ProfileSpecification.buildSpecification(request, finalSearcher, isPremium, shuffle);

        Page<Profile> profiles = profileRepository.findAll(spec, pageable);
        
        // Fetch interactions in batch
        Map<Long, Like> interactionMap = new HashMap<>();
        if (currentUser != null) {
            Long senderId = currentUser.getId();
            List<Long> receiverIds = profiles.getContent().stream()
                    .map(p -> p.getUser().getId())
                    .collect(Collectors.toList());
            
            if (!receiverIds.isEmpty()) {
                List<Like> interactions = likeRepository.findBySenderIdAndReceiverIdIn(senderId, receiverIds);
                interactions.forEach(l -> interactionMap.put(l.getReceiver().getId(), l));
            }
        }

        List<PublicProfileResponse> responseList = profiles.stream()
                .map(p -> mapToPublicResponse(p, finalSearcher, interactionMap.get(p.getUser().getId())))
                .collect(Collectors.toList());

        // Layer 5: Diversity Filter (Simple Implementation)
        // Ensure no more than 2 in a row with same Profession + District
        if (responseList.size() > 2) {
            return new PageImpl<>(applyDiversityFilter(responseList), pageable, profiles.getTotalElements());
        }

        return new PageImpl<>(responseList, pageable, profiles.getTotalElements());
    }

    private List<PublicProfileResponse> applyDiversityFilter(List<PublicProfileResponse> list) {
        if (list.size() <= 2) return list;
        
        List<PublicProfileResponse> prioritised = new ArrayList<>();
        List<PublicProfileResponse> moved = new ArrayList<>();
        Map<String, Integer> comboCount = new HashMap<>();

        for (PublicProfileResponse p : list) {
            String combo = (p.getProfession() != null ? p.getProfession() : "unknown") + "|" + (p.getDistrict() != null ? p.getDistrict() : "unknown");
            int count = comboCount.getOrDefault(combo, 0);
            if (count < 2) {
                prioritised.add(p);
                comboCount.put(combo, count + 1);
            } else {
                // Too many similar items, move them slightly down the list
                moved.add(p);
            }
        }
        
        prioritised.addAll(moved);
        return prioritised; 
    }

    @Transactional
    public DetailedProfileResponse getDetailedProfile(Long profileId, String viewerEmail) {
        Profile profile = profileRepository.findById(profileId)
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
                .placeOfBirth(profile.getPlaceOfBirth())
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
                .horoscopeSign(profile.getHoroscopeSign() != null ? profile.getHoroscopeSign().name() : null)
                .birthStar(profile.getBirthStar())
                .horoscopeDetails(profile.getHoroscopeDetails())
                .religiousPractices(profile.getReligiousPractices())
                // Family
                .familyBackground(profile.getFamilyBackground())
                .familyType(profile.getFamilyType() != null ? profile.getFamilyType().name() : null)
                .familyInvolvement(profile.getFamilyInvolvement())
                .weddingPreferences(profile.getWeddingPreferences())
                // Additional
                .partnerPreferences(profile.getPartnerPreferences())
                .favoriteThings(profile.getFavoriteThings())
                .personalityTraits(profile.getPersonalityTraits())
                .dealbreakers(profile.getDealbreakers())
                .quizAnswers(profile.getQuizAnswers())
                // Stats
                .profileViews(profile.getProfileViews())
                .completionScore(profile.getCompletionScore())
                .premium(profile.getUser().isPremiumActive())
                .premiumExpiryDate(profile.getUser().getPremiumExpiryDate())
                .build();
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
