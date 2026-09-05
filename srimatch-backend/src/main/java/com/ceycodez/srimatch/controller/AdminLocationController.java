package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.model.City;
import com.ceycodez.srimatch.repository.CityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/v1/admin/locations/cities")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminLocationController {

    private final CityRepository cityRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<City>>> getAllCities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "nameEn") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page), size > 0 ? size : 15, sort);

        Page<City> citiesPage;
        if (search != null && !search.trim().isBlank()) {
            citiesPage = cityRepository.searchCities(search.trim(), pageable);
        } else {
            citiesPage = cityRepository.findAll(pageable);
        }

        return ResponseEntity.ok(ApiResponse.<Page<City>>builder()
                .success(true)
                .message("Cities fetched successfully")
                .data(citiesPage)
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
