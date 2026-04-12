package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.MessageStatus;
import com.ceycodez.srimatch.model.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long matchId;
    private Long senderId;
    private Long receiverId;
    private String content;
    private MessageType type;
    private MessageStatus status;
    private boolean read;
    private LocalDateTime readAt;
    private boolean delivered;
    private LocalDateTime deliveredAt;
    private String mediaUrl;
    private String mediaType;
    private Long mediaSize;
    private LocalDateTime createdAt;
}