package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileCompletionStatusResponse {
    private int score;
    private boolean isComplete;
    private List<SectionStatus> sections;
    private List<String> missingFields;
    private String topRecommendation;
    private String visibilityImpact;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectionStatus {
        private String sectionName;
        private int weight;
        private boolean completed;
        private List<String> missingItems;
    }
}
