package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Standard cursor/keyset pagination response.
 * Uses an opaque base64-encoded cursor (e.g. "score_id") to provide constant-time O(1)
 * deep pagination without the performance penalties of database OFFSET.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageResponse<T> {
    private List<T> items;
    private String nextCursor;
    private boolean hasMore;
    private int count;
}
