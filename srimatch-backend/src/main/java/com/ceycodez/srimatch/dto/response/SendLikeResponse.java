package com.ceycodez.srimatch.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response returned by POST /v1/likes/send.
 * <p>
 * Returns the authoritative interaction state AFTER the like is persisted so
 * the frontend can reconcile its optimistic cache update with the real outcome.
 * In particular, {@code interactionStatus} may be "ACCEPTED" instead of
 * "PENDING" when a mutual like creates a match on the same request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendLikeResponse {

    /** "NORMAL" or "STAR" — matches LikeType enum name. */
    private String interactionType;

    /** "PENDING" or "ACCEPTED" — matches LikeStatus enum name. */
    private String interactionStatus;
}
