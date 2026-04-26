package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.LikeStatus;
import com.ceycodez.srimatch.model.enums.LikeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

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
        private String firstName;
        private Integer age;
        private String city;
        private String district;
        private String profession;
        private String education;
        private String religion;
        private String about;
        private List<String> interests;
        private String profileImage;
        private Integer compatibilityScore;
        private LikeType interactionType;
        private LikeStatus interactionStatus;
        private boolean verified;
        private boolean boosted;
    }
}
