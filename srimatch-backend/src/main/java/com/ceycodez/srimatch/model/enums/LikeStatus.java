package com.ceycodez.srimatch.model.enums;

public enum LikeStatus {
    PENDING,     // Like sent, waiting for response
    ACCEPTED,    // Like accepted, match created
    REJECTED,    // Like rejected
    EXPIRED,     // Like expired
    CANCELLED    // Like cancelled by sender
}