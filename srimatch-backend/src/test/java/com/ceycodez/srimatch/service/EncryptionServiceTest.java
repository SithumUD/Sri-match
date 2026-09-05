package com.ceycodez.srimatch.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class EncryptionServiceTest {

    @Test
    @DisplayName("Should throw fatal IllegalStateException on startup if AES key is missing or under 32 chars")
    void testFailFastOnWeakOrMissingKey() {
        EncryptionService service = new EncryptionService();

        // 1. Null key
        ReflectionTestUtils.setField(service, "secretKey", null);
        assertThrows(IllegalStateException.class, service::validateKey);

        // 2. Blank key
        ReflectionTestUtils.setField(service, "secretKey", "   ");
        assertThrows(IllegalStateException.class, service::validateKey);

        // 3. Short key (< 32 characters)
        ReflectionTestUtils.setField(service, "secretKey", "too-short-key-16");
        assertThrows(IllegalStateException.class, service::validateKey);

        // 4. Valid 32+ character key
        ReflectionTestUtils.setField(service, "secretKey", "valid-32-chars-aes-encryption-key-for-srimatch-prod!!");
        assertDoesNotThrow(service::validateKey);
    }

    @Test
    @DisplayName("Should successfully encrypt and decrypt string using AES-256-GCM")
    void testEncryptAndDecryptString() {
        EncryptionService service = new EncryptionService();
        ReflectionTestUtils.setField(service, "secretKey", "valid-32-chars-aes-encryption-key-for-srimatch-prod!!");
        service.validateKey();

        String rawTotpSecret = "JBSWY3DPEHPK3PXP";
        String encrypted = service.encryptString(rawTotpSecret);

        assertNotNull(encrypted);
        assertNotEquals(rawTotpSecret, encrypted);

        String decrypted = service.decryptString(encrypted);
        assertEquals(rawTotpSecret, decrypted);
    }

    @Test
    @DisplayName("Should generate different ciphertexts for identical plaintext due to random IV")
    void testRandomIvProducesDifferentCiphertext() {
        EncryptionService service = new EncryptionService();
        ReflectionTestUtils.setField(service, "secretKey", "valid-32-chars-aes-encryption-key-for-srimatch-prod!!");
        service.validateKey();

        String plaintext = "SECRET_STRING_TO_ENCRYPT";
        String encrypted1 = service.encryptString(plaintext);
        String encrypted2 = service.encryptString(plaintext);

        assertNotEquals(encrypted1, encrypted2);
        assertEquals(plaintext, service.decryptString(encrypted1));
        assertEquals(plaintext, service.decryptString(encrypted2));
    }
}
