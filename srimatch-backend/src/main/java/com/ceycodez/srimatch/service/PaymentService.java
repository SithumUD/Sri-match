package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.PaymentReviewRequest;
import com.ceycodez.srimatch.dto.response.PaymentResponse;
import com.ceycodez.srimatch.model.Payment;
import com.ceycodez.srimatch.model.Subscription;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.PaymentMethod;
import com.ceycodez.srimatch.model.enums.PaymentStatus;
import com.ceycodez.srimatch.model.enums.SubscriptionStatus;
import com.ceycodez.srimatch.repository.PaymentRepository;
import com.ceycodez.srimatch.repository.SubscriptionRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final SubscriptionService subscriptionService;

    @Transactional
    public PaymentResponse submitBankReceipt(Long userId, Long subscriptionId, MultipartFile receipt) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (!subscription.getUser().getId().equals(userId)) {
            throw new RuntimeException("Subscription does not belong to user");
        }

        if (subscription.getStatus() != SubscriptionStatus.PENDING) {
            throw new RuntimeException("Subscription is not in pending state");
        }

        String receiptUrl = cloudinaryService.uploadImage(receipt);
        
        // Calculate amount (apply offer if any)
        BigDecimal originalPrice = subscription.getPremiumPackage().getPrice();
        BigDecimal amount = originalPrice;
        Integer offer = subscription.getPremiumPackage().getOfferPercentage();
        if (offer != null && offer > 0) {
            BigDecimal discount = originalPrice.multiply(new BigDecimal(offer))
                    .divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
            amount = originalPrice.subtract(discount);
        }

        Payment payment = Payment.builder()
                .user(user)
                .subscription(subscription)
                .amount(amount)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .receiptUrl(receiptUrl)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        return PaymentResponse.fromEntity(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse reviewPayment(Long adminId, Long paymentId, PaymentReviewRequest request) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in pending state");
        }

        payment.setReviewedBy(admin);
        payment.setReviewedAt(LocalDateTime.now());
        
        if (request.isApproved()) {
            payment.setPaymentStatus(PaymentStatus.COMPLETED); // Mapping COMPLETED to Approved
            payment.setTransactionId(request.getTransactionId());
            
            // Activate subscription
            subscriptionService.activateSubscription(payment.getSubscription().getId());
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED); // Mapping FAILED to Rejected
            payment.setRejectionReason(request.getRejectionReason());
            
            // Mark subscription as cancelled/failed
            Subscription sub = payment.getSubscription();
            sub.setStatus(SubscriptionStatus.CANCELLED);
            subscriptionRepository.save(sub);
        }

        return PaymentResponse.fromEntity(paymentRepository.save(payment));
    }

    public List<PaymentResponse> getPendingPayments() {
        return paymentRepository.findByPaymentStatus(PaymentStatus.PENDING).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getUserPayments(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return paymentRepository.findByUser(user).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public boolean hasPendingPayment(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return paymentRepository.existsByUserAndPaymentStatus(user, PaymentStatus.PENDING);
    }
}
