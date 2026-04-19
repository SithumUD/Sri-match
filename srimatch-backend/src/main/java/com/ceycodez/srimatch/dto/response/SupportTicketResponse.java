package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.TicketPriority;
import com.ceycodez.srimatch.model.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SupportTicketResponse {
    private Long id;
    private String userEmail;
    private String subject;
    private TicketStatus status;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
