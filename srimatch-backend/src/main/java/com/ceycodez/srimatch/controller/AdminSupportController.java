package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.TicketMessageRequest;
import com.ceycodez.srimatch.dto.request.TicketStatusUpdateRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.SupportTicketMessageResponse;
import com.ceycodez.srimatch.dto.response.SupportTicketResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.SupportTicketService;
import com.ceycodez.srimatch.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/support/tickets")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminSupportController {

    private final SupportTicketService supportTicketService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportTicketResponse>>> getAllTickets() {
        List<SupportTicketResponse> response = supportTicketService.getAllTickets();
        return ResponseEntity.ok(new ApiResponse<>(true, "All support tickets fetched successfully", response));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<List<SupportTicketMessageResponse>>> getTicketMessages(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User admin = userService.getUserByEmail(authentication.getName());
        List<SupportTicketMessageResponse> response = supportTicketService.getTicketMessages(id, admin, true);
        return ResponseEntity.ok(new ApiResponse<>(true, "Ticket messages fetched successfully", response));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<SupportTicketMessageResponse>> adminReplyToTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketMessageRequest request,
            Authentication authentication
    ) {
        User admin = userService.getUserByEmail(authentication.getName());
        SupportTicketMessageResponse response = supportTicketService.replyToTicket(id, admin, request, true);
        return ResponseEntity.ok(new ApiResponse<>(true, "Admin reply sent successfully", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SupportTicketResponse>> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody TicketStatusUpdateRequest request
    ) {
        SupportTicketResponse response = supportTicketService.updateTicketStatus(id, request.getStatus());
        return ResponseEntity.ok(new ApiResponse<>(true, "Ticket status updated to " + request.getStatus(), response));
    }
}
