package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.ReportReason;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReportRequest {
    
    @NotNull(message = "Target user ID is required")
    private Long reportedUserId;

    @NotNull(message = "Reason is required")
    private ReportReason reason;

    private String description;

    private String evidenceUrls; // Optional comma-separated or JSON string of URLs
}
