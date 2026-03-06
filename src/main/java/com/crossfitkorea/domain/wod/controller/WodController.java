package com.crossfitkorea.domain.wod.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.wod.dto.WodCreateRequest;
import com.crossfitkorea.domain.wod.dto.WodDto;
import com.crossfitkorea.domain.wod.service.WodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/wod")
@RequiredArgsConstructor
@Tag(name = "WOD", description = "오늘의 WOD API")
public class WodController {

    private final WodService wodService;

    @Operation(summary = "오늘의 WOD 조회 (공통 또는 박스별)")
    @GetMapping("/today")
    public ResponseEntity<ApiResponse<WodDto>> getTodayWod(
        @RequestParam(required = false) Long boxId
    ) {
        return ResponseEntity.ok(ApiResponse.success(wodService.getTodayWod(boxId)));
    }

    @Operation(summary = "WOD 히스토리")
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<WodDto>>> getWodHistory(
        @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(wodService.getWodHistory(pageable)));
    }

    @Operation(summary = "WOD 등록 (박스 오너 or 관리자)")
    @PostMapping
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<WodDto>> createWod(
        @RequestParam(required = false) Long boxId,
        @Valid @RequestBody WodCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(wodService.createWod(boxId, request, userDetails.getUsername())));
    }
}
