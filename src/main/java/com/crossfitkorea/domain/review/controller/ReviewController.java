package com.crossfitkorea.domain.review.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.review.dto.ReviewCreateRequest;
import com.crossfitkorea.domain.review.dto.ReviewDto;
import com.crossfitkorea.domain.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Review", description = "박스 후기 API")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "박스 후기 목록")
    @GetMapping("/boxes/{boxId}/reviews")
    public ResponseEntity<ApiResponse<Page<ReviewDto>>> getReviews(
        @PathVariable Long boxId,
        @PageableDefault(size = 10) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByBox(boxId, pageable)));
    }

    @Operation(summary = "후기 작성 (로그인 필요)")
    @PostMapping("/boxes/{boxId}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
        @PathVariable Long boxId,
        @Valid @RequestBody ReviewCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.createReview(boxId, request, userDetails.getUsername())));
    }

    @Operation(summary = "후기 수정")
    @PutMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
        @PathVariable Long reviewId,
        @Valid @RequestBody ReviewCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.updateReview(reviewId, request, userDetails.getUsername())));
    }

    @Operation(summary = "후기 삭제")
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
        @PathVariable Long reviewId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        reviewService.deleteReview(reviewId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
