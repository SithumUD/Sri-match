package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.MessageType;
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
public class MessageRequest {

    private Long matchId; // Optional for direct premium messages

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Message content cannot be empty")
    private String content;

    @Builder.Default
    private MessageType type = MessageType.TEXT;

    private String mediaUrl;
    private String mediaType;
    private Long mediaSize;
}
