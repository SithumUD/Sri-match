package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.CityResponse;
import com.ceycodez.srimatch.repository.CityRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/locations")
@RequiredArgsConstructor
@Tag(name = "Locations", description = "Endpoints for location-related data")
public class LocationController {

    private final CityRepository cityRepository;

    @GetMapping("/cities")
    @Operation(summary = "Get list of Sri Lankan cities with coordinates", description = "Returns a sorted list of cities in Sri Lanka with their latitudes and longitudes for birth place selection")
    public ResponseEntity<List<CityResponse>> getCities() {
        List<CityResponse> cities = cityRepository.findAllByOrderByNameEnAsc()
                .stream()
                .map(city -> CityResponse.builder()
                        .name(city.getNameEn())
                        .latitude(city.getLatitude())
                        .longitude(city.getLongitude())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(cities);
    }
}
