package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallSignalResponse {
    
    private Long senderId;
    private String senderName;
    private String senderAvatar;
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
    private String signalType;

    /**
     * Call types:
     * - VOICE
     * - VIDEO
     */
    private String callType;

    /** SDP offer or answer object */
    private Object sdp;

    /** WebRTC ICE candidate */
    private Object candidate;

    /** Optional reason */
    private String reason;

    private Long timestamp;
}
