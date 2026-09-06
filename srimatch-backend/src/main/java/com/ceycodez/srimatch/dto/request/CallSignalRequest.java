package com.ceycodez.srimatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallSignalRequest {
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    /**
     * Signal types:
     * - OFFER
     * - ANSWER
     * - CANDIDATE
     * - REJECT
     * - END
     * - BUSY
     * - RINGING
     */
    @NotBlank(message = "Signal type is required")
    private String signalType;

    /**
     * Call types:
     * - VOICE
     * - VIDEO
     */
    private String callType;

    /** SDP offer or answer object (JSON string or raw SDP string) */
    private Object sdp;

    /** WebRTC ICE candidate */
    private Object candidate;

    /** Optional reason for rejection/end */
    private String reason;
}
