package com.ceycodez.srimatch.scheduler;

import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.repository.ProfileRepository;
import com.ceycodez.srimatch.service.MatchingService;
import com.ceycodez.srimatch.service.NotificationService;
import com.ceycodez.srimatch.service.TikTokService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BoostScheduler {

    private final ProfileRepository profileRepository;
    private final NotificationService notificationService;
    private final MatchingService matchingService;
    private final TikTokService tikTokService;
    private final com.ceycodez.srimatch.service.SubscriptionService subscriptionService;

    @Scheduled(fixedRate = 60000) // Every minute
    @Transactional
    public void expireBoosts() {
        LocalDateTime now = LocalDateTime.now();
        List<Profile> expiredBoosts = profileRepository.findByIsBoostedTrueAndBoostExpiresAtBefore(now);
        
        if (!expiredBoosts.isEmpty()) {
            log.info("Expiring {} profile boosts", expiredBoosts.size());
            for (Profile profile : expiredBoosts) {
                profile.setBoosted(false);
                profile.setBoostExpiresAt(null);

                // Evict matching compatibility cache to reflect un-boosted multiplier
                matchingService.evictUserCompatibilityCache(profile.getId());

                // Send notification to user that their 1-hour boost ended
                if (profile.getUser() != null) {
                    try {
                        notificationService.createNotification(
                                profile.getUser(),
                                "Profile Boost Ended",
                                "Your 1-hour profile boost has ended. Boost again to keep maximum discovery visibility!",
                                NotificationType.BOOST_EXPIRED,
                                profile.getId(),
                                "PROFILE"
                        );
                    } catch (Exception e) {
                        log.error("Failed to send boost expiration notification: {}", e.getMessage());
                    }
                }
            }
            profileRepository.saveAll(expiredBoosts);
        }
    }

    /**
     * Check and expire published TikTok promotions hourly.
     * Runs hourly (not every minute) since promotions are day-scale — 60x fewer DB queries.
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour at :00
    @Transactional
    public void expireTikTokPromotions() {
        tikTokService.expirePromotions();
    }

    /**
     * Check and expire subscriptions hourly.
     * Marks subscriptions as EXPIRED, updates user.isPremium to false, and sends notification.
     */
    @Scheduled(cron = "0 0 * * * *") // Every hour at :00
    @Transactional
    public void expireSubscriptions() {
        subscriptionService.expireSubscriptions();
    }
}
