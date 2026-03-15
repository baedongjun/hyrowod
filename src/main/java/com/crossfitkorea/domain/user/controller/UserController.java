package com.crossfitkorea.domain.user.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.box.dto.BoxDto;
import com.crossfitkorea.domain.box.service.BoxFavoriteService;
import com.crossfitkorea.domain.review.dto.ReviewDto;
import com.crossfitkorea.domain.review.service.ReviewService;
import com.crossfitkorea.domain.user.dto.PasswordChangeRequest;
import com.crossfitkorea.domain.user.dto.UserDto;
import com.crossfitkorea.domain.user.dto.UserUpdateRequest;
import com.crossfitkorea.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 API")
public class UserController {

    private final UserService userService;
    private final ReviewService reviewService;
    private final BoxFavoriteService boxFavoriteService;

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMyInfo(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.getMyInfo(userDetails.getUsername())));
    }

    @Operation(summary = "내 정보 수정")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyInfo(
        @Valid @RequestBody UserUpdateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateMyInfo(userDetails.getUsername(), request)));
    }

    @Operation(summary = "비밀번호 변경")
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
        @Valid @RequestBody PasswordChangeRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "내 후기 목록")
    @GetMapping("/me/reviews")
    public ResponseEntity<ApiResponse<Page<ReviewDto>>> getMyReviews(
        @RequestParam(defaultValue = "0") int page,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(reviewService.getMyReviews(userDetails.getUsername(), pageable)));
    }

    @Operation(summary = "내 즐겨찾기 박스 목록")
    @GetMapping("/me/favorites")
    public ResponseEntity<ApiResponse<Page<BoxDto>>> getMyFavorites(
        @PageableDefault(size = 12) Pageable pageable,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            boxFavoriteService.getMyFavorites(userDetails.getUsername(), pageable)));
    }
}
