package com.crossfitkorea.domain.coach.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.coach.dto.CoachCreateRequest;
import com.crossfitkorea.domain.coach.dto.CoachDto;
import com.crossfitkorea.domain.coach.service.CoachService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Coach", description = "코치 API")
public class CoachController {

    private final CoachService coachService;

    @Operation(summary = "박스 코치 목록 조회")
    @GetMapping("/boxes/{boxId}/coaches")
    public ResponseEntity<ApiResponse<List<CoachDto>>> getCoaches(@PathVariable Long boxId) {
        return ResponseEntity.ok(ApiResponse.success(coachService.getCoachesByBox(boxId)));
    }

    @Operation(summary = "코치 등록")
    @PostMapping("/boxes/{boxId}/coaches")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<CoachDto>> createCoach(
        @PathVariable Long boxId,
        @Valid @RequestBody CoachCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(coachService.createCoach(boxId, request, userDetails.getUsername())));
    }

    @Operation(summary = "코치 삭제")
    @DeleteMapping("/coaches/{coachId}")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCoach(
        @PathVariable Long coachId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        coachService.deleteCoach(coachId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
