package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.CallSignalRequest;
import com.ceycodez.srimatch.dto.request.MessageRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.CallSignalResponse;
import com.ceycodez.srimatch.dto.response.MessageResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.ChatService;
import com.ceycodez.srimatch.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @RequestBody @Valid MessageRequest request,
            Authentication authentication
    ) {
        User sender = userService.getUserByEmail(authentication.getName());
        MessageResponse response = chatService.sendMessage(sender, request);
        return ResponseEntity.ok(ApiResponse.<MessageResponse>builder()
                .success(true)
                .message("Message sent")
                .data(response)
                .build());
    }

    @GetMapping("/history/{matchId}")
    public ResponseEntity<ApiResponse<Page<MessageResponse>>> getChatHistory(
            @PathVariable Long matchId,
            @PageableDefault(size = 50) Pageable pageable,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        Page<MessageResponse> history = chatService.getChatHistory(user, matchId, pageable);
        return ResponseEntity.ok(ApiResponse.<Page<MessageResponse>>builder()
                .success(true)
                .message("Chat history retrieved")
                .data(history)
                .build());
    }

    @PatchMapping("/messages/{messageId}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(
            @PathVariable Long messageId,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        chatService.markAsRead(messageId, user);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Message marked as read")
                .data(null)
                .build());
    }

    @PostMapping("/call/signal")
    public ResponseEntity<ApiResponse<com.ceycodez.srimatch.dto.response.CallSignalResponse>> sendCallSignal(
            @RequestBody @Valid com.ceycodez.srimatch.dto.request.CallSignalRequest request,
            Authentication authentication
    ) {
        User sender = userService.getUserByEmail(authentication.getName());
        com.ceycodez.srimatch.dto.response.CallSignalResponse response = chatService.sendCallSignal(sender, request);
        return ResponseEntity.ok(ApiResponse.<com.ceycodez.srimatch.dto.response.CallSignalResponse>builder()
                .success(true)
                .message("Signal relayed")
                .data(response)
                .build());
    }
}
