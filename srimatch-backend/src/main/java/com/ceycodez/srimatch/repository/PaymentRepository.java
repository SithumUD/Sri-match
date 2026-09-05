package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Payment;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.PaymentStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    List<Payment> findByUserOrderBySubmittedAtDesc(User user);
    List<Payment> findByPaymentStatus(PaymentStatus status);
    boolean existsByUserAndPaymentStatus(User user, PaymentStatus status);

    // Dashboard: count by status
    long countByPaymentStatus(PaymentStatus status);

    // Dashboard: recent payments
    List<Payment> findTop5ByOrderBySubmittedAtDesc();

    // Dashboard: total revenue (approved payments only)
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED'")
    BigDecimal getTotalRevenue();

    // Dashboard: this month's revenue
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.paymentStatus = 'COMPLETED' AND p.submittedAt >= :since")
    BigDecimal getRevenueAfter(LocalDateTime since);

    // Dashboard: monthly revenue breakdown (last 7 months)
    @Query(value = "SELECT CAST(EXTRACT(MONTH FROM submitted_at) AS INTEGER) as m, CAST(EXTRACT(YEAR FROM submitted_at) AS INTEGER) as y, SUM(amount) as total " +
                   "FROM payments WHERE payment_status = 'COMPLETED' AND submitted_at >= :since " +
                   "GROUP BY EXTRACT(YEAR FROM submitted_at), EXTRACT(MONTH FROM submitted_at) ORDER BY y, m",
           nativeQuery = true)
    List<Object[]> getMonthlyBreakdown(LocalDateTime since);
}
