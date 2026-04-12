package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.ProfileView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileViewRepository extends JpaRepository<ProfileView, Long> {
    List<ProfileView> findByViewerId(Long viewerId);
    long countByViewedProfileId(Long viewedProfileId);
}
