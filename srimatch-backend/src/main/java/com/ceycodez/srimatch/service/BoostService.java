package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.BoostPackageRequest;
import com.ceycodez.srimatch.dto.response.BoostPackageResponse;
import com.ceycodez.srimatch.dto.response.BoostStatusResponse;
import com.ceycodez.srimatch.model.BoostPackage;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.BoostPackageRepository;
import com.ceycodez.srimatch.repository.ProfileRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoostService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BoostPackageRepository boostPackageRepository;

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    @Transactional
    public BoostStatusResponse getBoostStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        checkAndRenewPremiumBoosts(user);
        
        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found");
        }

        LocalDateTime nextRenewal = null;
        if (user.isPremiumActive()) {
            if (user.getLastBoostRenewAt() == null) {
                nextRenewal = LocalDateTime.now().plusDays(5);
            } else {
                nextRenewal = user.getLastBoostRenewAt().plusDays(5);
            }
        }

        return BoostStatusResponse.builder()
                .remainingBoosts(user.getBoostCount())
                .isBoosted(profile.isBoosted() && (profile.getBoostExpiresAt() == null || profile.getBoostExpiresAt().isAfter(LocalDateTime.now())))
                .boostExpiresAt(profile.getBoostExpiresAt())
                .nextRenewalAt(nextRenewal)
                .build();
    }

    @Transactional
    public BoostStatusResponse activateBoost(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        checkAndRenewPremiumBoosts(user);

        if (user.getBoostCount() <= 0) {
            throw new RuntimeException("No boosts remaining. Please purchase or wait for renewal.");
        }

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found");
        }

        if (profile.isBoosted() && (profile.getBoostExpiresAt() == null || profile.getBoostExpiresAt().isAfter(LocalDateTime.now()))) {
            throw new RuntimeException("A boost is already active. Please wait until it expires.");
        }

        // Deactivate previous boost if any (though usually we'd just extend or ignore)
        profile.setBoosted(true);
        profile.setBoostExpiresAt(LocalDateTime.now().plusHours(1));
        profileRepository.save(profile);

        user.setBoostCount(user.getBoostCount() - 1);
        userRepository.save(user);

        return getBoostStatus(email);
    }

    @Transactional
    public void checkAndRenewPremiumBoosts(User user) {
        if (!user.isPremiumActive()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        if (user.getLastBoostRenewAt() == null) {
            // Initial premium setup for boosts
            user.setBoostCount(user.getBoostCount() + 3);
            user.setLastBoostRenewAt(now);
            userRepository.save(user);
            return;
        }

        while (user.getLastBoostRenewAt().plusDays(5).isBefore(now)) {
            user.setBoostCount(user.getBoostCount() + 3);
            user.setLastBoostRenewAt(user.getLastBoostRenewAt().plusDays(5));
        }
        userRepository.save(user);
    }

    // --- Admin Package Management ---

    @Transactional
    public BoostPackageResponse createPackage(BoostPackageRequest request) {
        BoostPackage pkg = BoostPackage.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .boostCount(request.getBoostCount())
                .active(request.isActive())
                .build();
        return BoostPackageResponse.fromEntity(boostPackageRepository.save(pkg));
    }

    @Transactional
    public BoostPackageResponse updatePackage(Long id, BoostPackageRequest request) {
        BoostPackage pkg = boostPackageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setBoostCount(request.getBoostCount());
        pkg.setActive(request.isActive());
        return BoostPackageResponse.fromEntity(boostPackageRepository.save(pkg));
    }

    public List<BoostPackageResponse> getAllPackages(boolean onlyActive) {
        List<BoostPackage> packages = onlyActive ? boostPackageRepository.findByActiveTrue() : boostPackageRepository.findAll();
        return packages.stream().map(BoostPackageResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void purchaseBoostPackage(String email, Long packageId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        BoostPackage pkg = boostPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));
        
        if (!pkg.isActive()) {
            throw new RuntimeException("This package is no longer available");
        }

        // In a real scenario, this would be called after a successful payment verification
        user.setBoostCount(user.getBoostCount() + pkg.getBoostCount());
        userRepository.save(user);
    }
}
