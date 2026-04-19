package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    
    @NotNull(message = "Status cannot be null")
    private TicketStatus status;
}
