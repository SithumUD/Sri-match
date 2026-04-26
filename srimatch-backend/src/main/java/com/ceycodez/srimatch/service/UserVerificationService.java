package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.dto.response.VerificationResponse;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.UserVerification;
import com.ceycodez.srimatch.model.enums.VerificationStatus;
import com.ceycodez.srimatch.model.enums.VerificationType;
import com.ceycodez.srimatch.repository.UserRepository;
import com.ceycodez.srimatch.repository.UserVerificationRepository;
import com.ceycodez.srimatch.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserVerificationService {

    private final UserVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final EncryptionService encryptionService;

    private static final String UPLOAD_DIR = "uploads/verifications/";

    @Transactional
    public VerificationResponse submitDocuments(User user, VerificationType type, MultipartFile front, MultipartFile back) throws Exception {
        // Cleanup existing if any
        verificationRepository.findByUser(user).ifPresent(v -> {
            deleteFiles(v);
            verificationRepository.delete(v);
        });

        String frontPath = saveAndEncrypt(front, user.getId(), "front");
        String backPath = back != null ? saveAndEncrypt(back, user.getId(), "back") : null;

        UserVerification verification = UserVerification.builder()
                .user(user)
                .type(type)
                .idFrontPath(frontPath)
                .idBackPath(backPath)
                .status(VerificationStatus.PENDING)
                .selfieSessionToken(UUID.randomUUID().toString())
                .build();

        return VerificationResponse.fromEntity(verificationRepository.save(verification));
    }

    @Transactional
    public void submitSelfie(String token, MultipartFile selfie) throws Exception {
        UserVerification v = verificationRepository.findBySelfieSessionToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid selfie session"));

        if (v.getStatus() != VerificationStatus.PENDING) {
            throw new RuntimeException("Verification request is not in pending state");
        }

        String selfiePath = saveAndEncrypt(selfie, v.getUser().getId(), "selfie");
        v.setSelfiePath(selfiePath);
        v.setStatus(VerificationStatus.UNDER_REVIEW);
        verificationRepository.save(v);
    }

    public List<VerificationResponse> getPendingVerifications() {
        return verificationRepository.findAll().stream()
                .filter(v -> v.getStatus() == VerificationStatus.UNDER_REVIEW || v.getStatus() == VerificationStatus.PENDING)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(VerificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public byte[] getDecryptedFile(Long id, String side) throws Exception {
        UserVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification not found"));
        
        String pathStr;
        switch (side.toLowerCase()) {
            case "front": pathStr = v.getIdFrontPath(); break;
            case "back": pathStr = v.getIdBackPath(); break;
            case "selfie": pathStr = v.getSelfiePath(); break;
            default: throw new RuntimeException("Invalid side");
        }

        if (pathStr == null) throw new RuntimeException("File not found");
        return encryptionService.decryptFile(Paths.get(pathStr));
    }

    @Transactional
    public void approve(Long id, String adminEmail) {
        UserVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification not found"));
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        v.setStatus(VerificationStatus.APPROVED);
        v.setResolvedAt(LocalDateTime.now());
        v.setResolvedBy(admin);
        
        // Update User/Profile status
        User user = v.getUser();
        if (user.getProfile() != null) {
            user.getProfile().setIdVerified(true);
            profileRepository.save(user.getProfile());
        }

        verificationRepository.save(v);
        
        // Cleanup files
        deleteFiles(v);
    }

    @Transactional
    public void reject(Long id, String adminEmail, String reason) {
        UserVerification v = verificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Verification not found"));
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        v.setStatus(VerificationStatus.REJECTED);
        v.setAdminNotes(reason);
        v.setResolvedAt(LocalDateTime.now());
        v.setResolvedBy(admin);
        
        verificationRepository.save(v);
        
        // Cleanup files
        deleteFiles(v);
    }

    private String saveAndEncrypt(MultipartFile file, Long userId, String label) throws Exception {
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) directory.mkdirs();

        String filename = userId + "_" + label + "_" + System.currentTimeMillis() + ".enc";
        Path filePath = Paths.get(UPLOAD_DIR, filename);
        
        Files.write(filePath, file.getBytes());
        encryptionService.encryptFile(filePath);
        
        return filePath.toString();
    }

    private void deleteFiles(UserVerification v) {
        try {
            if (v.getIdFrontPath() != null) Files.deleteIfExists(Paths.get(v.getIdFrontPath()));
            if (v.getIdBackPath() != null) Files.deleteIfExists(Paths.get(v.getIdBackPath()));
            if (v.getSelfiePath() != null) Files.deleteIfExists(Paths.get(v.getSelfiePath()));
        } catch (IOException e) {
            log.error("Failed to delete verification files: {}", e.getMessage());
        }
    }

    public VerificationResponse getMyVerification(User user) {
        return verificationRepository.findByUser(user)
                .map(VerificationResponse::fromEntity)
                .orElse(null);
    }
}
