package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    List<AuditLog> findTop50ByOrderByCreatedAtDesc();
    List<AuditLog> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:query IS NULL OR " +
           "LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(a.entityType, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(a.details, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(a.ipAddress, '')) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<AuditLog> searchAudits(@Param("query") String query, Pageable pageable);
}
