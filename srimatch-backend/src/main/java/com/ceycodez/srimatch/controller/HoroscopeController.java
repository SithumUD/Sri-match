package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.ProfileRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.service.ProkeralaAstroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/horoscope")
@RequiredArgsConstructor
@Tag(name = "Horoscope", description = "Endpoints for horoscope matching and analysis")
public class HoroscopeController {

    private final ProkeralaAstroService astroService;
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @GetMapping("/match/{targetProfileId}")
    @Operation(summary = "Get horoscope match analysis", description = "Returns Porutham matching analysis between current user and target profile")
    public ResponseEntity<?> getMatchAnalysis(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetProfileId
    ) {
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Profile myProfile = profileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Your profile is not complete. Please set up your profile first."));
        
        Profile targetProfile = profileRepository.findById(targetProfileId)
                .orElseThrow(() -> new RuntimeException("Target profile not found"));

        if (myProfile.getLatitude() == null || myProfile.getLongitude() == null || myProfile.getDateOfBirth() == null) {
            throw new RuntimeException("Your birth details (Date, Time, Place) are incomplete.");
        }

        if (targetProfile.getLatitude() == null || targetProfile.getLongitude() == null || targetProfile.getDateOfBirth() == null) {
            throw new RuntimeException("Target profile's birth details are incomplete.");
        }

        Object analysis = astroService.getMatchAnalysis(myProfile, targetProfile);
        return ResponseEntity.ok(analysis);
    }
}
