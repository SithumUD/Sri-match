package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReceivedLikesPageResponse {

    private long totalLikesCount;
    private List<ReceivedLikeResponse> likes;
    private int totalPages;
    private int currentPage;
}
