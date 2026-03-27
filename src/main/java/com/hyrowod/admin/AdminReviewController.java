package com.hyrowod.admin;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.review.dto.ReviewDto;
import com.hyrowod.domain.review.entity.Review;
import com.hyrowod.domain.review.repository.ReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "어드민 리뷰 관리 API")
public class AdminReviewController {

    private final ReviewRepository reviewRepository;

    @Operation(summary = "[어드민] 전체 리뷰 목록")
    @GetMapping("/reviews")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<ReviewDto>>> getAllReviews(
        @RequestParam(required = false) Integer minRating,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<ReviewDto> reviews;
        if (minRating != null) {
            reviews = reviewRepository
                .findByActiveTrueAndRatingGreaterThanEqualOrderByCreatedAtDesc(minRating, pageable)
                .map(ReviewDto::from);
        } else {
            reviews = reviewRepository
                .findByActiveTrueOrderByCreatedAtDesc(pageable)
                .map(ReviewDto::from);
        }
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @Operation(summary = "[어드민] 리뷰 강제 삭제")
    @Transactional
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
        review.setActive(false);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
