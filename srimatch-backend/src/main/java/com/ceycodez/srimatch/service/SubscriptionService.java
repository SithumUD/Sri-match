package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.*;
import com.ceycodez.srimatch.model.PremiumPackage;
import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.model.enums.PaymentStatus;
import com.ceycodez.srimatch.model.enums.SubscriptionStatus;
import com.ceycodez.srimatch.repository.PaymentRepository;
import com.ceycodez.srimatch.repository.PremiumPackageRepository;
import com.ceycodez.srimatch.repository.SubscriptionRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PremiumPackageRepository packageRepository;
    private final UserRepository userRepository;
    private final PackageService packageService;
    private final BankDetailService bankDetailService;
    private final BoostService boostService;
    private final PaymentRepository paymentRepository;
    private final TikTokService tikTokService;
    private final NotificationService notificationService;

    @Transactional
    public Subscription initiateSubscription(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PremiumPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (user.isPremiumActive()) {
            String expiry = user.getPremiumExpiryDate() != null ? user.getPremiumExpiryDate().toLocalDate().toString() : "active period";
            throw new RuntimeException("You already have an active Premium plan until " + expiry + ". You cannot purchase another subscription until your current plan expires.");
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

        Optional<Subscription> activeSub = subscriptionRepository.findTopByUserAndStatusOrderByCreatedAtDesc(user, SubscriptionStatus.ACTIVE);
        if (activeSub.isPresent()) {
            return SubscriptionResponse.fromEntity(activeSub.get());
        }

        // If user is marked premium directly (e.g. admin grant, continuous premium, or active subscription without explicit record)
        if (user.isPremiumActive()) {
            long days = 0;
            long hours = 0;
            if (user.getPremiumExpiryDate() != null && user.getPremiumExpiryDate().isAfter(LocalDateTime.now())) {
                days = java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), user.getPremiumExpiryDate());
                hours = java.time.temporal.ChronoUnit.HOURS.between(LocalDateTime.now(), user.getPremiumExpiryDate()) % 24;
            } else if (user.getPremiumExpiryDate() == null) {
                days = 365;
            }

            return SubscriptionResponse.builder()
                    .id(-1L)
                    .packageName("Premium Membership")
                    .startDate(user.getCreatedAt())
                    .endDate(user.getPremiumExpiryDate())
                    .status("ACTIVE")
                    .daysRemaining(days)
                    .hoursRemaining(hours)
                    .build();
        }

        return null;
    }

    /**
     * Parallelized, fault-isolated composite query for the Subscription page.
     * Aggregates packages, bank details, boost packages, TikTok packages, user TikTok promotions,
     * active subscription, pending payment check, and boost status in parallel without HTTP overhead.
     */
    public SubscriptionOverviewResponse getSubscriptionOverview(User user) {
        Map<String, String> errors = new ConcurrentHashMap<>();

        // 1. Packages
        CompletableFuture<List<PremiumPackageResponse>> packagesFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return packageService.getAllPackages(true);
            } catch (Exception e) {
                log.error("Failed to fetch premium packages: {}", e.getMessage());
                errors.put("packages", "unavailable");
                return Collections.emptyList();
            }
        });

        // 2. Bank Details
        CompletableFuture<List<BankDetailResponse>> bankDetailsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return bankDetailService.getAllBankDetails(true);
            } catch (Exception e) {
                log.error("Failed to fetch bank details: {}", e.getMessage());
                errors.put("bankDetails", "unavailable");
                return Collections.emptyList();
            }
        });

        // 3. Boost Packages
        CompletableFuture<List<BoostPackageResponse>> boostPackagesFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return boostService.getAllPackages(true);
            } catch (Exception e) {
                log.error("Failed to fetch boost packages: {}", e.getMessage());
                errors.put("boostPackages", "unavailable");
                return Collections.emptyList();
            }
        });

        // 4. TikTok Packages
        CompletableFuture<List<TikTokPackageResponse>> tiktokPackagesFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return tikTokService.getActivePackages();
            } catch (Exception e) {
                log.error("Failed to fetch TikTok packages: {}", e.getMessage());
                errors.put("tiktokPackages", "unavailable");
                return Collections.emptyList();
            }
        });

        // 5. User TikTok Promotions
        CompletableFuture<List<TikTokPromotionResponse>> tiktokPromotionsFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return tikTokService.getUserPromotions(user.getId());
            } catch (Exception e) {
                log.error("Failed to fetch TikTok promotions for user {}: {}", user.getId(), e.getMessage());
                errors.put("myTikTokPromotions", "unavailable");
                return Collections.emptyList();
            }
        });

        // 6. Active Subscription
        CompletableFuture<SubscriptionResponse> activeSubFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return getActiveSubscription(user.getId());
            } catch (Exception e) {
                log.error("Failed to fetch active subscription for user {}: {}", user.getId(), e.getMessage());
                errors.put("activeSubscription", "unavailable");
                return null;
            }
        });

        // 7. Pending Payment
        CompletableFuture<Boolean> pendingPaymentFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return paymentRepository.existsByUserAndPaymentStatus(user, PaymentStatus.PENDING);
            } catch (Exception e) {
                log.error("Failed to check pending payment for user {}: {}", user.getId(), e.getMessage());
                errors.put("hasPendingApproval", "unavailable");
                return false;
            }
        });

        // 8. Boost Status
        CompletableFuture<BoostStatusResponse> boostStatusFuture = CompletableFuture.supplyAsync(() -> {
            try {
                return boostService.getBoostStatus(user.getEmail());
            } catch (Exception e) {
                log.error("Failed to fetch boost status for user {}: {}", user.getEmail(), e.getMessage());
                errors.put("boostStatus", "unavailable");
                return null;
            }
        });

        // Await all futures in parallel
        CompletableFuture.allOf(
                packagesFuture,
                bankDetailsFuture,
                boostPackagesFuture,
                tiktokPackagesFuture,
                tiktokPromotionsFuture,
                activeSubFuture,
                pendingPaymentFuture,
                boostStatusFuture
        ).join();

        return SubscriptionOverviewResponse.builder()
                .packages(packagesFuture.join())
                .bankDetails(bankDetailsFuture.join())
                .boostPackages(boostPackagesFuture.join())
                .tiktokPackages(tiktokPackagesFuture.join())
                .myTikTokPromotions(tiktokPromotionsFuture.join())
                .activeSubscription(activeSubFuture.join())
                .hasPendingApproval(pendingPaymentFuture.join())
                .boostStatus(boostStatusFuture.join())
                .errors(errors.isEmpty() ? null : errors)
                .build();
    }

    @Transactional
    public void expireSubscriptions() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Expire subscription entities
        List<Subscription> expiredSubs = subscriptionRepository.findByStatusAndEndDateBefore(SubscriptionStatus.ACTIVE, now);
        if (!expiredSubs.isEmpty()) {
            log.info("Expiring {} active subscriptions", expiredSubs.size());
            for (Subscription sub : expiredSubs) {
                sub.setStatus(SubscriptionStatus.EXPIRED);
                User user = sub.getUser();
                if (user != null && user.isPremium()) {
                    user.setPremium(false);
                    userRepository.save(user);

                    try {
                        notificationService.createNotification(
                                user,
                                "Subscription Expired",
                                "Your Premium subscription has expired. Upgrade today to restore unlimited likes and exclusive features!",
                                NotificationType.PREMIUM_EXPIRING,
                                sub.getId(),
                                "SUBSCRIPTION"
                        );
                    } catch (Exception e) {
                        log.error("Failed to send subscription expiration notification to user {}: {}", user.getId(), e.getMessage());
                    }
                }
            }
            subscriptionRepository.saveAll(expiredSubs);
        }

        // 2. Expire direct users where premiumExpiryDate passed but user.premium is still true
        List<User> expiredUsers = userRepository.findByPremiumTrueAndPremiumExpiryDateBefore(now);
        if (!expiredUsers.isEmpty()) {
            log.info("Expiring {} direct premium user accounts", expiredUsers.size());
            for (User user : expiredUsers) {
                user.setPremium(false);
                try {
                    notificationService.createNotification(
                            user,
                            "Subscription Expired",
                            "Your Premium subscription has expired. Upgrade today to restore unlimited likes and exclusive features!",
                            NotificationType.PREMIUM_EXPIRING,
                            user.getId(),
                            "SUBSCRIPTION"
                    );
                } catch (Exception e) {
                    log.error("Failed to send direct premium expiration notification to user {}: {}", user.getId(), e.getMessage());
                }
            }
            userRepository.saveAll(expiredUsers);
        }
    }
}

