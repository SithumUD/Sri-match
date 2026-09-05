package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Composite response DTO for the Connections page.
 * Returns profile views, subscription status, active matches, and received likes
 * in a single unified payload to eliminate redundant network roundtrips.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionsOverviewResponse {

    private int profileViews;
    private boolean isPremium;
    private long totalLikesCount;
    private long totalMatchesCount;
    private List<MatchResponse> matches;
    private List<ReceivedLikeResponse> receivedLikes;
    private List<ReceivedLikeResponse> starLikes;
}
