package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.BankDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankDetailRepository extends JpaRepository<BankDetail, Long> {
    List<BankDetail> findByActiveTrue();
}
