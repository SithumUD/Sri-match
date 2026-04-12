package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.PaymentReviewRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.PaymentResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.ceycodez.srimatch.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminPaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPendingPayments() {
        List<PaymentResponse> response = paymentService.getPendingPayments();
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .success(true)
                .message("Pending payments fetched successfully")
                .data(response)
                .build());
    }

    @PatchMapping("/{id}/review")
    public ResponseEntity<ApiResponse<PaymentResponse>> reviewPayment(
            @PathVariable Long id,
            @RequestBody PaymentReviewRequest request,
            Authentication authentication
    ) {
        User admin = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
        
        PaymentResponse response = paymentService.reviewPayment(admin.getId(), id, request);
        
        String action = request.isApproved() ? "approved" : "rejected";
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Payment " + action + " successfully")
                .data(response)
                .build());
    }
}
