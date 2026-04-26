package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.UserRole;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    // Dashboard: total users excluding deleted
    long countByIsDeletedFalse();

    // Dashboard: premium users
    long countByPremiumTrueAndIsDeletedFalse();

    // Dashboard: currently online users
    long countByOnlineTrueAndIsDeletedFalse();

    // Dashboard: users registered since a date
    long countByCreatedAtAfterAndIsDeletedFalse(LocalDateTime since);

    // Dashboard: recent registrations
    List<User> findTop5ByIsDeletedFalseOrderByCreatedAtDesc();

    // Dashboard: revenue per month (using Payment)
    @Query("SELECT MONTH(p.submittedAt), SUM(p.amount) FROM Payment p " +
           "WHERE p.paymentStatus = 'COMPLETED' AND p.submittedAt >= :since " +
           "GROUP BY MONTH(p.submittedAt) ORDER BY MONTH(p.submittedAt)")
    List<Object[]> getMonthlyRevenue(LocalDateTime since);
}
