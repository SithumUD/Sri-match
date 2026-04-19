package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.SupportTicket;
import com.ceycodez.srimatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserOrderByUpdatedAtDesc(User user);
    List<SupportTicket> findAllByOrderByUpdatedAtDesc();
}
