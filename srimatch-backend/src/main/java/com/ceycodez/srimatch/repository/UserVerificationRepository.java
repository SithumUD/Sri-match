package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.UserVerification;
import com.ceycodez.srimatch.model.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long> {
    Optional<UserVerification> findByUser(User user);
    Optional<UserVerification> findBySelfieSessionToken(String token);
    List<UserVerification> findAllByStatusOrderByCreatedAtDesc(VerificationStatus status);
}
