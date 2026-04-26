package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.model.City;
import com.ceycodez.srimatch.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/locations/cities")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminLocationController {

    private final CityRepository cityRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<City>>> getAllCities() {
        List<City> cities = cityRepository.findAllByOrderByNameEnAsc();
        return ResponseEntity.ok(ApiResponse.<List<City>>builder()
                .success(true)
                .message("All cities fetched successfully")
                .data(cities)
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<City>> addCity(@RequestBody City city) {
        city.setId(null); // Ensure a new record is created
        City savedCity = cityRepository.save(city);
        return ResponseEntity.ok(ApiResponse.<City>builder()
                .success(true)
                .message("City added successfully")
                .data(savedCity)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<City>> updateCity(@PathVariable Long id, @RequestBody City city) {
        if (!cityRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.<City>builder()
                    .success(false)
                    .message("City not found with ID: " + id)
                    .build());
        }
        city.setId(id);
        City updatedCity = cityRepository.save(city);
        return ResponseEntity.ok(ApiResponse.<City>builder()
                .success(true)
                .message("City updated successfully")
                .data(updatedCity)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCity(@PathVariable Long id) {
        if (!cityRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("City not found with ID: " + id)
                    .build());
        }
        cityRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("City deleted successfully")
                .build());
    }
}
