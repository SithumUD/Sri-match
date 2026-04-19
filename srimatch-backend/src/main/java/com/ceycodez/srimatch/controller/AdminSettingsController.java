package com.ceycodez.srimatch.controller;

import com.ceycodez.srimatch.dto.response.ApiResponse;
import com.ceycodez.srimatch.model.SystemSetting;
import com.ceycodez.srimatch.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminSettingsController {

    private final SystemSettingService systemSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, List<SystemSetting>>>> getAllSettingsGrouped() {
        Map<String, List<SystemSetting>> response = systemSettingService.getAllSettingsGrouped();
        return ResponseEntity.ok(ApiResponse.<Map<String, List<SystemSetting>>>builder()
                .success(true)
                .message("System settings fetched successfully")
                .data(response)
                .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> updates) {
        systemSettingService.updateSettings(updates);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("System settings updated successfully")
                .build());
    }
}
