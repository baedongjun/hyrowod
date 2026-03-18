package com.crossfitkorea.domain.competition.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.competition.dto.CompetitionDto;
import com.crossfitkorea.domain.competition.service.CompetitionRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/competitions")
@RequiredArgsConstructor
@Tag(name = "Competition Registration", description = "대회 참가 신청 API")
public class CompetitionRegistrationController {

    private final CompetitionRegistrationService registrationService;

    @Operation(summary = "내 대회 신청 목록")
    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<CompetitionDto>>> getMyRegistrations(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(registrationService.getMyRegistrations(userDetails.getUsername())));
    }

    @Operation(summary = "참가 신청 상태 조회")
    @GetMapping("/{id}/registration-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.success(registrationService.getRegistrationStatus(id, email)));
    }

    @Operation(summary = "대회 참가 신청")
    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<Void>> register(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        registrationService.register(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "대회 참가 신청 취소")
    @DeleteMapping("/{id}/register")
    public ResponseEntity<ApiResponse<Void>> cancel(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        registrationService.cancel(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
