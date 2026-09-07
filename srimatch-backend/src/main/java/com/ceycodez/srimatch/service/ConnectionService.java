package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.ConnectionsOverviewResponse;
import com.ceycodez.srimatch.dto.response.MatchResponse;
import com.ceycodez.srimatch.dto.response.ReceivedLikesPageResponse;
import com.ceycodez.srimatch.model.Match;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.MatchStatus;
import com.ceycodez.srimatch.repository.MatchRepository;
import com.ceycodez.srimatch.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final LikeService likeService;
    private final MatchRepository matchRepository;
    private final ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public ConnectionsOverviewResponse getConnectionsOverview(User user, int limit) {
        int pageSize = (limit > 0 && limit <= 100) ? limit : 50;
        Pageable pageable = PageRequest.of(0, pageSize);

        // 1. Profile metadata
        Profile userProfile = profileRepository.findByUserId(user.getId()).orElse(null);
        int profileViews = (userProfile != null && userProfile.getProfileViews() != null)
                ? userProfile.getProfileViews()
                : 0;
        boolean isPremium = user.isPremiumActive();

        // 2. Received Likes (all pending likes)
        ReceivedLikesPageResponse likesPage = likeService.getReceivedLikes(user, null, pageable);
        long totalLikesCount = likesPage.getTotalLikesCount();
        var allReceivedLikes = likesPage.getLikes();

        // Filter star likes directly from the fetched likes or fetch specifically if needed
        ReceivedLikesPageResponse starLikesPage = likeService.getReceivedLikes(user, "STAR", pageable);
        var starLikes = starLikesPage.getLikes();

        // 3. Active Matches
        Page<Match> matchesPage = matchRepository.findByUserAndStatus(user, MatchStatus.ACTIVE, pageable);
        List<MatchResponse> matches = matchesPage.getContent().stream()
                .map(match -> mapToMatchResponse(match, user))
                .collect(Collectors.toList());
        long totalMatchesCount = matchesPage.getTotalElements();

        return ConnectionsOverviewResponse.builder()
                .profileViews(profileViews)
                .isPremium(isPremium)
                .totalLikesCount(totalLikesCount)
                .totalMatchesCount(totalMatchesCount)
                .matches(matches)
                .receivedLikes(allReceivedLikes)
                .starLikes(starLikes)
                .build();
    }

    private MatchResponse mapToMatchResponse(Match match, User currentUser) {
        User otherUser = match.getOtherUser(currentUser.getId());
        Profile otherProfile = otherUser.getProfile();

        return MatchResponse.builder()
                .id(match.getId())
                .status(match.getStatus())
                .compatibilityScore(match.getCompatibilityScore())
                .matchedAt(match.getMatchedAt())
                .otherUser(MatchResponse.OtherUserDetails.builder()
                        .id(otherUser.getId())
                        .name(otherUser.getFullName())
                        .profileImageUrl(otherProfile != null ? otherProfile.getPrimaryImageUrl() : null)
                        .age(otherProfile != null ? otherProfile.getAge() : null)
                        .profession(otherProfile != null ? otherProfile.getProfession() : null)
                        .city(otherProfile != null ? otherProfile.getCity() : null)
                        .build())
                .build();
    }
}
