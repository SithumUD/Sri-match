package com.ceycodez.srimatch.model.enums;

public enum MessageStatus {
    SENT,        // Message sent but not delivered
    DELIVERED,   // Message delivered to receiver
    READ,        // Message read by receiver
    FAILED,      // Message failed to send
    DELETED      // Message deleted
}