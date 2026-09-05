package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ConnectionsOverviewResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserRepository userRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<ConnectionsOverviewResponse>> getConnectionsOverview(
            @RequestParam(defaultValue = "50") int limit,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        ConnectionsOverviewResponse response = connectionService.getConnectionsOverview(user, limit);

        return ResponseEntity.ok(ApiResponse.<ConnectionsOverviewResponse>builder()
                .success(true)
                .message("Connections overview fetched successfully")
                .data(response)
                .build());
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
