package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Notification;
import com.ceycodez.srimatch.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);

    long countByUserAndRead(User user, boolean read);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE n.user = :user AND n.read = false")
    int markAllAsReadForUser(@Param("user") User user);
}
