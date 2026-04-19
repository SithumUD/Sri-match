package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.TicketCreateRequest;
import com.ceycodez.srimatch.dto.request.TicketMessageRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.SupportTicketMessageResponse;
import com.ceycodez.srimatch.dto.response.SupportTicketResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.SupportTicketService;
import com.ceycodez.srimatch.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/support/tickets")
@RequiredArgsConstructor
public class SupportController {

    private final SupportTicketService supportTicketService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportTicketResponse>> createTicket(
            @Valid @RequestBody TicketCreateRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        SupportTicketResponse response = supportTicketService.createTicket(user, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Support ticket created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportTicketResponse>>> getMyTickets(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<SupportTicketResponse> response = supportTicketService.getUserTickets(user);
        return ResponseEntity.ok(new ApiResponse<>(true, "Tickets fetched successfully", response));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<List<SupportTicketMessageResponse>>> getTicketMessages(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        List<SupportTicketMessageResponse> response = supportTicketService.getTicketMessages(id, user, false);
        return ResponseEntity.ok(new ApiResponse<>(true, "Ticket messages fetched successfully", response));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<SupportTicketMessageResponse>> replyToTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketMessageRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        SupportTicketMessageResponse response = supportTicketService.replyToTicket(id, user, request, false);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reply sent successfully", response));
    }
}
