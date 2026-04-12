package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Payment;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
    List<Payment> findByPaymentStatus(PaymentStatus status);
}
