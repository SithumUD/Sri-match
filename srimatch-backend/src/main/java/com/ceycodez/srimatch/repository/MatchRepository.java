package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.MatchStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE (m.user1 = :user OR m.user2 = :user) AND m.status = :status")
    Page<Match> findByUserAndStatus(@Param("user") User user, @Param("status") MatchStatus status, Pageable pageable);

    @Query("SELECT m FROM Match m WHERE (m.user1 = :user1 AND m.user2 = :user2) OR (m.user1 = :user2 AND m.user2 = :user1)")
    Optional<Match> findByUsers(@Param("user1") User user1, @Param("user2") User user2);

    boolean existsByUser1AndUser2(User user1, User user2);
}
