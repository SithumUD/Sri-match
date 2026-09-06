package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @EntityGraph(attributePaths = {"premiumPackage"})
    List<Subscription> findByUser(User user);

    @EntityGraph(attributePaths = {"premiumPackage"})
    List<Subscription> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = {"premiumPackage"})
    Optional<Subscription> findTopByUserAndStatusOrderByCreatedAtDesc(User user, SubscriptionStatus status);

    List<Subscription> findByStatusAndEndDateBefore(SubscriptionStatus status, java.time.LocalDateTime now);
}
