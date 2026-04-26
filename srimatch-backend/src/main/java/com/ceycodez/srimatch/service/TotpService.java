package com.ceycodez.srimatch.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Manages Time-based One-Time Password (TOTP) for Admin Two-Factor Authentication.
 * Uses Google Authenticator compatible TOTP implementation.
 */
@Service
@RequiredArgsConstructor
public class TotpService {

    private static final String ISSUER = "SriMatch Admin";
    private final GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();

    /**
     * Generates a new TOTP secret key and returns the QR code URL for Google Authenticator enrollment.
     * @param adminEmail the email of the admin performing setup
     * @return a map containing the base32 secret and the otpauth:// URL for a QR code
     */
    public TotpSetupResult generateSecret(String adminEmail) {
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        String secret = key.getKey();
        String otpauthUrl = GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(ISSUER, adminEmail, key);
        return new TotpSetupResult(secret, otpauthUrl);
    }

    /**
     * Validates a user-provided TOTP code against the stored secret.
     */
    public boolean validate(String secret, int code) {
        return googleAuthenticator.authorize(secret, code);
    }

    public record TotpSetupResult(String secret, String otpauthUrl) {}
}
