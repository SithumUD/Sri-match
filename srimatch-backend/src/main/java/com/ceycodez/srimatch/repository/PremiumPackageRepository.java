package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.PremiumPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PremiumPackageRepository extends JpaRepository<PremiumPackage, Long> {
    List<PremiumPackage> findByActiveTrue();
}
