package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.BoostPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoostPackageRepository extends JpaRepository<BoostPackage, Long> {
    List<BoostPackage> findByActiveTrue();
}
