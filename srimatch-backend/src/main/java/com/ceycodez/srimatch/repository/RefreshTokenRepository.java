package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.RefreshToken;
import com.ceycodez.srimatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    void deleteByToken(String token);
    List<RefreshToken> findByUserAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(User user, LocalDateTime now);
    Optional<RefreshToken> findByIdAndUser(Long id, User user);
    void deleteByUserAndIdNot(User user, Long id);
}
