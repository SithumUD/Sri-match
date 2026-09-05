package com.ceycodez.srimatch.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@Slf4j
public class EncryptionService {

    private static final String FILE_ALGORITHM = "AES";
    private static final String GCM_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12; // 12 bytes for GCM
    private static final int GCM_TAG_LENGTH = 128; // 128 bit auth tag

    @Value("${app.security.verification.key}")
    private String secretKey;

    private final SecureRandom secureRandom = new SecureRandom();

    @PostConstruct
    public void validateKey() {
        if (secretKey == null || secretKey.isBlank() || secretKey.trim().length() < 32) {
            log.error("CRITICAL SECURITY CONFIGURATION FAILURE: 'app.security.verification.key' must be provided via environment variable and be at least 32 characters long.");
            throw new IllegalStateException("CRITICAL SECURITY ERROR: 'app.security.verification.key' must be configured and at least 32 characters in length. Server startup aborted.");
        }
        log.info("EncryptionService initialized successfully with valid 256-bit AES key specification.");
    }

    /**
     * Derives a consistent 256-bit (32 bytes) SecretKeySpec from the configured secretKey.
     */
    private SecretKeySpec getAesKey() {
        try {
            byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] hashedKey = sha.digest(keyBytes);
            return new SecretKeySpec(hashedKey, "AES");
        } catch (Exception e) {
            throw new RuntimeException("Failed to derive AES key", e);
        }
    }

    /**
     * Encrypts a string using AES-256-GCM and returns a URL-safe Base64 string containing [IV + Ciphertext].
     */
    public String encryptString(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(GCM_TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, getAesKey(), parameterSpec);

            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);

            return Base64.getUrlEncoder().withoutPadding().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            log.error("Error encrypting string: {}", e.getMessage());
            throw new RuntimeException("Encryption failure", e);
        }
    }

    /**
     * Decrypts an AES-256-GCM Base64-encoded string and returns the original plaintext.
     * If the string is not encrypted (e.g. legacy plain text), safely falls back to returning the text.
     */
    public String decryptString(String encryptedBase64) {
        if (encryptedBase64 == null || encryptedBase64.isEmpty()) {
            return encryptedBase64;
        }
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(encryptedBase64);
            if (decoded.length <= GCM_IV_LENGTH) {
                // Not a valid GCM payload, might be legacy plaintext
                return encryptedBase64;
            }

            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);

            byte[] cipherText = new byte[byteBuffer.remaining()];
            byteBuffer.get(cipherText);

            Cipher cipher = Cipher.getInstance(GCM_TRANSFORMATION);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, getAesKey(), parameterSpec);

            byte[] plainTextBytes = cipher.doFinal(cipherText);
            return new String(plainTextBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.warn("Could not decrypt string (may be legacy plaintext): {}", e.getMessage());
            return encryptedBase64;
        }
    }

    public void encryptFile(Path filePath) throws Exception {
        byte[] fileContent = Files.readAllBytes(filePath);
        Key key = getAesKey();
        Cipher cipher = Cipher.getInstance(FILE_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encryptedContent = cipher.doFinal(fileContent);
        Files.write(filePath, encryptedContent);
    }

    public byte[] decryptFile(Path filePath) throws Exception {
        byte[] encryptedContent = Files.readAllBytes(filePath);
        Key key = getAesKey();
        Cipher cipher = Cipher.getInstance(FILE_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(encryptedContent);
    }
}
