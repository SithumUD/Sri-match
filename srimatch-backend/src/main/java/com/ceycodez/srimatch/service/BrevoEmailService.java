package com.ceycodez.srimatch.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BrevoEmailService {

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:sithumudayangaofficial@gmail.com}")
    private String senderEmail;

    @Value("${brevo.sender.name:SriMatch}")
    private String senderName;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @PostConstruct
    public void init() {
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            String maskedKey = brevoApiKey.length() > 8
                    ? brevoApiKey.substring(0, 4) + "..." + brevoApiKey.substring(brevoApiKey.length() - 4)
                    : "***";
            log.info("Brevo Transactional Emails API initialized (Key: {}, Sender: {} <{}>)",
                    maskedKey, senderName, senderEmail);
        } else {
            log.warn("⚠️ No Brevo API key configured. Check environment variable BREVO_API_KEY.");
        }
    }

    @Async
    public void sendVerificationEmail(String toEmail, String toName, String otp) {
        String displayName = (toName != null && !toName.isBlank()) ? toName : "User";
        String subject = "💍 SriMatch - Verify Your Email Address (OTP: " + otp + ")";
        String htmlContent = buildVerificationEmailHtml(displayName, otp);

        log.info("\n========================================================\n"
                + "📧 [EMAIL OTP DISPATCH]\n"
                + "To: {}\n"
                + "Subject: {}\n"
                + "OTP CODE: {}\n"
                + "========================================================", toEmail, subject, otp);

        sendViaDirectRestApi(toEmail, displayName, subject, htmlContent, otp);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String toName, String otp) {
        String displayName = (toName != null && !toName.isBlank()) ? toName : "User";
        String subject = "🔐 SriMatch - Password Reset Request (OTP: " + otp + ")";
        String htmlContent = buildPasswordResetEmailHtml(displayName, otp);

        log.info("\n========================================================\n"
                + "📧 [PASSWORD RESET OTP DISPATCH]\n"
                + "To: {}\n"
                + "Subject: {}\n"
                + "OTP CODE: {}\n"
                + "========================================================", toEmail, subject, otp);

        sendViaDirectRestApi(toEmail, displayName, subject, htmlContent, otp);
    }

    private void sendViaDirectRestApi(String toEmail, String toName, String subject, String htmlContent, String otp) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.warn("⚠️ Cannot send email via Brevo: brevo.api.key is blank. (Use OTP: {} from server log)", otp);
            return;
        }

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", Map.of(
                    "name", senderName != null && !senderName.isBlank() ? senderName.trim() : "SriMatch",
                    "email", senderEmail != null && !senderEmail.isBlank() ? senderEmail.trim() : "sithumudayangaofficial@gmail.com"
            ));
            payload.put("to", List.of(Map.of(
                    "email", toEmail.trim(),
                    "name", toName != null && !toName.isBlank() ? toName.trim() : "User"
            )));
            payload.put("subject", subject);
            payload.put("htmlContent", htmlContent);

            String json = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey.trim())
                    .header("content-type", "application/json")
                    .timeout(Duration.ofSeconds(15))
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ Brevo email successfully dispatched to {} | HTTP {} | Response: {}",
                        toEmail, response.statusCode(), response.body());
            } else {
                log.error("❌ Brevo API rejected email to {} | HTTP {}: {} | (Use OTP: {} from server log)",
                        toEmail, response.statusCode(), response.body(), otp);
            }
        } catch (Exception e) {
            log.error("❌ Exception dispatching email to {} via Brevo: {} | (Use OTP: {} from server log)",
                    toEmail, e.getMessage(), otp, e);
        }
    }

    private String buildVerificationEmailHtml(String name, String otp) {
        String template = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SriMatch - Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f4f0; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(74, 21, 37, 0.09); border: 1px solid #f0e6de;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #4a1525 0%, #7b1d3a 50%, #a82e4e 100%); padding: 36px 30px; text-align: center;">
                      <div style="display: inline-block; padding: 6px 16px; background: rgba(255, 255, 255, 0.15); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.25); margin-bottom: 12px;">
                        <span style="color: #fce7a2; font-size: 12px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">✨ Sri Lankan Matrimony ✨</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                        Sri<span style="color: #fce7a2;">Match</span> <span style="font-size: 26px; color: #ff6b8b;">♥</span>
                      </h1>
                      <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">Find Your Auspicious Match</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 36px 32px 28px 32px;">
                      <h2 style="margin: 0 0 12px 0; color: #2d1820; font-size: 22px; font-weight: 700; text-align: center;">
                        Verify Your Email Address
                      </h2>
                      <p style="margin: 0 0 24px 0; color: #5c474e; font-size: 15px; line-height: 1.6; text-align: center;">
                        Hello <strong>{{name}}</strong>, welcome to <strong>SriMatch</strong>! Please enter the 6-digit verification code below to complete your registration:
                      </p>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(180deg, #fff8f5 0%, #feeee6 100%); border: 2px dashed #e8b49e; border-radius: 16px; padding: 24px 20px; text-align: center;">
                              <span style="display: block; font-size: 12px; font-weight: 700; color: #8c3f54; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">One-Time Verification Code</span>
                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #7b1d3a; margin: 4px 0;">
                                {{otp}}
                              </div>
                              <span style="display: inline-block; margin-top: 8px; font-size: 13px; color: #735960; background-color: rgba(255,255,255,0.85); padding: 4px 14px; border-radius: 12px;">
                                ⏱️ Expires in <strong>24 Hours</strong>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fdfbf7; border-left: 4px solid #d4af37; border-radius: 0 10px 10px 0; padding: 14px 16px; margin-bottom: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0; font-size: 13px; color: #6e542c; line-height: 1.5;">
                              <strong>🔒 Security Notice:</strong> Never share this OTP with anyone. SriMatch will never ask for this code outside of the registration process.
                            </p>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0; color: #8a7279; font-size: 13px; line-height: 1.5; text-align: center;">
                        If you did not request this verification, please safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #faf4f1; border-top: 1px solid #f0e3dc; padding: 24px 30px; text-align: center;">
                      <p style="margin: 0 0 6px 0; color: #7a6369; font-size: 13px; font-weight: 600;">
                        SriMatch — Sri Lanka's Premium Matrimonial Platform
                      </p>
                      <p style="margin: 0 0 10px 0; color: #9c8389; font-size: 12px;">
                        Need assistance? Contact <a href="mailto:support@srimatch.com" style="color: #7b1d3a; text-decoration: none; font-weight: 600;">support@srimatch.com</a>
                      </p>
                      <p style="margin: 0; color: #b8a3a9; font-size: 11px;">
                        © 2026 SriMatch. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
        return template.replace("{{name}}", name).replace("{{otp}}", otp);
    }

    private String buildPasswordResetEmailHtml(String name, String otp) {
        String template = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SriMatch - Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f6fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6fa; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(26, 43, 76, 0.09); border: 1px solid #e2e8f0;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%); padding: 36px 30px; text-align: center;">
                      <div style="display: inline-block; padding: 6px 16px; background: rgba(255, 255, 255, 0.15); border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.25); margin-bottom: 12px;">
                        <span style="color: #93c5fd; font-size: 12px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;">🔐 Account Security</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
                        Sri<span style="color: #fce7a2;">Match</span>
                      </h1>
                      <p style="margin: 6px 0 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">Password Reset Request</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 36px 32px 28px 32px;">
                      <h2 style="margin: 0 0 12px 0; color: #1e293b; font-size: 22px; font-weight: 700; text-align: center;">
                        Reset Your Password
                      </h2>
                      <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6; text-align: center;">
                        Hello <strong>{{name}}</strong>, we received a request to reset your SriMatch account password. Enter the OTP code below to set a new password:
                      </p>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                        <tr>
                          <td align="center">
                            <div style="background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px dashed #93c5fd; border-radius: 16px; padding: 24px 20px; text-align: center;">
                              <span style="display: block; font-size: 12px; font-weight: 700; color: #0369a1; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">Password Reset Code</span>
                              <div style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #0284c7; margin: 4px 0;">
                                {{otp}}
                              </div>
                              <span style="display: inline-block; margin-top: 8px; font-size: 13px; color: #0369a1; background-color: rgba(255,255,255,0.85); padding: 4px 14px; border-radius: 12px;">
                                ⏱️ Expires in <strong>15 Minutes</strong>
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 0 10px 10px 0; padding: 14px 16px; margin-bottom: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0; font-size: 13px; color: #713f12; line-height: 1.5;">
                              <strong>⚠️ Important:</strong> If you did not initiate this password reset request, please ignore this email or change your password immediately.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 30px; text-align: center;">
                      <p style="margin: 0 0 6px 0; color: #64748b; font-size: 13px; font-weight: 600;">
                        SriMatch — Sri Lanka's Premium Matrimonial Platform
                      </p>
                      <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">
                        Security questions? Contact <a href="mailto:support@srimatch.com" style="color: #0284c7; text-decoration: none; font-weight: 600;">support@srimatch.com</a>
                      </p>
                      <p style="margin: 0; color: #cbd5e1; font-size: 11px;">
                        © 2026 SriMatch. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
        return template.replace("{{name}}", name).replace("{{otp}}", otp);
    }
}