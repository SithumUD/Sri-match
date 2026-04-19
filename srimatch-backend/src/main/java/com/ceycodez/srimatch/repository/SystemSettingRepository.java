package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, String> {
    
    Optional<SystemSetting> findBySettingKey(String settingKey);
    
    List<SystemSetting> findBySettingGroup(String settingGroup);
}
