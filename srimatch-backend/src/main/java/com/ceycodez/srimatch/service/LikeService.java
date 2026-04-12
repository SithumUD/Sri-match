package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.SendLikeRequest;
import com.ceycodez.srimatch.dto.response.ReceivedLikeResponse;
import com.ceycodez.srimatch.dto.response.ReceivedLikesPageResponse;
import com.ceycodez.srimatch.model.Like;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.LikeStatus;
import com.ceycodez.srimatch.model.enums.LikeType;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.repository.LikeRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final MatchingService matchingService;

    @Transactional
    public void sendLike(User sender, SendLikeRequest request) {
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot like yourself");
        }

        // Check for existing like
        if (likeRepository.existsBySenderAndReceiverAndStatus(sender, receiver, LikeStatus.PENDING) ||
            likeRepository.existsBySenderAndReceiverAndStatus(sender, receiver, LikeStatus.ACCEPTED)) {
            throw new RuntimeException("You have already liked this user");
        }

        // Check limits for normal likes
        if (request.getType() == LikeType.NORMAL) {
            if (!sender.canSendLike()) {
                throw new RuntimeException("You have reached your like limit. Normal users have 15 likes per 5 days.");
            }
            sender.incrementLikesUsed();
            userRepository.save(sender);
        } else if (request.getType() == LikeType.STAR) {
            if (!sender.isPremiumActive()) {
                throw new RuntimeException("Star likes are only available for premium members");
            }
        }

        Like like = Like.builder()
                .sender(sender)
                .receiver(receiver)
                .type(request.getType())
                .message(request.getMessage())
                .status(LikeStatus.PENDING)
                .build();

        likeRepository.save(like);

        // Check for mutual like
        likeRepository.findBySenderAndReceiver(receiver, sender)
                .filter(l -> l.getStatus() == LikeStatus.PENDING)
                .ifPresent(receiverLike -> {
                    // Match!
                    like.setStatus(LikeStatus.ACCEPTED);
                    receiverLike.setStatus(LikeStatus.ACCEPTED);
                    likeRepository.save(like);
                    likeRepository.save(receiverLike);
                    
                    matchingService.createMatch(sender, receiver, like.getId());
                });

        // Send notification for Star Like if not a match already
        if (request.getType() == LikeType.STAR && like.getStatus() == LikeStatus.PENDING) {
            notificationService.createNotification(
                    receiver,
                    "You received a Star Like!",
                    sender.getFullName() + " sent you a Star Like.",
                    NotificationType.STAR_LIKE_RECEIVED,
                    like.getId(),
                    "LIKE"
            );
        }
    }

    public ReceivedLikesPageResponse getReceivedLikes(User user, Pageable pageable) {
        Page<Like> likesPage = likeRepository.findByReceiverIdAndStatus(user.getId(), LikeStatus.PENDING, pageable);
        long totalCount = likeRepository.countByReceiverIdAndStatus(user.getId(), LikeStatus.PENDING);
        boolean isPremium = user.isPremiumActive();

        List<ReceivedLikeResponse> likes = likesPage.getContent().stream()
                .map(like -> mapToReceivedLikeResponse(like, isPremium))
                .collect(Collectors.toList());

        return ReceivedLikesPageResponse.builder()
                .likes(likes)
                .totalLikesCount(totalCount)
                .totalPages(likesPage.getTotalPages())
                .currentPage(likesPage.getNumber())
                .build();
    }

    private ReceivedLikeResponse mapToReceivedLikeResponse(Like like, boolean isPremium) {
        User sender = like.getSender();
        ReceivedLikeResponse.SenderDetails senderDetails;

        if (isPremium) {
            senderDetails = ReceivedLikeResponse.SenderDetails.builder()
                    .id(sender.getId())
                    .name(sender.getFullName())
                    .profileImageUrl(sender.getProfile() != null ? sender.getProfile().getPrimaryImageUrl() : null)
                    .age(sender.getProfile() != null ? sender.getProfile().getAge() : null)
                    .profession(sender.getProfile() != null ? sender.getProfile().getProfession() : null)
                    .district(sender.getProfile() != null ? sender.getProfile().getDistrict() : null)
                    .build();
        } else {
            // Blurred details for free users
            senderDetails = ReceivedLikeResponse.SenderDetails.builder()
                    .id(null)
                    .name("Hidden Name")
                    .profileImageUrl(null) // Should return a blurred placeholder or handle on frontend
                    .age(null)
                    .profession(null)
                    .district(null)
                    .build();
        }

        return ReceivedLikeResponse.builder()
                .likeId(isPremium ? like.getId() : null)
                .type(like.getType())
                .message(isPremium ? like.getMessage() : null)
                .createdAt(like.getCreatedAt())
                .isBlurred(!isPremium)
                .sender(senderDetails)
                .build();
    }
}
