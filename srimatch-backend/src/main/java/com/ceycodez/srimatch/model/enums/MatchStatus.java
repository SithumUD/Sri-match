package com.ceycodez.srimatch.model.enums;

public enum MatchStatus {
    ACTIVE,      // Match is active
    EXPIRED,     // Match expired due to inactivity
    BLOCKED,     // One user blocked the other
    DELETED,     // Match deleted by one user
    ARCHIVED     // Match archived
}