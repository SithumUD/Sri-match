package com.ceycodez.srimatch.repository.specification;

import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProfileSpecification {

    public static Specification<Profile> buildSpecification(ProfileSearchRequest request, Profile searcher, boolean isPremium, boolean shuffle) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter for active and visible profiles
            predicates.add(criteriaBuilder.isTrue(root.get("visible")));
            predicates.add(criteriaBuilder.isFalse(root.get("isDeleted")));

            // Exclude the searcher's own profile
            if (searcher != null) {
                predicates.add(criteriaBuilder.notEqual(root.get("id"), searcher.getId()));
            }

            // Essential Filters (Removed strict filtering to allow all profiles to be displayed)
            // Users can still use search filters manually to narrow down results.

            if (shuffle) {
                query.orderBy(criteriaBuilder.asc(criteriaBuilder.function("RAND", Double.class)));
            }

            // Basic Filters
            if (request.getGender() != null) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
            }

            if (request.getMaritalStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("maritalStatus"), request.getMaritalStatus()));
            }

            if (request.getHasChildren() != null) {
                predicates.add(criteriaBuilder.equal(root.get("hasChildren"), request.getHasChildren()));
            }

            if (request.getDistrict() != null && !request.getDistrict().isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("district"), request.getDistrict()));
            }

            if (request.getCity() != null && !request.getCity().isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("city"), request.getCity()));
            }

            if (request.getReligion() != null) {
                predicates.add(criteriaBuilder.equal(root.get("religion"), request.getReligion()));
            }

            if (request.getEthnicity() != null) {
                predicates.add(criteriaBuilder.equal(root.get("ethnicity"), request.getEthnicity()));
            }

            if (Boolean.TRUE.equals(request.getVerifiedOnly())) {
                predicates.add(criteriaBuilder.isTrue(root.get("idVerified")));
            }

            // Age Filter (Min/Max Age to DOB Range)
            if (request.getMinAge() != null || request.getMaxAge() != null) {
                LocalDate now = LocalDate.now();
                if (request.getMinAge() != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dateOfBirth"), now.minusYears(request.getMinAge())));
                }
                if (request.getMaxAge() != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dateOfBirth"), now.minusYears(request.getMaxAge() + 1)));
                }
            }

            // Advanced Filters (Only if isPremium is true)
            if (isPremium) {
                if (request.getEducationLevel() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("education"), request.getEducationLevel()));
                }
                if (request.getProfession() != null && !request.getProfession().isBlank()) {
                    predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("profession")), "%" + request.getProfession().toLowerCase() + "%"));
                }
                if (request.getIndustry() != null && !request.getIndustry().isBlank()) {
                    predicates.add(criteriaBuilder.equal(root.get("industry"), request.getIndustry()));
                }
                if (request.getIncomeRange() != null && !request.getIncomeRange().isBlank()) {
                    predicates.add(criteriaBuilder.equal(root.get("income"), request.getIncomeRange()));
                }
                if (request.getMinHeight() != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("height"), request.getMinHeight()));
                }
                if (request.getMaxHeight() != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("height"), request.getMaxHeight()));
                }
                if (request.getBodyType() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("bodyType"), request.getBodyType()));
                }
                if (request.getSmokingHabits() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("smoking"), request.getSmokingHabits()));
                }
                if (request.getDrinkingHabits() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("drinking"), request.getDrinkingHabits()));
                }
                if (request.getDietaryPreference() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("dietaryPreferences"), request.getDietaryPreference()));
                }
                if (request.getHoroscopeSign() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("horoscopeSign"), request.getHoroscopeSign()));
                }
                if (request.getInterests() != null && !request.getInterests().isBlank()) {
                    // This assumes the JSON column can be treated as text for simple like search, or use native function if needed
                    predicates.add(criteriaBuilder.like(root.get("interests").as(String.class), "%" + request.getInterests() + "%"));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
