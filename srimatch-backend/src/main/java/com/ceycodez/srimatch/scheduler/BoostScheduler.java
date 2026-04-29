package com.ceycodez.srimatch.scheduler;

import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.repository.ProfileRepository;
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
            }
            profileRepository.saveAll(expiredBoosts);
        }
    }
}
