package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.SubscriptionOverviewResponse;
import com.ceycodez.srimatch.dto.response.SubscriptionResponse;
import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import com.ceycodez.srimatch.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/v1/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<SubscriptionOverviewResponse>> getSubscriptionOverview(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        SubscriptionOverviewResponse response = subscriptionService.getSubscriptionOverview(user);

        return ResponseEntity.ok(ApiResponse.<SubscriptionOverviewResponse>builder()
                .success(true)
                .message("Subscription overview fetched successfully")
                .data(response)
                .build());
    }

    @PostMapping("/initiate/{packageId}")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> initiateSubscription(
            @PathVariable Long packageId,
            Authentication authentication
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        Subscription subscription = subscriptionService.initiateSubscription(user.getId(), packageId);
        
        return ResponseEntity.ok(ApiResponse.<SubscriptionResponse>builder()
                .success(true)
                .message("Subscription initiated. Please proceed to payment.")
                .data(SubscriptionResponse.fromEntity(subscription))
                .build());
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<SubscriptionResponse>>> getMySubscriptions(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<SubscriptionResponse> response = subscriptionService.getUserSubscriptions(user.getId());
        
        return ResponseEntity.ok(ApiResponse.<List<SubscriptionResponse>>builder()
                .success(true)
                .message("Your subscriptions fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/my/active")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getMyActiveSubscription(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        SubscriptionResponse response = subscriptionService.getActiveSubscription(user.getId());
        
        return ResponseEntity.ok(ApiResponse.<SubscriptionResponse>builder()
                .success(true)
                .message(response != null ? "Active subscription found" : "No active subscription found")
                .data(response)
                .build());
    }
}
