package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.SupportTicket;
import com.ceycodez.srimatch.model.SupportTicketMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketMessageRepository extends JpaRepository<SupportTicketMessage, Long> {
    List<SupportTicketMessage> findByTicketOrderByCreatedAtAsc(SupportTicket ticket);
}
