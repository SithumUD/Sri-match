package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.SubscriptionResponse;
import com.ceycodez.srimatch.model.PremiumPackage;
import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.SubscriptionStatus;
import com.ceycodez.srimatch.repository.PremiumPackageRepository;
import com.ceycodez.srimatch.repository.SubscriptionRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PremiumPackageRepository packageRepository;
    private final UserRepository userRepository;

    @Transactional
    public Subscription initiateSubscription(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PremiumPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (user.isPremium() && user.getPremiumExpiryDate() != null && user.getPremiumExpiryDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("You already have an active premium package.");
        }

        // Check if there's already a pending subscription for this user
        subscriptionRepository.findTopByUserAndStatusOrderByCreatedAtDesc(user, SubscriptionStatus.PENDING)
                .ifPresent(sub -> {
                    // Update existing pending subscription if needed, or just keep it
                    // For simplicity, we just create a new one or reuse
                });

        Subscription subscription = Subscription.builder()
                .user(user)
                .premiumPackage(pkg)
                .status(SubscriptionStatus.PENDING)
                .build();

        return subscriptionRepository.save(subscription);
    }

    @Transactional
    public void activateSubscription(Long subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (subscription.getStatus() != SubscriptionStatus.PENDING) {
            throw new RuntimeException("Subscription is not in pending state");
        }

        LocalDateTime now = LocalDateTime.now();
        subscription.setStartDate(now);
        subscription.setEndDate(now.plusMonths(subscription.getPremiumPackage().getTimelineMonths()));
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(subscription);

        // Update User premium status
        User user = subscription.getUser();
        user.setPremium(true);
        user.setPremiumExpiryDate(subscription.getEndDate());
        userRepository.save(user);
    }

    public List<SubscriptionResponse> getUserSubscriptions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return subscriptionRepository.findByUser(user).stream()
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public SubscriptionResponse getActiveSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Ensure premium status is still valid
        if (user.getPremiumExpiryDate() != null && user.getPremiumExpiryDate().isBefore(LocalDateTime.now())) {
            if (user.isPremium()) {
                user.setPremium(false);
                userRepository.save(user);
                // Also mark the subscription record as expired
                subscriptionRepository.findTopByUserAndStatusOrderByCreatedAtDesc(user, SubscriptionStatus.ACTIVE)
                        .ifPresent(sub -> {
                            sub.setStatus(SubscriptionStatus.EXPIRED);
                            subscriptionRepository.save(sub);
                        });
            }
            return null;
        }

        return subscriptionRepository.findTopByUserAndStatusOrderByCreatedAtDesc(user, SubscriptionStatus.ACTIVE)
                .map(SubscriptionResponse::fromEntity)
                .orElse(null);
    }
}
