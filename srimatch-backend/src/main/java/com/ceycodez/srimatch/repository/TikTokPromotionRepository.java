package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.TikTokPromotion;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.TikTokPromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TikTokPromotionRepository extends JpaRepository<TikTokPromotion, Long> {

    @Query("SELECT p FROM TikTokPromotion p " +
           "LEFT JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.tiktokPackage " +
           "LEFT JOIN FETCH p.payment " +
           "WHERE p.user = :user " +
           "ORDER BY p.submittedAt DESC")
    List<TikTokPromotion> findByUserOrderBySubmittedAtDesc(@Param("user") User user);

    @Query("SELECT p FROM TikTokPromotion p " +
           "LEFT JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.tiktokPackage " +
           "LEFT JOIN FETCH p.payment " +
           "WHERE p.status = :status " +
           "ORDER BY p.submittedAt DESC")
    List<TikTokPromotion> findByStatusOrderBySubmittedAtDesc(@Param("status") TikTokPromotionStatus status);

    @Query("SELECT p FROM TikTokPromotion p " +
           "LEFT JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.tiktokPackage " +
           "LEFT JOIN FETCH p.payment " +
           "ORDER BY p.submittedAt DESC")
    List<TikTokPromotion> findAllByOrderBySubmittedAtDesc();

    List<TikTokPromotion> findByStatusAndExpiresAtBefore(TikTokPromotionStatus status, LocalDateTime now);

    Optional<TikTokPromotion> findTopByUserAndStatusInOrderBySubmittedAtDesc(
            User user, List<TikTokPromotionStatus> statuses);

    boolean existsByUserAndStatusIn(User user, List<TikTokPromotionStatus> statuses);
}
