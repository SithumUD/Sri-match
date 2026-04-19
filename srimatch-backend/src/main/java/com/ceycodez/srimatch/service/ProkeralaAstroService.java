package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.Profile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProkeralaAstroService {

    private final RestTemplate restTemplate;
    private final ProkeralaAuthService authService;

    @Value("${prokerala.api.base-url}")
    private String baseUrl;

    /**
     * Get Horoscope Matching (Porutham) Analysis between two profiles.
     */
    public Object getMatchAnalysis(Profile boy, Profile girl) {
        String token = authService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));
        
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Prokerala V2 Porutham Endpoint
        String url = baseUrl + "/astrology/porutham";

        // Preparing Date-Time strings in ISO 8601 format (e.g. 2004-02-12T15:19:21+05:30)
        // Defaulting offset to +05:30 for Sri Lanka if not specified in coordinates/system
        try {
            String boyDob = java.net.URLEncoder.encode(formatDateTime(boy), java.nio.charset.StandardCharsets.UTF_8.name());
            String girlDob = java.net.URLEncoder.encode(formatDateTime(girl), java.nio.charset.StandardCharsets.UTF_8.name());

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("ayanamsa", 1)
                .queryParam("system", "tamil") // Standard for Sri Lankan/South Indian Porutham
                .queryParam("boy_dob", boyDob)
                .queryParam("boy_coordinates", boy.getLatitude() + "," + boy.getLongitude())
                .queryParam("girl_dob", girlDob)
                .queryParam("girl_coordinates", girl.getLatitude() + "," + girl.getLongitude())
                .queryParam("la", "en"); // Output language

            java.net.URI uri = builder.build(true).toUri(); // Use build(true) to indicate parameters are already encoded
            log.info("Requesting Horoscope Match from Prokerala: {}", uri);
            ResponseEntity<Object> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("Prokerala API error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Failed to fetch match analysis from Prokerala: {}", e.getMessage());
            throw new RuntimeException("Horoscope matching service is currently unavailable", e);
        }
    }

    private String formatDateTime(Profile profile) {
        if (profile.getDateOfBirth() == null) {
            throw new RuntimeException("Date of birth is missing for profile: " + profile.getId());
        }
        
        // Use 12:00:00 as default time if timeOfBirth is null
        java.time.LocalTime time = (profile.getTimeOfBirth() != null) ? profile.getTimeOfBirth() : java.time.LocalTime.of(12, 0);
        java.time.LocalDateTime dateTime = java.time.LocalDateTime.of(profile.getDateOfBirth(), time);
        
        // Sri Lanka Offset +05:30
        java.time.OffsetDateTime offsetDateTime = dateTime.atOffset(java.time.ZoneOffset.ofHoursMinutes(5, 30));
        return offsetDateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
