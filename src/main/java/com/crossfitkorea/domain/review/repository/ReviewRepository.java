package com.crossfitkorea.domain.review.repository;

import com.crossfitkorea.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByBoxIdAndActiveTrueOrderByCreatedAtDesc(Long boxId, Pageable pageable);

    Optional<Review> findByBoxIdAndUserIdAndActiveTrue(Long boxId, Long userId);

    boolean existsByBoxIdAndUserIdAndActiveTrue(Long boxId, Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.box.id = :boxId AND r.active = true")
    Double getAverageRatingByBoxId(@Param("boxId") Long boxId);

    long countByBoxIdAndActiveTrue(Long boxId);
}
