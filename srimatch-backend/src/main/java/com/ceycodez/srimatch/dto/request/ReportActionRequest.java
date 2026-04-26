package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.ReportStatus;
import lombok.Data;

@Data
public class ReportActionRequest {
    private ReportStatus status;
    private String adminNotes;
    private String actionTaken;
}
