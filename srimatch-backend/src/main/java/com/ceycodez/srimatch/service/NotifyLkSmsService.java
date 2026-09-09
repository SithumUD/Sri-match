package com.ceycodez.srimatch.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotifyLkSmsService {

    private final RestTemplate restTemplate;

    @Value("${notify.lk.user-id:}")
    private String userId;

    @Value("${notify.lk.api-key:}")
    private String apiKey;

    @Value("${notify.lk.sender-id:NotifyDEMO}")
    private String senderId;

    @Value("${notify.lk.api-url:https://app.notify.lk/api/v1/send}")
    private String apiUrl;

    @Value("${notify.lk.enabled:false}")
    private boolean enabled;

    /**
     * Normalizes phone number to standard Sri Lankan mobile format without leading plus (e.g. 947XXXXXXXX).
     */
    public String normalizePhoneNumber(String rawPhone) {
        if (rawPhone == null) return null;
        String digits = rawPhone.replaceAll("[^0-9]", "");
        if (digits.startsWith("07") && digits.length() == 10) {
            return "94" + digits.substring(1);
        } else if (digits.startsWith("947") && digits.length() == 11) {
            return digits;
        } else if (digits.length() == 9 && digits.startsWith("7")) {
            return "94" + digits;
        }
        return digits;
    }

    /**
     * Sends an SMS via Notify.lk gateway.
     *
     * @param toPhoneNumber recipient phone number
     * @param message SMS content
     * @return true if successful or simulated
     */
    public boolean sendSms(String toPhoneNumber, String message) {
        String normalizedTo = normalizePhoneNumber(toPhoneNumber);

        if (!enabled || userId == null || userId.isBlank() || apiKey == null || apiKey.isBlank()) {
            log.info("[SMS-DEV-SIMULATOR] Notify.lk is not enabled or credentials missing. Simulated SMS to {}: {}", normalizedTo, message);
            return true;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("user_id", userId.trim());
            body.add("api_key", apiKey.trim());
            body.add("sender_id", (senderId != null && !senderId.isBlank()) ? senderId.trim() : "NotifyDEMO");
            body.add("to", normalizedTo);
            body.add("message", message);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, requestEntity, String.class);

            log.info("Notify.lk SMS response status: {}, body: {}", response.getStatusCode(), response.getBody());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to send SMS via Notify.lk to {}: {}", normalizedTo, e.getMessage(), e);
            return false;
        }
    }
}
