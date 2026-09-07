package com.ceycodez.srimatch.repository.specification;

import com.ceycodez.srimatch.dto.request.ProfileSearchRequest;
import com.ceycodez.srimatch.model.Profile;
import com.ceycodez.srimatch.model.User;
import com.ceycodez.srimatch.model.enums.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * JPA Specification for Profile discovery queries.
 *
 * Handles all eligibility filtering (WHO can be seen).
 * Ordering/ranking is applied separately in ProfileService via JPA Criteria orderBy,
 * keeping this specification focused purely on predicate composition.
 */
public class ProfileSpecification {

    /**
     * Build a Specification that enforces eligibility and filter predicates.
     *
     * @param request   The active search filter request
     * @param searcher  The profile of the current user (excluded from results)
     * @param isPremium Whether the current user has an active premium subscription
     */
    public static Specification<Profile> buildSpecification(
            ProfileSearchRequest request, Profile searcher, boolean isPremium) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // ── Eligibility: Profile must be visible and not soft-deleted ──────────────
            predicates.add(criteriaBuilder.isTrue(root.get("visible")));
            predicates.add(criteriaBuilder.isFalse(root.get("isDeleted")));

            // ── Eligibility: User account must be active ──────────────────────────────
            Join<Profile, User> userJoin = root.join("user");
            predicates.add(criteriaBuilder.isFalse(userJoin.get("isDeleted")));
            predicates.add(criteriaBuilder.isTrue(userJoin.get("profileCompleted")));
            // Exclude locked accounts (accountLockedUntil is null OR already passed)
            predicates.add(criteriaBuilder.or(
                    criteriaBuilder.isNull(userJoin.get("accountLockedUntil")),
                    criteriaBuilder.lessThan(userJoin.get("accountLockedUntil"), LocalDateTime.now())
            ));

            // ── Eligibility: Exclude current user's own profile ───────────────────────
            if (searcher != null) {
                predicates.add(criteriaBuilder.notEqual(root.get("id"), searcher.getId()));
            }

            // ── Basic Filters ─────────────────────────────────────────────────────────
            if (request.getGender() != null) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), request.getGender()));
            }
            if (request.getMaritalStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("maritalStatus"), request.getMaritalStatus()));
            }
            if (request.getHasChildren() != null) {
                predicates.add(criteriaBuilder.equal(root.get("hasChildren"), request.getHasChildren()));
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

            // ── Age Filter (Age → DOB range conversion) ───────────────────────────────
            if (request.getMinAge() != null || request.getMaxAge() != null) {
                LocalDate now = LocalDate.now();
                if (request.getMinAge() != null) {
                    // minAge=24 → must be born on or before (today - 24 years)
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(
                            root.get("dateOfBirth"), now.minusYears(request.getMinAge())));
                }
                if (request.getMaxAge() != null) {
                    // maxAge=30 → must be born on or after (today - 31 years)
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                            root.get("dateOfBirth"), now.minusYears(request.getMaxAge() + 1)));
                }
            }

            // ── Advanced Filters (Premium Users Only) ─────────────────────────────────
            if (isPremium) {
                if (request.getEducationLevel() != null) {
                    predicates.add(criteriaBuilder.equal(root.get("education"), request.getEducationLevel()));
                }
                if (request.getProfession() != null && !request.getProfession().isBlank()) {
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("profession")),
                            "%" + request.getProfession().toLowerCase() + "%"));
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
                if (request.getInterests() != null && !request.getInterests().isBlank()) {
                    predicates.add(criteriaBuilder.like(
                            root.get("interests").as(String.class),
                            "%" + request.getInterests() + "%"));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
