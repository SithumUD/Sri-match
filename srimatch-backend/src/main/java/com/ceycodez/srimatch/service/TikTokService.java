package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.TikTokPackageRequest;
import com.ceycodez.srimatch.dto.request.TikTokPublishRequest;
import com.ceycodez.srimatch.dto.request.TikTokRejectRequest;
import com.ceycodez.srimatch.dto.response.TikTokPackageResponse;
import com.ceycodez.srimatch.dto.response.TikTokPromotionResponse;
import com.ceycodez.srimatch.model.Payment;
import com.ceycodez.srimatch.model.TikTokPackage;
import com.ceycodez.srimatch.model.TikTokPromotion;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.NotificationType;
import com.ceycodez.srimatch.model.enums.PaymentMethod;
import com.ceycodez.srimatch.model.enums.PaymentStatus;
import com.ceycodez.srimatch.model.enums.TikTokPromotionStatus;
import com.ceycodez.srimatch.repository.PaymentRepository;
import com.ceycodez.srimatch.repository.TikTokPackageRepository;
import com.ceycodez.srimatch.repository.TikTokPromotionRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TikTokService {

    private final TikTokPackageRepository packageRepository;
    private final TikTokPromotionRepository promotionRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final CloudinaryService cloudinaryService;
    private final NotificationService notificationService;

    // ─────────────────────────────────────────────────────────────
    // Public: Package Listing
    // ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TikTokPackageResponse> getActivePackages() {
        return packageRepository.findByActiveTrue().stream()
                .map(TikTokPackageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // User: Submit Promotion
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public TikTokPromotionResponse submitPromotion(Long userId, Long packageId, MultipartFile slip) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TikTokPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("TikTok package not found"));

        if (!pkg.isActive()) {
            throw new RuntimeException("This package is no longer available");
        }

        // Check no active/pending promotion already exists
        boolean alreadyActive = promotionRepository.existsByUserAndStatusIn(user,
                List.of(TikTokPromotionStatus.PENDING, TikTokPromotionStatus.PROCESSING, TikTokPromotionStatus.PUBLISHED));
        if (alreadyActive) {
            throw new RuntimeException("You already have an active or pending TikTok promotion");
        }

        // Upload bank slip via existing CloudinaryService
        String receiptUrl = cloudinaryService.uploadReceipt(slip);

        // Calculate amount (apply offer if any)
        BigDecimal price = pkg.getPrice();
        if (pkg.getOfferPercentage() != null && pkg.getOfferPercentage() > 0) {
            BigDecimal discount = price
                    .multiply(new BigDecimal(pkg.getOfferPercentage()))
                    .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            price = price.subtract(discount);
        }

        // Create promotion first (without payment FK — avoids circular dependency)
        TikTokPromotion promotion = TikTokPromotion.builder()
                .user(user)
                .tiktokPackage(pkg)
                .status(TikTokPromotionStatus.PENDING)
                .build();
        promotion = promotionRepository.save(promotion);

        // Create payment linked to this promotion
        Payment payment = Payment.builder()
                .user(user)
                .tiktokPromotion(promotion)
                .paymentType("TIKTOK")
                .amount(price)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .receiptUrl(receiptUrl)
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        payment = paymentRepository.save(payment);

        // Link payment back to promotion
        promotion.setPayment(payment);
        promotion = promotionRepository.save(promotion);

        log.info("TikTok promotion submitted: promotionId={}, userId={}, packageId={}", promotion.getId(), userId, packageId);
        return TikTokPromotionResponse.fromEntity(promotion);
    }

    // ─────────────────────────────────────────────────────────────
    // User: View Own Promotions
    // ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TikTokPromotionResponse> getUserPromotions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return promotionRepository.findByUserOrderBySubmittedAtDesc(user).stream()
                .map(TikTokPromotionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // Admin: List Promotions
    // ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TikTokPromotionResponse> adminListPromotions(String statusFilter) {
        List<TikTokPromotion> promotions;
        if (statusFilter == null || statusFilter.isBlank() || "ALL".equalsIgnoreCase(statusFilter)) {
            promotions = promotionRepository.findAllByOrderBySubmittedAtDesc();
        } else {
            TikTokPromotionStatus status = TikTokPromotionStatus.valueOf(statusFilter.toUpperCase());
            promotions = promotionRepository.findByStatusOrderBySubmittedAtDesc(status);
        }
        return promotions.stream()
                .map(TikTokPromotionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // Admin: Set PROCESSING
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public TikTokPromotionResponse adminSetProcessing(Long promotionId, Long adminId) {
        TikTokPromotion promotion = getPromotionOrThrow(promotionId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (promotion.getStatus() != TikTokPromotionStatus.PENDING) {
            throw new RuntimeException("Promotion is not in PENDING state");
        }

        // Approve the payment
        if (promotion.getPayment() != null) {
            promotion.getPayment().setPaymentStatus(PaymentStatus.COMPLETED);
            promotion.getPayment().setReviewedAt(LocalDateTime.now());
            promotion.getPayment().setReviewedBy(admin);
            paymentRepository.save(promotion.getPayment());
        }

        promotion.setStatus(TikTokPromotionStatus.PROCESSING);
        promotion.setProcessedBy(admin);
        promotion = promotionRepository.save(promotion);

        try {
            notificationService.createNotification(
                    promotion.getUser(),
                    "TikTok Promotion Processing",
                    "Your TikTok promotion payment has been approved! We are now creating your TikTok post.",
                    NotificationType.PAYMENT_STATUS_UPDATE,
                    promotion.getId(),
                    "TIKTOK_PROMOTION"
            );
        } catch (Exception e) {
            log.error("Failed to send processing notification: {}", e.getMessage());
        }

        return TikTokPromotionResponse.fromEntity(promotion);
    }

    // ─────────────────────────────────────────────────────────────
    // Admin: Publish with TikTok URL
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public TikTokPromotionResponse adminPublish(Long promotionId, Long adminId, TikTokPublishRequest request) {
        TikTokPromotion promotion = getPromotionOrThrow(promotionId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (promotion.getStatus() != TikTokPromotionStatus.PROCESSING
                && promotion.getStatus() != TikTokPromotionStatus.PENDING) {
            throw new RuntimeException("Promotion must be in PENDING or PROCESSING state to publish");
        }

        if (request.getTiktokPostUrl() == null || request.getTiktokPostUrl().isBlank()) {
            throw new RuntimeException("TikTok post URL is required");
        }

        // Approve payment if not already approved
        if (promotion.getPayment() != null
                && promotion.getPayment().getPaymentStatus() != PaymentStatus.COMPLETED) {
            promotion.getPayment().setPaymentStatus(PaymentStatus.COMPLETED);
            promotion.getPayment().setReviewedAt(LocalDateTime.now());
            promotion.getPayment().setReviewedBy(admin);
            paymentRepository.save(promotion.getPayment());
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(promotion.getTiktokPackage().getDurationDays());

        promotion.setStatus(TikTokPromotionStatus.PUBLISHED);
        promotion.setTiktokPostUrl(request.getTiktokPostUrl());
        promotion.setAdminNotes(request.getAdminNotes());
        promotion.setPublishedAt(now);
        promotion.setExpiresAt(expiresAt);
        promotion.setProcessedBy(admin);
        promotion = promotionRepository.save(promotion);

        try {
            notificationService.createNotification(
                    promotion.getUser(),
                    "🎉 Your TikTok Post is LIVE!",
                    "Your profile is now featured on TikTok for " + promotion.getTiktokPackage().getDurationDays()
                            + " day(s). View your post: " + request.getTiktokPostUrl(),
                    NotificationType.TIKTOK_PROMOTION_PUBLISHED,
                    promotion.getId(),
                    "TIKTOK_PROMOTION"
            );
        } catch (Exception e) {
            log.error("Failed to send publish notification: {}", e.getMessage());
        }

        log.info("TikTok promotion published: promotionId={}, url={}, expiresAt={}", promotionId, request.getTiktokPostUrl(), expiresAt);
        return TikTokPromotionResponse.fromEntity(promotion);
    }

    // ─────────────────────────────────────────────────────────────
    // Admin: Reject
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public TikTokPromotionResponse adminReject(Long promotionId, Long adminId, TikTokRejectRequest request) {
        TikTokPromotion promotion = getPromotionOrThrow(promotionId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (promotion.getStatus() == TikTokPromotionStatus.PUBLISHED
                || promotion.getStatus() == TikTokPromotionStatus.EXPIRED) {
            throw new RuntimeException("Cannot reject a published or expired promotion");
        }

        // Mark payment as failed
        if (promotion.getPayment() != null) {
            promotion.getPayment().setPaymentStatus(PaymentStatus.FAILED);
            promotion.getPayment().setRejectionReason(request.getRejectionReason());
            promotion.getPayment().setReviewedAt(LocalDateTime.now());
            promotion.getPayment().setReviewedBy(admin);
            paymentRepository.save(promotion.getPayment());
        }

        promotion.setStatus(TikTokPromotionStatus.REJECTED);
        promotion.setRejectionReason(request.getRejectionReason());
        promotion.setProcessedBy(admin);
        promotion = promotionRepository.save(promotion);

        try {
            notificationService.createNotification(
                    promotion.getUser(),
                    "TikTok Promotion Update",
                    "Your TikTok promotion request was not approved: "
                            + (request.getRejectionReason() != null ? request.getRejectionReason() : "Please contact support for details."),
                    NotificationType.TIKTOK_PROMOTION_REJECTED,
                    promotion.getId(),
                    "TIKTOK_PROMOTION"
            );
        } catch (Exception e) {
            log.error("Failed to send rejection notification: {}", e.getMessage());
        }

        return TikTokPromotionResponse.fromEntity(promotion);
    }

    // ─────────────────────────────────────────────────────────────
    // Admin: Package CRUD
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public TikTokPackageResponse createPackage(TikTokPackageRequest request) {
        TikTokPackage pkg = TikTokPackage.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationDays(request.getDurationDays())
                .offerPercentage(request.getOfferPercentage())
                .active(request.isActive())
                .build();
        return TikTokPackageResponse.fromEntity(packageRepository.save(pkg));
    }

    @Transactional
    public TikTokPackageResponse updatePackage(Long id, TikTokPackageRequest request) {
        TikTokPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TikTok package not found"));
        pkg.setName(request.getName());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setOfferPercentage(request.getOfferPercentage());
        pkg.setActive(request.isActive());
        return TikTokPackageResponse.fromEntity(packageRepository.save(pkg));
    }

    @Transactional
    public TikTokPackageResponse togglePackage(Long id) {
        TikTokPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TikTok package not found"));
        pkg.setActive(!pkg.isActive());
        return TikTokPackageResponse.fromEntity(packageRepository.save(pkg));
    }

    public List<TikTokPackageResponse> adminGetAllPackages() {
        return packageRepository.findAll().stream()
                .map(TikTokPackageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // Scheduler: Expire Promotions (called by BoostScheduler)
    // ─────────────────────────────────────────────────────────────

    @Transactional
    public void expirePromotions() {
        List<TikTokPromotion> expired = promotionRepository.findByStatusAndExpiresAtBefore(
                TikTokPromotionStatus.PUBLISHED, LocalDateTime.now());

        if (!expired.isEmpty()) {
            log.info("Expiring {} TikTok promotions", expired.size());
            for (TikTokPromotion promotion : expired) {
                promotion.setStatus(TikTokPromotionStatus.EXPIRED);
                try {
                    notificationService.createNotification(
                            promotion.getUser(),
                            "TikTok Promotion Ended",
                            "Your TikTok spotlight for \"" + promotion.getTiktokPackage().getName()
                                    + "\" has ended. Get featured again to boost your visibility!",
                            NotificationType.TIKTOK_PROMOTION_EXPIRED,
                            promotion.getId(),
                            "TIKTOK_PROMOTION"
                    );
                } catch (Exception e) {
                    log.error("Failed to send TikTok expiry notification: {}", e.getMessage());
                }
            }
            promotionRepository.saveAll(expired);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    private TikTokPromotion getPromotionOrThrow(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TikTok promotion not found with id: " + id));
    }
}
