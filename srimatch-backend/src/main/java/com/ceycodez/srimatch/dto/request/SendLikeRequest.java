package com.ceycodez.srimatch.dto.request;

import com.ceycodez.srimatch.model.enums.LikeType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendLikeRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotNull(message = "Like type is required")
    private LikeType type;

    private String message;
}
