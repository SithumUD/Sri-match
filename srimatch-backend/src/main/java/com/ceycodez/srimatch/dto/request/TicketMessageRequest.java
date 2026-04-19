package com.ceycodez.srimatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketMessageRequest {
    
    @NotBlank(message = "Message body cannot be empty")
    private String message;
}
