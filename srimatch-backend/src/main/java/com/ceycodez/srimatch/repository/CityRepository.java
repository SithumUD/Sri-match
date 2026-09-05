package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findAllByOrderByNameEnAsc();

    @Query("SELECT c FROM City c WHERE " +
           "LOWER(c.nameEn) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(c.nameSi, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(c.nameTa, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(c.subNameEn, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(c.postcode, '')) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<City> searchCities(@Param("query") String query, Pageable pageable);
}
