package com.crossfitkorea.domain.badge.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.badge.dto.BadgeDto;
import com.crossfitkorea.domain.badge.service.BadgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/badges")
@RequiredArgsConstructor
@Tag(name = "Badge", description = "배지 API")
public class BadgeController {

    private final BadgeService badgeService;

    @Operation(summary = "내 배지 목록")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<BadgeDto>>> getMyBadges(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            badgeService.getMyBadges(userDetails.getUsername())));
    }

    @Operation(summary = "특정 유저 배지 목록 (공개)")
    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<List<BadgeDto>>> getUserBadges(
        @PathVariable Long userId
    ) {
        return ResponseEntity.ok(ApiResponse.success(badgeService.getUserBadges(userId)));
    }
}
