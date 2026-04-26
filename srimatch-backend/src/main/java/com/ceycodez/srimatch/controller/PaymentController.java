package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.PaymentResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.ceycodez.srimatch.repository.UserRepository;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @PostMapping("/submit-receipt/{subscriptionId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> submitReceipt(
            @PathVariable Long subscriptionId,
            @RequestParam("receipt") MultipartFile receipt,
            Authentication authentication
    ) throws IOException {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        PaymentResponse response = paymentService.submitBankReceipt(user.getId(), subscriptionId, receipt);
        
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Receipt submitted successfully. Admin will review it shortly.")
                .data(response)
                .build());
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<PaymentResponse> response = paymentService.getUserPayments(user.getId());
        
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .success(true)
                .message("Payment history fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/check-pending")
    public ResponseEntity<ApiResponse<Boolean>> checkPendingPayment(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        boolean hasPending = paymentService.hasPendingPayment(user.getId());
        
        return ResponseEntity.ok(ApiResponse.<Boolean>builder()
                .success(true)
                .message(hasPending ? "User has a pending payment" : "No pending payment found")
                .data(hasPending)
                .build());
    }
}
