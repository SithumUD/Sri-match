package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.AdminCreateUserRequest;
import com.ceycodez.srimatch.dto.request.AdminUserEditRequest;
import com.ceycodez.srimatch.dto.request.UserEditRequest;
import com.ceycodez.srimatch.dto.response.ProfileResponse;
import com.ceycodez.srimatch.dto.response.UserResponse;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.UserRole;
import com.ceycodez.srimatch.repository.RefreshTokenRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.ceycodez.srimatch.repository.UserVerificationRepository verificationRepository;
    private final ProfileService profileService;
    private final com.ceycodez.srimatch.repository.LikeRepository likeRepository;
    private final com.ceycodez.srimatch.repository.ReportRepository reportRepository;
    private final com.ceycodez.srimatch.repository.SubscriptionRepository subscriptionRepository;
    private final com.ceycodez.srimatch.repository.PaymentRepository paymentRepository;
    private final com.ceycodez.srimatch.repository.TikTokPromotionRepository tiktokPromotionRepository;
    private final NotifyLkSmsService notifyLkSmsService;

    public UserResponse getMyUserData(String email) {
        User user = getUserByEmail(email);
        return mapToResponse(user);
    }

    @Transactional
    public void requestPhoneVerificationOtp(String email, String rawPhoneNumber) {
        User user = getUserByEmail(email);
        String normalizedPhone = notifyLkSmsService.normalizePhoneNumber(rawPhoneNumber);
        if (normalizedPhone == null || normalizedPhone.length() < 9 || normalizedPhone.length() > 12) {
            throw new IllegalArgumentException("Invalid phone number format. Please provide a valid Sri Lankan mobile number.");
        }

        userRepository.findByPhoneNumber(normalizedPhone).ifPresent(existingUser -> {
            if (!existingUser.getId().equals(user.getId()) && existingUser.isPhoneVerified()) {
                throw new IllegalStateException("This phone number is already registered and verified by another user.");
            }
        });

        String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1_000_000));
        user.setPhoneOtp(otp);
        user.setPhoneOtpPending(normalizedPhone);
        user.setPhoneOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        notifyLkSmsService.sendSms(
                normalizedPhone,
                "Your SriMatch phone verification code is: " + otp + ". Valid for 10 minutes."
        );
    }

    @Transactional
    public UserResponse verifyPhoneNumberOtp(String email, String otp) {
        User user = getUserByEmail(email);

        if (user.getPhoneOtp() == null || user.getPhoneOtpPending() == null || user.getPhoneOtpExpiresAt() == null) {
            throw new IllegalArgumentException("No pending phone verification found. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(user.getPhoneOtpExpiresAt())) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new OTP.");
        }

        if (!user.getPhoneOtp().equals(otp.trim())) {
            throw new IllegalArgumentException("Invalid verification code. Please check and try again.");
        }

        user.setPhoneNumber(user.getPhoneOtpPending());
        user.setPhoneVerified(true);
        user.setPhoneOtp(null);
        user.setPhoneOtpExpiresAt(null);
        user.setPhoneOtpPending(null);

        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateMyUser(String email, UserEditRequest request) {
        User user = getUserByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void softDeleteOwnAccount(String email) {
        User user = getUserByEmail(email);
        performSoftDelete(user);
    }

    @Transactional
    public void updateFcmToken(String email, String token) {
        User user = getUserByEmail(email);
        user.setFcmToken(token);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse updateNotificationPreferences(String email, java.util.Map<String, Object> prefs) {
        User user = getUserByEmail(email);
        user.setNotificationPreferences(prefs);
        return mapToResponse(userRepository.save(user));
    }

    // Admin methods
    @Transactional
    public UserResponse adminCreateUser(AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .emailVerified(true) // Admin created users can be presumed verified or handled manually
                .phoneVerified(false)
                .profileCompleted(false)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse adminUpdateUser(String targetEmail, AdminUserEditRequest request) {
        User user = getUserByEmail(targetEmail);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setEmailVerified(request.isEmailVerified());
        user.setPhoneVerified(request.isPhoneVerified());
        user.setProfileCompleted(request.isProfileCompleted());
        user.setPremium(request.isPremium());
        
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void adminChangeRole(String targetEmail, UserRole role) {
        User user = getUserByEmail(targetEmail);
        user.setRole(role);
        userRepository.save(user);
    }

    @Transactional
    public void adminLockAccount(String targetEmail, LocalDateTime lockUntil) {
        User user = getUserByEmail(targetEmail);
        // If lockUntil is null, it can be interpreted as permanent or some default far future
        // For "permanent", we can set a very far date if the system expects a date, 
        // but User.isAccountNonLocked() handles null as not locked.
        // Wait, User.java says: accountLockedUntil == null || accountLockedUntil.isBefore(now)
        // So for permanent lock, I should set a date far in the future if User.java isn't changed.
        // Or I can change User.java to handle a 'permanentlyLocked' boolean.
        // However, the user said "lock any user account untill some time date".
        // If they said "yes" to infinite lock, I'll use a very far date for now to keep it simple, 
        // OR I can modify User.java to handle null as permanent if I want.
        // Let's use 9999-12-31 for permanent if date is null.
        
        if (lockUntil == null) {
            user.setAccountLockedUntil(LocalDateTime.of(9999, 12, 31, 23, 59));
        } else {
            user.setAccountLockedUntil(lockUntil);
        }
        userRepository.save(user);
    }

    @Transactional
    public void adminSoftDeleteUser(String targetEmail) {
        User user = getUserByEmail(targetEmail);
        performSoftDelete(user);
    }

    @Transactional
    public void adminHardDeleteUser(String targetEmail) {
        User user = getUserByEmail(targetEmail);
        userRepository.delete(user);
    }

    @Transactional
    public void purgeSoftDeletedUsers() {
        List<User> softDeletedUsers = userRepository.findAll().stream()
                .filter(User::isDeleted)
                .collect(Collectors.toList());
        
        userRepository.deleteAll(softDeletedUsers);
    }

    private void performSoftDelete(User user) {
        LocalDateTime now = LocalDateTime.now();
        user.setDeleted(true);
        user.setDeletedAt(now);
        
        // Cascading soft delete to profile
        Profile profile = user.getProfile();
        if (profile != null) {
            profile.setDeleted(true);
            profile.setDeletedAt(now);
        }
        
        // Revoke refresh tokens as approved
        refreshTokenRepository.deleteByUser(user);
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public com.ceycodez.srimatch.dto.response.AdminUserDetailResponse getAdminUserDetail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        UserResponse userResp = mapToResponse(user);
        ProfileResponse profileResp = profileService.getProfileByUserId(user.getId());

        // Likes
        List<com.ceycodez.srimatch.model.Like> sentLikesList = likeRepository.findBySenderOrderByCreatedAtDesc(user);
        List<com.ceycodez.srimatch.model.Like> receivedLikesList = likeRepository.findByReceiverOrderByCreatedAtDesc(user);

        List<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminLikeItem> sentLikes = sentLikesList.stream()
                .map(l -> {
                    User r = l.getReceiver();
                    com.ceycodez.srimatch.model.Profile rp = r.getProfile();
                    return com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminLikeItem.builder()
                            .id(l.getId())
                            .targetUserId(r.getId())
                            .targetUserName(r.getFirstName() + " " + r.getLastName())
                            .targetUserEmail(r.getEmail())
                            .targetUserImage(rp != null ? rp.getPrimaryImageUrl() : null)
                            .targetUserAge(rp != null ? rp.getAge() : null)
                            .targetUserCity(rp != null ? rp.getCity() : null)
                            .type(l.getType() != null ? l.getType().name() : "LIKE")
                            .status(l.getStatus() != null ? l.getStatus().name() : "PENDING")
                            .createdAt(l.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        List<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminLikeItem> receivedLikes = receivedLikesList.stream()
                .map(l -> {
                    User s = l.getSender();
                    com.ceycodez.srimatch.model.Profile sp = s.getProfile();
                    return com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminLikeItem.builder()
                            .id(l.getId())
                            .targetUserId(s.getId())
                            .targetUserName(s.getFirstName() + " " + s.getLastName())
                            .targetUserEmail(s.getEmail())
                            .targetUserImage(sp != null ? sp.getPrimaryImageUrl() : null)
                            .targetUserAge(sp != null ? sp.getAge() : null)
                            .targetUserCity(sp != null ? sp.getCity() : null)
                            .type(l.getType() != null ? l.getType().name() : "LIKE")
                            .status(l.getStatus() != null ? l.getStatus().name() : "PENDING")
                            .createdAt(l.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        // Reports
        List<com.ceycodez.srimatch.model.Report> sentReportsList = reportRepository.findByReporterOrderByCreatedAtDesc(user);
        List<com.ceycodez.srimatch.model.Report> receivedReportsList = reportRepository.findByReportedUserOrderByCreatedAtDesc(user);

        List<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminReportItem> sentReports = sentReportsList.stream()
                .map(rep -> {
                    User ru = rep.getReportedUser();
                    com.ceycodez.srimatch.model.Profile rup = ru != null ? ru.getProfile() : null;
                    return com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminReportItem.builder()
                            .id(rep.getId())
                            .otherUserId(ru != null ? ru.getId() : null)
                            .otherUserName(ru != null ? ru.getFirstName() + " " + ru.getLastName() : "Unknown")
                            .otherUserEmail(ru != null ? ru.getEmail() : null)
                            .otherUserImage(rup != null ? rup.getPrimaryImageUrl() : null)
                            .reason(rep.getReason() != null ? rep.getReason().name() : "OTHER")
                            .description(rep.getDescription())
                            .status(rep.getStatus() != null ? rep.getStatus().name() : "PENDING")
                            .adminNotes(rep.getAdminNotes())
                            .evidenceUrls(rep.getEvidenceUrls())
                            .createdAt(rep.getCreatedAt())
                            .resolvedAt(rep.getResolvedAt())
                            .build();
                })
                .collect(Collectors.toList());

        List<com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminReportItem> receivedReports = receivedReportsList.stream()
                .map(rep -> {
                    User r = rep.getReporter();
                    com.ceycodez.srimatch.model.Profile rp = r != null ? r.getProfile() : null;
                    return com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.AdminReportItem.builder()
                            .id(rep.getId())
                            .otherUserId(r != null ? r.getId() : null)
                            .otherUserName(r != null ? r.getFirstName() + " " + r.getLastName() : "Unknown")
                            .otherUserEmail(r != null ? r.getEmail() : null)
                            .otherUserImage(rp != null ? rp.getPrimaryImageUrl() : null)
                            .reason(rep.getReason() != null ? rep.getReason().name() : "OTHER")
                            .description(rep.getDescription())
                            .status(rep.getStatus() != null ? rep.getStatus().name() : "PENDING")
                            .adminNotes(rep.getAdminNotes())
                            .evidenceUrls(rep.getEvidenceUrls())
                            .createdAt(rep.getCreatedAt())
                            .resolvedAt(rep.getResolvedAt())
                            .build();
                })
                .collect(Collectors.toList());

        // Subscriptions
        List<com.ceycodez.srimatch.dto.response.SubscriptionResponse> subscriptions = subscriptionRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(com.ceycodez.srimatch.dto.response.SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());

        // TikTok promotions
        List<com.ceycodez.srimatch.dto.response.TikTokPromotionResponse> tiktokPromotions = tiktokPromotionRepository.findByUserOrderBySubmittedAtDesc(user).stream()
                .map(com.ceycodez.srimatch.dto.response.TikTokPromotionResponse::fromEntity)
                .collect(Collectors.toList());

        // Payments
        List<com.ceycodez.srimatch.dto.response.PaymentResponse> payments = paymentRepository.findByUserOrderBySubmittedAtDesc(user).stream()
                .map(com.ceycodez.srimatch.dto.response.PaymentResponse::fromEntity)
                .collect(Collectors.toList());

        return com.ceycodez.srimatch.dto.response.AdminUserDetailResponse.builder()
                .user(userResp)
                .profile(profileResp)
                .sentLikes(sentLikes)
                .receivedLikes(receivedLikes)
                .totalSentLikes(sentLikes.size())
                .totalReceivedLikes(receivedLikes.size())
                .sentReports(sentReports)
                .receivedReports(receivedReports)
                .totalSentReports(sentReports.size())
                .totalReceivedReports(receivedReports.size())
                .subscriptions(subscriptions)
                .tiktokPromotions(tiktokPromotions)
                .payments(payments)
                .build();
    }

    @Transactional(readOnly = true)
    public List<com.ceycodez.srimatch.dto.response.UserSessionResponse> getActiveSessions(String email, String currentToken) {
        User user = getUserByEmail(email);
        List<com.ceycodez.srimatch.model.RefreshToken> tokens = refreshTokenRepository
                .findByUserAndRevokedFalseAndExpiresAtAfterOrderByCreatedAtDesc(user, LocalDateTime.now());

        return tokens.stream().map(t -> {
            String ua = t.getUserAgent();
            String device = "Desktop Browser";
            if (ua != null) {
                if (ua.contains("Android") || ua.contains("Expo") || ua.contains("Mobile")) {
                    device = "Android Device";
                } else if (ua.contains("iPhone") || ua.contains("iPad")) {
                    device = "iOS Device";
                } else if (ua.contains("Macintosh")) {
                    device = "Mac · Safari/Chrome";
                } else if (ua.contains("Windows")) {
                    device = "Windows PC · Browser";
                } else if (ua.contains("Linux")) {
                    device = "Linux Workstation";
                }
            }
            boolean isCurrent = currentToken != null && t.getToken() != null && t.getToken().equals(currentToken);
            return com.ceycodez.srimatch.dto.response.UserSessionResponse.builder()
                    .id(t.getId())
                    .device(device)
                    .userAgent(ua)
                    .ipAddress(t.getIpAddress() != null ? t.getIpAddress() : "127.0.0.1")
                    .createdAt(t.getCreatedAt())
                    .expiresAt(t.getExpiresAt())
                    .current(isCurrent)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void revokeSession(String email, Long sessionId) {
        User user = getUserByEmail(email);
        com.ceycodez.srimatch.model.RefreshToken token = refreshTokenRepository.findByIdAndUser(sessionId, user)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        refreshTokenRepository.delete(token);
    }

    @Transactional
    public void revokeOtherSessions(String email) {
        User user = getUserByEmail(email);
        // Delete all refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);
    }

    private UserResponse mapToResponse(User user) {
        boolean isIdVerified = user.getProfile() != null && user.getProfile().isIdVerified();
        String verificationStatus = verificationRepository.findByUser(user)
                .map(v -> v.getStatus().name())
                .orElse(isIdVerified ? "APPROVED" : "NOT_SUBMITTED");

        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .profileCompleted(user.isProfileCompleted())
                .hasProfile(user.getProfile() != null)
                .idVerified(isIdVerified)
                .verificationStatus(verificationStatus)
                .premium(user.isPremium())
                .premiumExpiryDate(user.getPremiumExpiryDate())
                .lastLoginAt(user.getLastLoginAt())
                .accountLockedUntil(user.getAccountLockedUntil())
                .isDeleted(user.isDeleted())
                .deletedAt(user.getDeletedAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .notificationPreferences(user.getNotificationPreferences())
                .totpEnabled(user.isTotpEnabled())
                .readReceiptsEnabled(user.isReadReceiptsEnabled())
                .build();
    }
}