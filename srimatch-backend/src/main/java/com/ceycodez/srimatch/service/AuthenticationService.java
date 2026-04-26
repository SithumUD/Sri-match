package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.*;
import com.ceycodez.srimatch.dto.response.AuthResponse;
import com.ceycodez.srimatch.model.OtpVerification;
import com.ceycodez.srimatch.model.RefreshToken;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.OtpType;
import com.ceycodez.srimatch.model.enums.UserRole;
import com.ceycodez.srimatch.repository.OtpVerificationRepository;
import com.ceycodez.srimatch.repository.RefreshTokenRepository;
import com.ceycodez.srimatch.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final BrevoEmailService emailService;
    private final JwtBlacklistService jwtBlacklistService;
    private final SocialAuthService socialAuthService;
    private final TotpService totpService;
    private final AuditLogService auditLogService;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    @Value("${application.security.jwt.remember-me.refresh-token.expiration}")
    private long rememberMeRefreshTokenExpiration;

    // ============================================================
    // REGISTRATION
    // ============================================================
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.USER)
                .emailVerified(false)
                .phoneVerified(false)
                .profileCompleted(false)
                .agreeToTerms(request.isAgreeToTerms())
                .agreeToMarketing(request.isAgreeToMarketing())
                .build();

        userRepository.save(user);

        String otp = generateOtp();
        OtpVerification otpVerification = OtpVerification.builder()
                .identifier(user.getEmail())
                .otp(otp)
                .type(OtpType.EMAIL)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        otpVerificationRepository.save(otpVerification);

        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), otp);
    }

    // ============================================================
    // STANDARD LOGIN (with brute-force protection + TOTP for admins)
    // ============================================================
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if account is locked
        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            long minutesLeft = java.time.Duration.between(LocalDateTime.now(), user.getAccountLockedUntil()).toMinutes() + 1;
            throw new LockedException("Account is temporarily locked. Try again in " + minutesLeft + " minute(s).");
        }

        // Authenticate password
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            handleFailedLogin(user);
            int remaining = MAX_FAILED_ATTEMPTS - user.getFailedLoginAttempts();
            if (remaining <= 0) {
                throw new LockedException("Too many failed attempts. Account locked for " + LOCKOUT_DURATION_MINUTES + " minutes.");
            }
            throw new RuntimeException("Invalid email or password. " + remaining + " attempt(s) remaining.");
        }

        // If admin and 2FA is enabled, validate TOTP code
        if (isAdmin(user) && user.isTotpEnabled()) {
            if (request.getTotpCode() == null) {
                throw new RuntimeException("MFA_REQUIRED: Please provide your 2FA authenticator code.");
            }
            if (!totpService.validate(user.getTotpSecret(), request.getTotpCode())) {
                throw new RuntimeException("Invalid 2FA code. Please try again.");
            }
        }

        // Successful login — reset lockout counters
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user, request.isRememberMe());
        String refreshToken = generateAndSaveRefreshToken(user, request.isRememberMe());

        boolean hasProfile = user.getProfile() != null;
        Integer completionScore = hasProfile ? user.getProfile().getCompletionScore() : null;

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .isProfileCompleted(user.isProfileCompleted())
                .hasProfile(hasProfile)
                .profileCompletionScore(completionScore)
                .build();
    }

    // ============================================================
    // SOCIAL LOGIN (Google / Facebook)
    // ============================================================
    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        SocialAuthService.SocialUserInfo userInfo;

        switch (request.getProvider().toUpperCase()) {
            case "GOOGLE":
                userInfo = socialAuthService.verifyGoogleToken(request.getToken());
                break;
            case "FACEBOOK":
                userInfo = socialAuthService.verifyFacebookToken(request.getToken());
                break;
            default:
                throw new RuntimeException("Unsupported social login provider: " + request.getProvider());
        }

        // Find existing user by email OR create a new one
        User user = userRepository.findByEmail(userInfo.email()).orElseGet(() -> {
            User newUser = User.builder()
                    .firstName(userInfo.firstName())
                    .lastName(userInfo.lastName().isBlank() ? "" : userInfo.lastName())
                    .email(userInfo.email())
                    .password(passwordEncoder.encode(UUID.randomUUID().toString())) // random unusable password
                    .role(UserRole.USER)
                    .emailVerified(true) // social login means email is pre-verified
                    .phoneVerified(false)
                    .profileCompleted(false)
                    .oauthProvider(userInfo.provider())
                    .oauthProviderId(userInfo.providerId())
                    .agreeToTerms(true)
                    .agreeToMarketing(false)
                    .build();
            return userRepository.save(newUser);
        });

        if (user.isDeleted()) {
            throw new RuntimeException("This account has been deactivated. Please contact support.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user, false);
        String refreshToken = generateAndSaveRefreshToken(user, false);

        boolean hasProfile = user.getProfile() != null;

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .email(user.getEmail())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .isProfileCompleted(user.isProfileCompleted())
                .hasProfile(hasProfile)
                .profileCompletionScore(hasProfile ? user.getProfile().getCompletionScore() : null)
                .build();
    }

    // ============================================================
    // LOGOUT (JWT Blacklisting)
    // ============================================================
    @Transactional
    public void logout(String authorizationHeader, String email) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            LocalDateTime expiry = jwtService.extractExpiration(jwt).toInstant()
                    .atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();
            jwtBlacklistService.blacklistToken(jwt, email, expiry);
        }
        // Also revoke all refresh tokens for enhanced security
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        refreshTokenRepository.deleteByUser(user);
    }

    // ============================================================
    // ADMIN 2FA SETUP
    // ============================================================
    @Transactional
    public TotpService.TotpSetupResult setup2FA(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (!isAdmin(admin)) {
            throw new RuntimeException("2FA setup is only available for admin accounts");
        }
        TotpService.TotpSetupResult result = totpService.generateSecret(adminEmail);
        admin.setTotpSecret(result.secret());
        // Note: 2FA is NOT yet enabled until the admin confirms a successful TOTP code
        userRepository.save(admin);
        return result;
    }

    @Transactional
    public void confirm2FA(String adminEmail, int totpCode) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (admin.getTotpSecret() == null) {
            throw new RuntimeException("2FA setup has not been initiated. Call /v1/auth/2fa/setup first.");
        }
        if (!totpService.validate(admin.getTotpSecret(), totpCode)) {
            throw new RuntimeException("Invalid 2FA code. Please scan the QR code again and retry.");
        }
        admin.setTotpEnabled(true);
        userRepository.save(admin);
        auditLogService.log(adminEmail, admin.getId(), "ADMIN_2FA_ENABLED", "USER", admin.getId(), "Admin enabled 2FA", null);
    }

    // ============================================================
    // EMAIL VERIFICATION
    // ============================================================
    @Transactional
    public void verifyEmail(VerifyOtpRequest request) {
        OtpVerification otpOpt = otpVerificationRepository
                .findTopByIdentifierAndTypeOrderByCreatedAtDesc(request.getIdentifier(), OtpType.EMAIL)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (otpOpt.isExpired()) {
            throw new RuntimeException("OTP is expired");
        }
        if (!otpOpt.getOtp().equals(request.getOtp())) {
            otpOpt.incrementAttempts();
            otpVerificationRepository.save(otpOpt);
            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository.findByEmail(request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmailVerified(true);
        user.setPhoneVerified(true); // Auto-verify phone as well for now
        userRepository.save(user);

        otpOpt.setVerified(true);
        otpVerificationRepository.save(otpOpt);
    }

    @Transactional
    public void updatePhoneNumberAndVerify(String email, PhoneVerificationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPhoneVerified(true);
        userRepository.save(user);
    }

    // ============================================================
    // TOKEN REFRESH
    // ============================================================
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.isExpired()) throw new RuntimeException("Refresh token is expired");
        if (refreshToken.isRevoked()) throw new RuntimeException("Refresh token is revoked");
        if (refreshToken.isUsed()) {
            refreshTokenRepository.deleteByUser(refreshToken.getUser());
            throw new RuntimeException("Refresh token has already been used. Potential reuse attack. All sessions revoked.");
        }

        User user = refreshToken.getUser();
        refreshToken.setUsed(true);
        refreshToken.setUsedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshToken);

        String jwtToken = jwtService.generateToken(user);
        String newRefreshToken = generateAndSaveRefreshToken(user, false);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(newRefreshToken)
                .role(user.getRole().name())
                .email(user.getEmail())
                .isEmailVerified(user.isEmailVerified())
                .isPhoneVerified(user.isPhoneVerified())
                .isProfileCompleted(user.isProfileCompleted())
                .build();
    }

    // ============================================================
    // PASSWORD MANAGEMENT
    // ============================================================
    @Transactional
    public void initiateForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email"));
        String otp = generateOtp();
        OtpVerification otpVerification = OtpVerification.builder()
                .identifier(user.getEmail())
                .otp(otp)
                .type(OtpType.PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        otpVerificationRepository.save(otpVerification);
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), otp);
    }

    @Transactional
    public void verifyPasswordResetOtp(VerifyOtpRequest request) {
        OtpVerification otpOpt = otpVerificationRepository
                .findTopByIdentifierAndTypeOrderByCreatedAtDesc(request.getIdentifier(), OtpType.PASSWORD_RESET)
                .orElseThrow(() -> new RuntimeException("OTP not found"));
        if (otpOpt.isExpired()) throw new RuntimeException("OTP is expired");
        if (!otpOpt.getOtp().equals(request.getOtp())) {
            otpOpt.incrementAttempts();
            otpVerificationRepository.save(otpOpt);
            throw new RuntimeException("Invalid OTP");
        }
        otpOpt.setVerified(true);
        otpVerificationRepository.save(otpOpt);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        OtpVerification otpOpt = otpVerificationRepository
                .findTopByIdentifierAndTypeOrderByCreatedAtDesc(request.getEmail(), OtpType.PASSWORD_RESET)
                .orElseThrow(() -> new RuntimeException("Verification session not found"));
        if (!otpOpt.isVerified()) throw new RuntimeException("OTP has not been verified. Please verify OTP first.");
        if (otpOpt.isExpired()) throw new RuntimeException("Verification session expired");

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpVerificationRepository.delete(otpOpt);
    }

    @Transactional
    public void updatePassword(String email, UpdatePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isEmailVerified()) throw new RuntimeException("Email is already verified");

        String otp = generateOtp();
        OtpVerification otpVerification = OtpVerification.builder()
                .identifier(user.getEmail())
                .otp(otp)
                .type(OtpType.EMAIL)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        otpVerificationRepository.save(otpVerification);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), otp);
    }

    // ============================================================
    // PRIVATE HELPERS
    // ============================================================
    private void handleFailedLogin(User user) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_DURATION_MINUTES));
            log.warn("Account locked for user: {} due to {} failed login attempts", user.getEmail(), attempts);
        }
        userRepository.save(user);
    }

    private boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.SUPER_ADMIN;
    }

    private String generateAndSaveRefreshToken(User user, boolean rememberMe) {
        long expirationTime = rememberMe ? rememberMeRefreshTokenExpiration : refreshTokenExpiration;
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusSeconds(expirationTime / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
