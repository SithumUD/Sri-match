package com.ceycodez.srimatch.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SupportTicketMessageResponse {
    private Long id;
    private String senderEmail;
    private boolean adminReply;
    private String message;
    private LocalDateTime createdAt;
}
