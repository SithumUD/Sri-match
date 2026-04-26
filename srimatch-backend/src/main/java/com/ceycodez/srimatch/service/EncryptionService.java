package com.ceycodez.srimatch.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.Key;
import java.util.Base64;

@Service
@Slf4j
public class EncryptionService {

    private static final String ALGORITHM = "AES";
    
    @Value("${app.security.verification.key:srimatch-secret-v-key-32chars-!!}")
    private String secretKey;

    public void encryptFile(Path filePath) throws Exception {
        byte[] fileContent = Files.readAllBytes(filePath);
        Key key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encryptedContent = cipher.doFinal(fileContent);
        Files.write(filePath, encryptedContent);
    }

    public byte[] decryptFile(Path filePath) throws Exception {
        byte[] encryptedContent = Files.readAllBytes(filePath);
        Key key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key);
        return cipher.doFinal(encryptedContent);
    }
}
