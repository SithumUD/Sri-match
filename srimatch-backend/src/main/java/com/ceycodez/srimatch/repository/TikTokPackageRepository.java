package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.TikTokPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TikTokPackageRepository extends JpaRepository<TikTokPackage, Long> {
    List<TikTokPackage> findByActiveTrue();
}
