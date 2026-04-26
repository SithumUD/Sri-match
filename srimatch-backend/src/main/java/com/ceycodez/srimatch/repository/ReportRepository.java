package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Report;
import com.ceycodez.srimatch.model.enums.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    long countByStatus(ReportStatus status);
    List<Report> findTop5ByOrderByCreatedAtDesc();
}
