package com.ceycodez.srimatch.dto.response;

import com.ceycodez.srimatch.model.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {

    private Long id;
    private MatchStatus status;
    private Integer compatibilityScore;
    private LocalDateTime matchedAt;
    private OtherUserDetails otherUser;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtherUserDetails {
        private Long id;
        private String name;
        private String profileImageUrl;
        private Integer age;
        private String profession;
        private String district;
    }
}
