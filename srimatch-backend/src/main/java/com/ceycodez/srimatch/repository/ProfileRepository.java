package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {
    Optional<Profile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    java.util.List<Profile> findByIsBoostedTrueAndBoostExpiresAtBefore(java.time.LocalDateTime now);
}
