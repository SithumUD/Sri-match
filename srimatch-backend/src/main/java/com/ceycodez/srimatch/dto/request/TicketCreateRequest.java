package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCreateRequest {
    
    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Initial message is required")
    private String message;

    private TicketPriority priority = TicketPriority.MEDIUM;
}
