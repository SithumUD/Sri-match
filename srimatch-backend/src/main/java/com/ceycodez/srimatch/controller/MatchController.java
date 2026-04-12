package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.dto.response.MatchResponse;
import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.MatchStatus;
import com.ceycodez.srimatch.repository.MatchRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMyMatches(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<Match> matchesPage = matchRepository.findByUserAndStatus(user, MatchStatus.ACTIVE, pageable);
        
        List<MatchResponse> response = matchesPage.getContent().stream()
                .map(match -> mapToMatchResponse(match, user))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.<List<MatchResponse>>builder()
                .success(true)
                .message("Matches fetched successfully")
                .data(response)
                .build());
    }

    private MatchResponse mapToMatchResponse(Match match, User currentUser) {
        User otherUser = match.getOtherUser(currentUser.getId());
        
        return MatchResponse.builder()
                .id(match.getId())
                .status(match.getStatus())
                .compatibilityScore(match.getCompatibilityScore())
                .matchedAt(match.getMatchedAt())
                .otherUser(MatchResponse.OtherUserDetails.builder()
                        .id(otherUser.getId())
                        .name(otherUser.getFullName())
                        .profileImageUrl(otherUser.getProfile() != null ? otherUser.getProfile().getPrimaryImageUrl() : null)
                        .age(otherUser.getProfile() != null ? otherUser.getProfile().getAge() : null)
                        .profession(otherUser.getProfile() != null ? otherUser.getProfile().getProfession() : null)
                        .district(otherUser.getProfile() != null ? otherUser.getProfile().getDistrict() : null)
                        .build())
                .build();
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
