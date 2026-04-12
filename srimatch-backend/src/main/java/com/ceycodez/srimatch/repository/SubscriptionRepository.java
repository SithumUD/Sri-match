package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser(User user);
    Optional<Subscription> findTopByUserAndStatusOrderByCreatedAtDesc(User user, SubscriptionStatus status);
}
