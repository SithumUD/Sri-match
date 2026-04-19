package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.TicketCreateRequest;
import com.ceycodez.srimatch.dto.request.TicketMessageRequest;
import com.ceycodez.srimatch.dto.response.SupportTicketMessageResponse;
import com.ceycodez.srimatch.dto.response.SupportTicketResponse;
import com.ceycodez.srimatch.model.SupportTicket;
import com.ceycodez.srimatch.model.SupportTicketMessage;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.TicketStatus;
import com.ceycodez.srimatch.repository.SupportTicketMessageRepository;
import com.ceycodez.srimatch.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final SupportTicketMessageRepository messageRepository;

    @Transactional
    public SupportTicketResponse createTicket(User user, TicketCreateRequest request) {
        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(request.getSubject())
                .status(TicketStatus.OPEN)
                .priority(request.getPriority())
                .build();
        ticket = ticketRepository.save(ticket);

        SupportTicketMessage initialMessage = SupportTicketMessage.builder()
                .ticket(ticket)
                .sender(user)
                .adminReply(false)
                .message(request.getMessage())
                .build();
        messageRepository.save(initialMessage);

        return mapToTicketResponse(ticket);
    }

    public List<SupportTicketResponse> getUserTickets(User user) {
        return ticketRepository.findByUserOrderByUpdatedAtDesc(user)
                .stream().map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    public List<SupportTicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByUpdatedAtDesc()
                .stream().map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    public List<SupportTicketMessageResponse> getTicketMessages(Long ticketId, User user, boolean isAdmin) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (!isAdmin && !ticket.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to view this ticket");
        }

        return messageRepository.findByTicketOrderByCreatedAtAsc(ticket)
                .stream().map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupportTicketMessageResponse replyToTicket(Long ticketId, User sender, TicketMessageRequest request, boolean isAdmin) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!isAdmin && !ticket.getUser().getId().equals(sender.getId())) {
            throw new RuntimeException("Unauthorized to reply to this ticket");
        }

        SupportTicketMessage message = SupportTicketMessage.builder()
                .ticket(ticket)
                .sender(sender)
                .adminReply(isAdmin)
                .message(request.getMessage())
                .build();
        message = messageRepository.save(message);

        if (isAdmin && ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
            ticketRepository.save(ticket);
        }

        return mapToMessageResponse(message);
    }

    @Transactional
    public SupportTicketResponse updateTicketStatus(Long ticketId, TicketStatus newStatus) {
        SupportTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(newStatus);
        ticket = ticketRepository.save(ticket);
        return mapToTicketResponse(ticket);
    }

    private SupportTicketResponse mapToTicketResponse(SupportTicket ticket) {
        return SupportTicketResponse.builder()
                .id(ticket.getId())
                .userEmail(ticket.getUser().getEmail())
                .subject(ticket.getSubject())
                .status(ticket.getStatus())
                .priority(ticket.getPriority())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private SupportTicketMessageResponse mapToMessageResponse(SupportTicketMessage message) {
        return SupportTicketMessageResponse.builder()
                .id(message.getId())
                .senderEmail(message.getSender().getEmail())
                .adminReply(message.isAdminReply())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
