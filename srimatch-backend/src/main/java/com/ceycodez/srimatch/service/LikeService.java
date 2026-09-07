package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.SendLikeRequest;
import com.ceycodez.srimatch.dto.response.ReceivedLikeResponse;
import com.ceycodez.srimatch.dto.response.ReceivedLikesPageResponse;
import com.ceycodez.srimatch.dto.response.SendLikeResponse;
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

import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.repository.ProfileRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final NotificationService notificationService;
    private final MatchingService matchingService;

    @Transactional(readOnly = true)
    public com.ceycodez.srimatch.dto.response.LikeQuotaResponse getLikeQuota(User user) {
        boolean isPremium = user.isPremiumActive();
        if (isPremium) {
            return com.ceycodez.srimatch.dto.response.LikeQuotaResponse.builder()
                    .likeLimit(-1)
                    .likesUsed(user.getLikesUsed())
                    .likesRemaining(-1)
                    .resetsAt(null)
                    .canSendLike(true)
                    .isPremium(true)
                    .message("Unlimited likes (Premium Member)")
                    .build();
        }

        LocalDateTime resetsAt = user.getLastLikeReset() != null
                ? user.getLastLikeReset().plusDays(5)
                : LocalDateTime.now().plusDays(5);

        int limit = user.getLikeLimit() != null ? user.getLikeLimit() : 15;
        int used = user.getLikesUsed() != null ? user.getLikesUsed() : 0;
        int remaining = Math.max(0, limit - used);

        return com.ceycodez.srimatch.dto.response.LikeQuotaResponse.builder()
                .likeLimit(limit)
                .likesUsed(used)
                .likesRemaining(remaining)
                .resetsAt(resetsAt)
                .canSendLike(user.canSendLike())
                .isPremium(false)
                .message(remaining + "/" + limit + " likes remaining. Resets every 5 days.")
                .build();
    }

    @Transactional
    public SendLikeResponse sendLike(User sender, SendLikeRequest request) {
        // Find the profile first, then get the user owning that profile
        Profile targetProfile = profileRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Target profile not found"));

        User receiver = targetProfile.getUser();

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot like yourself");
        }

        // Idempotency check: if an active like already exists, return its current state
        // without creating a duplicate or charging quota again. This makes the endpoint
        // safe for retries caused by network drops, rapid taps, or tab-restore scenarios.
        Optional<Like> existingLike = likeRepository.findBySenderAndReceiver(sender, receiver);
        if (existingLike.isPresent()) {
            Like ex = existingLike.get();
            if (ex.getStatus() == LikeStatus.PENDING || ex.getStatus() == LikeStatus.ACCEPTED) {
                return SendLikeResponse.builder()
                        .interactionType(ex.getType().name())
                        .interactionStatus(ex.getStatus().name())
                        .build();
            }
        }

        // Check limits for normal likes — placed AFTER idempotency check so
        // retries of an already-sent like never burn an extra quota token.
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

        // Check for mutual like — if the other side already sent a PENDING like,
        // both become ACCEPTED and a Match record is created immediately.
        likeRepository.findBySenderAndReceiver(receiver, sender)
                .filter(l -> l.getStatus() == LikeStatus.PENDING)
                .ifPresent(receiverLike -> {
                    like.setStatus(LikeStatus.ACCEPTED);
                    receiverLike.setStatus(LikeStatus.ACCEPTED);
                    likeRepository.save(like);
                    likeRepository.save(receiverLike);

                    matchingService.createMatch(sender, receiver, like.getId());
                });

        // Send notification for likes if not a match already
        if (request.getType() == LikeType.STAR && like.getStatus() == LikeStatus.PENDING) {
            notificationService.createNotification(
                    receiver,
                    "You received a Star Like!",
                    sender.getFullName() + " sent you a Star Like.",
                    NotificationType.STAR_LIKE_RECEIVED,
                    like.getId(),
                    "LIKE",
                    "/connections"
            );
        } else if (request.getType() == LikeType.NORMAL && like.getStatus() == LikeStatus.PENDING) {
            notificationService.createNotification(
                    receiver,
                    "You have a new like!",
                    sender.getFullName() + " liked your profile.",
                    NotificationType.LIKE_RECEIVED,
                    like.getId(),
                    "LIKE",
                    "/connections"
            );
        }

        // Return authoritative state. interactionStatus will be "PENDING" for a normal
        // new like, or "ACCEPTED" if a mutual match was just created — the frontend
        // uses this in onSuccess to overwrite the optimistic guess with the real outcome.
        return SendLikeResponse.builder()
                .interactionType(like.getType().name())
                .interactionStatus(like.getStatus().name())
                .build();
    }

    public ReceivedLikesPageResponse getReceivedLikes(User user, String type, Pageable pageable) {
        Page<Like> likesPage;
        long totalCount;

        if (type != null && !type.isEmpty()) {
            LikeType likeType = LikeType.valueOf(type.toUpperCase());
            likesPage = likeRepository.findByReceiverIdAndStatusAndType(user.getId(), LikeStatus.PENDING, likeType, pageable);
            totalCount = likeRepository.countByReceiverIdAndStatusAndType(user.getId(), LikeStatus.PENDING, likeType);
        } else {
            likesPage = likeRepository.findByReceiverIdAndStatus(user.getId(), LikeStatus.PENDING, pageable);
            totalCount = likeRepository.countByReceiverIdAndStatus(user.getId(), LikeStatus.PENDING);
        }

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

    public Page<Like> getSentLikes(User sender, Pageable pageable) {
        return likeRepository.findBySenderId(sender.getId(), pageable);
    }

    /**
     * Check if the sender has liked the user who owns the given profileId.
     * Uses a direct JPQL query joining via receiver's profile ID to avoid user/profile ID mismatches.
     * Returns a map with only: liked (boolean) and type (NORMAL/STAR or null).
     */
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Map<String, Object> checkInteractionByProfileId(User sender, Long targetProfileId) {
        System.out.println("DEBUG: Checking like from Sender ID: " + sender.getId() + " to Profile ID: " + targetProfileId);
        
        Optional<Like> like = likeRepository.findBySenderIdAndReceiverProfileId(sender.getId(), targetProfileId);

        Map<String, Object> result = new java.util.LinkedHashMap<>();
        if (like.isPresent()) {
            System.out.println("DEBUG: Like FOUND! Like ID: " + like.get().getId());
            result.put("liked", true);
            result.put("type", like.get().getType().name());
        } else {
            System.out.println("DEBUG: No like found.");
            result.put("liked", false);
            result.put("type", null);
        }
        return result;
    }

    private ReceivedLikeResponse mapToReceivedLikeResponse(Like like, boolean isPremium) {
        User sender = like.getSender();
        Profile senderProfile = sender.getProfile();
        Profile receiverProfile = like.getReceiver().getProfile();
        ReceivedLikeResponse.SenderDetails senderDetails;

        if (isPremium) {
            senderDetails = ReceivedLikeResponse.SenderDetails.builder()
                    .id(sender.getId())
                    .firstName(sender.getFirstName())
                    .age(senderProfile != null ? senderProfile.getAge() : null)
                    .city(senderProfile != null ? senderProfile.getCity() : null)
                    .profession(senderProfile != null ? senderProfile.getProfession() : null)
                    .education(senderProfile != null && senderProfile.getEducation() != null ? senderProfile.getEducation().name() : null)
                    .religion(senderProfile != null && senderProfile.getReligion() != null ? senderProfile.getReligion().name() : null)
                    .about(senderProfile != null ? senderProfile.getAbout() : null)
                    .interests(senderProfile != null ? senderProfile.getInterests() : null)
                    .profileImage(senderProfile != null ? senderProfile.getPrimaryImageUrl() : null)
                    .compatibilityScore(receiverProfile != null && senderProfile != null ? (int) matchingService.calculateCompatibility(receiverProfile, senderProfile) : 0)
                    .interactionType(like.getType())
                    .interactionStatus(like.getStatus())
                    .verified(senderProfile != null && senderProfile.isIdVerified())
                    .boosted(senderProfile != null && senderProfile.isBoosted())
                    .build();
        } else {
            // Blurred details for free users
            senderDetails = ReceivedLikeResponse.SenderDetails.builder()
                    .id(null)
                    .firstName("Hidden")
                    .profileImage(senderProfile != null ? senderProfile.getPrimaryImageUrl() : null) // Frontend handle blurring
                    .age(null)
                    .city(null)
                    .profession(null)
                    .interactionType(like.getType())
                    .interactionStatus(like.getStatus())
                    .verified(false)
                    .boosted(false)
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
