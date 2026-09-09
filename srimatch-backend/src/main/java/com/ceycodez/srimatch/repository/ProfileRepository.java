package com.ceycodez.srimatch.repository;

import com.ceycodez.srimatch.model.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {

    @EntityGraph(attributePaths = {"user"})
    Optional<Profile> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    Optional<Profile> findById(Long id);

    @EntityGraph(attributePaths = {"user"})
    Page<Profile> findAll(Specification<Profile> spec, Pageable pageable);

    boolean existsByUserId(Long userId);

    List<Profile> findByIsBoostedTrueAndBoostExpiresAtBefore(LocalDateTime now);

    // ── Cursor-based discovery queries with multi-factor ranking ──────────────────
    // Each query uses CASE WHEN to evaluate active boost at query time.
    // Sort priority: [primary field] → activeBoost → completionScore → id (stable tiebreaker)
    //
    // Boost is active when: is_boosted = TRUE AND (boost_expires_at IS NULL OR boost_expires_at > NOW())
    // These native queries are used by ProfileService.searchProfilesCursor.

    /**
     * Dynamic discovery (no sort): boost → completion score → id
     * LIMIT/OFFSET handled by Pageable.
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          COALESCE(p.completion_score, 0) DESC,
          RANDOM(),
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryDynamic(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );

    /**
     * Sort: Newest — primary: created_at DESC → boost → completionScore → id
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          p.created_at DESC,
          COALESCE(p.completion_score, 0) DESC,
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryNewest(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );

    /**
     * Sort: Age ascending (youngest first = date_of_birth DESC) → boost → completionScore → id
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          p.date_of_birth DESC,
          COALESCE(p.completion_score, 0) DESC,
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryAgeAsc(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );

    /**
     * Sort: Age descending (oldest first = date_of_birth ASC) → boost → completionScore → id
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          p.date_of_birth ASC,
          COALESCE(p.completion_score, 0) DESC,
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryAgeDesc(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );

    /**
     * Sort: Height ascending → boost → completionScore → id
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          p.height ASC NULLS LAST,
          COALESCE(p.completion_score, 0) DESC,
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryHeightAsc(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );

    /**
     * Sort: Height descending → boost → completionScore → id
     */
    @Query(value = """
        SELECT p.* FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE
          AND p.is_deleted = FALSE
          AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        ORDER BY
          CASE WHEN p.is_boosted = TRUE AND (p.boost_expires_at IS NULL OR p.boost_expires_at > NOW()) THEN 1 ELSE 0 END DESC,
          p.height DESC NULLS LAST,
          COALESCE(p.completion_score, 0) DESC,
          p.id DESC
        """,
        countQuery = """
        SELECT COUNT(*) FROM profiles p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.is_visible = TRUE AND p.is_deleted = FALSE AND u.is_deleted = FALSE
          AND u.is_profile_completed = TRUE
          AND (u.account_locked_until IS NULL OR u.account_locked_until < NOW())
          AND (:excludeId IS NULL OR p.id != :excludeId)
          AND (:gender IS NULL OR p.gender = :gender)
          AND (:minAge IS NULL OR p.date_of_birth <= (CURRENT_DATE - CAST((:minAge || ' years') AS interval)))
          AND (:maxAge IS NULL OR p.date_of_birth >= (CURRENT_DATE - CAST(((:maxAge + 1) || ' years') AS interval)))
          AND (:maritalStatus IS NULL OR p.marital_status = :maritalStatus)
          AND (:hasChildren IS NULL OR p.has_children = :hasChildren)
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
          AND (:religion IS NULL OR p.religion = :religion)
          AND (:ethnicity IS NULL OR p.ethnicity = :ethnicity)
          AND (:verifiedOnly IS NULL OR :verifiedOnly = FALSE OR p.id_verified = TRUE)
          AND (:minHeight IS NULL OR p.height >= :minHeight)
          AND (:maxHeight IS NULL OR p.height <= :maxHeight)
          AND (:educationLevel IS NULL OR p.education = :educationLevel)
          AND (:smokingHabits IS NULL OR p.smoking = :smokingHabits)
          AND (:drinkingHabits IS NULL OR p.drinking = :drinkingHabits)
          AND (:dietaryPreference IS NULL OR p.dietary_preferences = :dietaryPreference)
          AND (:incomeRange IS NULL OR p.income_range = :incomeRange)
          AND (:bodyType IS NULL OR p.body_type = :bodyType)
          AND (:interests IS NULL OR CAST(p.interests AS text) ~* :interests)
          AND (:profession IS NULL OR LOWER(p.profession) LIKE LOWER(CONCAT('%', :profession, '%')))
          AND (:industry IS NULL OR p.industry = :industry)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) IS NULL OR CAST(p.privacy_settings->>'showInSearchResults' AS boolean) = TRUE)
          AND (p.privacy_settings IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) IS NULL OR CAST(p.privacy_settings->>'visibleToVerifiedOnly' AS boolean) = FALSE OR :viewerVerified = TRUE)
        """,
        nativeQuery = true)
    Page<Profile> findDiscoveryHeightDesc(
        @Param("excludeId") Long excludeId,
        @Param("gender") String gender,
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge,
        @Param("maritalStatus") String maritalStatus,
        @Param("hasChildren") Boolean hasChildren,
        @Param("city") String city,
        @Param("religion") String religion,
        @Param("ethnicity") String ethnicity,
        @Param("verifiedOnly") Boolean verifiedOnly,
        @Param("minHeight") Integer minHeight,
        @Param("maxHeight") Integer maxHeight,
        @Param("educationLevel") String educationLevel,
        @Param("smokingHabits") String smokingHabits,
        @Param("drinkingHabits") String drinkingHabits,
        @Param("dietaryPreference") String dietaryPreference,
        @Param("incomeRange") String incomeRange,
        @Param("bodyType") String bodyType,
        @Param("interests") String interests,
        @Param("profession") String profession,
        @Param("industry") String industry,
        @Param("viewerVerified") Boolean viewerVerified,
        Pageable pageable
    );
}
