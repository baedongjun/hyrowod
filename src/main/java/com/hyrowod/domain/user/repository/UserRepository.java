package com.hyrowod.domain.user.repository;

import com.hyrowod.domain.user.entity.AuthProvider;
import com.hyrowod.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hyrowod.domain.user.entity.UserRole;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);

    @Query("SELECT u FROM User u WHERE " +
        "(:keyword IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
        "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT u FROM User u WHERE " +
        "(COALESCE(:keyword, '') = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
        "AND (:role IS NULL OR u.role = :role) " +
        "AND (:active IS NULL OR u.active = :active) " +
        "ORDER BY u.createdAt DESC",
        countQuery = "SELECT count(u) FROM User u WHERE " +
        "(COALESCE(:keyword, '') = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
        "AND (:role IS NULL OR u.role = :role) " +
        "AND (:active IS NULL OR u.active = :active)")
    Page<User> searchUsersAdmin(
        @Param("keyword") String keyword,
        @Param("role") UserRole role,
        @Param("active") Boolean active,
        Pageable pageable
    );
}
