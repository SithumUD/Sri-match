package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.request.SendLikeRequest;
import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.ReceivedLikesPageResponse;
import com.ceycodez.srimatch.model.Like;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.service.LikeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
            @RequestParam(required = false) String type,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        ReceivedLikesPageResponse response = likeService.getReceivedLikes(user, type, pageable);
        
        return ResponseEntity.ok(ApiResponse.<ReceivedLikesPageResponse>builder()
                .success(true)
                .message("Received likes fetched successfully")
                .data(response)
                .build());
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<Page<Like>>> getSentLikes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<Like> response = likeService.getSentLikes(user, pageable);
        
        return ResponseEntity.ok(ApiResponse.<Page<Like>>builder()
                .success(true)
                .message("Sent likes fetched successfully")
                .data(response)
                .build());
    }

    /**
     * GET /v1/likes/check/{targetProfileId}
     * Returns: { "liked": true/false, "type": "NORMAL"/"STAR"/null }
     */
    @GetMapping("/check/{targetProfileId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkInteraction(
            @PathVariable Long targetProfileId,
            Authentication authentication
    ) {
        User sender = getCurrentUser(authentication);
        Map<String, Object> result = likeService.checkInteractionByProfileId(sender, targetProfileId);
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Interaction status fetched")
                .data(result)
                .build());
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
