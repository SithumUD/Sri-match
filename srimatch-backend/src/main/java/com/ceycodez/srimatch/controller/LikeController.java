package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.SendLikeRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ReceivedLikesPageResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.service.LikeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendLike(
            @RequestBody @Valid SendLikeRequest request,
            Authentication authentication
    ) {
        User sender = getCurrentUser(authentication);
        likeService.sendLike(sender, request);
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .success(true)
                .message("Like sent successfully")
                .data(null)
                .build());
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<ReceivedLikesPageResponse>> getReceivedLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        ReceivedLikesPageResponse response = likeService.getReceivedLikes(user, pageable);
        
        return ResponseEntity.ok(ApiResponse.<ReceivedLikesPageResponse>builder()
                .success(true)
                .message("Received likes fetched successfully")
                .data(response)
                .build());
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
