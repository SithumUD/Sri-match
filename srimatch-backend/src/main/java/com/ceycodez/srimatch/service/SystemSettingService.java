package com.ceycodez.srimatch.service;

import com.ceycodez.srimatch.model.SystemSetting;
import com.ceycodez.srimatch.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;

    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    public Map<String, List<SystemSetting>> getAllSettingsGrouped() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        return settings.stream().collect(Collectors.groupingBy(SystemSetting::getSettingGroup));
    }

    public String getSettingValue(String key, String defaultValue) {
        return systemSettingRepository.findBySettingKey(key)
                .map(SystemSetting::getSettingValue)
                .orElse(defaultValue);
    }

    @Transactional
    public void updateSettings(Map<String, String> updates) {
        updates.forEach((key, value) -> {
            systemSettingRepository.findBySettingKey(key).ifPresent(setting -> {
                setting.setSettingValue(value);
                systemSettingRepository.save(setting);
            });
        });
    }
}
