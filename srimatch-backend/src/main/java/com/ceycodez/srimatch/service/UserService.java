package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.request.AdminCreateUserRequest;
import com.ceycodez.srimatch.dto.request.AdminUserEditRequest;
import com.ceycodez.srimatch.dto.request.UserEditRequest;
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

    public UserResponse getMyUserData(String email) {
        User user = getUserByEmail(email);
        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateMyUser(String email, UserEditRequest request) {
        User user = getUserByEmail(email);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
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

    private UserResponse mapToResponse(User user) {
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
                .premium(user.isPremium())
                .premiumExpiryDate(user.getPremiumExpiryDate())
                .lastLoginAt(user.getLastLoginAt())
                .accountLockedUntil(user.getAccountLockedUntil())
                .isDeleted(user.isDeleted())
                .deletedAt(user.getDeletedAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}