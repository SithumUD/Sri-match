package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.LikeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceivedLikeResponse {

    private Long likeId;
    private LikeType type;
    private String message;
    private LocalDateTime createdAt;
    private boolean isBlurred;
    private SenderDetails sender;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SenderDetails {
        private Long id;
        private String name;
        private String profileImageUrl;
        private Integer age;
        private String profession;
        private String district;
    }
}
