package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.OtpVerification;
import com.ceycodez.srimatch.model.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByIdentifierAndTypeOrderByCreatedAtDesc(String identifier, OtpType type);
    void deleteByIdentifierAndType(String identifier, OtpType type);
}
