package com.ceycodez.srimatch.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import sibApi.TransactionalEmailsApi;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailSender;
import sibModel.SendSmtpEmailTo;

import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Async;
import java.util.Collections;

@Service
public class BrevoEmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private TransactionalEmailsApi apiInstance;

    @PostConstruct
    public void init() {
        // ✅ In SDK v7+, just create default instance
        apiInstance = new TransactionalEmailsApi();
        apiInstance.getApiClient().setApiKey(brevoApiKey); // set key here
    }

    @Async
    public void sendVerificationEmail(String toEmail, String toName, String otp) {
        SendSmtpEmail email = new SendSmtpEmail();

        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail("sithumudayangaofficial@gmail.com");
        sender.setName("SriMatch");
        email.setSender(sender);

        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        to.setName(toName);
        email.setTo(Collections.singletonList(to));

        email.setSubject("SriMatch - Verify Your Email Address");
        email.setHtmlContent(
                "<h2>Welcome to SriMatch!</h2>"
                        + "<p>Hello " + toName + ",</p>"
                        + "<p>Your OTP: <strong>" + otp + "</strong></p>"
                        + "<p>Expires in 24 hours.</p>"
        );

        try {
            apiInstance.sendTransacEmail(email);
            System.out.println("Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String toName, String otp) {
        SendSmtpEmail email = new SendSmtpEmail();

        SendSmtpEmailSender sender = new SendSmtpEmailSender();
        sender.setEmail("sithumudayangaofficial@gmail.com");
        sender.setName("SriMatch");
        email.setSender(sender);

        SendSmtpEmailTo to = new SendSmtpEmailTo();
        to.setEmail(toEmail);
        to.setName(toName);
        email.setTo(Collections.singletonList(to));

        email.setSubject("SriMatch - Password Reset Request");
        email.setHtmlContent(
                "<h2>Password Reset Support</h2>"
                        + "<p>Hello " + toName + ",</p>"
                        + "<p>We received a request to reset your password. Use the OTP below to proceed:</p>"
                        + "<h2 style='color: #4A90E2;'>" + otp + "</h2>"
                        + "<p>This OTP will expire in 15 minutes.</p>"
                        + "<p>If you did not request this, please ignore this email.</p>"
        );

        try {
            apiInstance.sendTransacEmail(email);
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending password reset email: " + e.getMessage());
        }
    }
}