package com.ceycodez.srimatch.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LockAccountRequest {
    private LocalDateTime lockUntil; // If null, permanent lock
}
