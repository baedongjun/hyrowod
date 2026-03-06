package com.crossfitkorea.domain.box.repository;

import com.crossfitkorea.domain.box.entity.Box;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoxRepository extends JpaRepository<Box, Long> {

    @Query("SELECT b FROM Box b WHERE b.active = true " +
           "AND (:city IS NULL OR b.city = :city) " +
           "AND (:district IS NULL OR b.district = :district) " +
           "AND (:keyword IS NULL OR b.name LIKE %:keyword% OR b.address LIKE %:keyword%) " +
           "ORDER BY b.premium DESC, b.rating DESC")
    Page<Box> searchBoxes(
        @Param("city") String city,
        @Param("district") String district,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    List<Box> findByPremiumTrueAndActiveTrueOrderByCreatedAtDesc();

    Page<Box> findByOwnerEmailAndActiveTrue(String email, Pageable pageable);

    long countByActiveTrue();
}
