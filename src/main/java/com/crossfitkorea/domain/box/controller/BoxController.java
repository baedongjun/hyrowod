package com.crossfitkorea.domain.box.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.box.dto.BoxCreateRequest;
import com.crossfitkorea.domain.box.dto.BoxDto;
import com.crossfitkorea.domain.box.dto.BoxSearchRequest;
import com.crossfitkorea.domain.box.service.BoxService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/boxes")
@RequiredArgsConstructor
@Tag(name = "Box", description = "크로스핏 박스 API")
public class BoxController {

    private final BoxService boxService;

    @Operation(summary = "박스 검색 (지역/키워드 필터)")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BoxDto>>> searchBoxes(
        BoxSearchRequest request,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(boxService.searchBoxes(request, pageable)));
    }

    @Operation(summary = "박스 상세 조회")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoxDto>> getBox(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(boxService.getBox(id)));
    }

    @Operation(summary = "프리미엄 박스 목록")
    @GetMapping("/premium")
    public ResponseEntity<ApiResponse<List<BoxDto>>> getPremiumBoxes() {
        return ResponseEntity.ok(ApiResponse.success(boxService.getPremiumBoxes()));
    }

    @Operation(summary = "내 박스 목록 (박스 오너)")
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Page<BoxDto>>> getMyBoxes(
        @PageableDefault(size = 20) Pageable pageable,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(boxService.getMyBoxes(userDetails.getUsername(), pageable)));
    }

    @Operation(summary = "박스 등록 (박스 오너/관리자)")
    @PostMapping
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BoxDto>> createBox(
        @Valid @RequestBody BoxCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(boxService.createBox(request, userDetails.getUsername())));
    }

    @Operation(summary = "박스 수정")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BoxDto>> updateBox(
        @PathVariable Long id,
        @Valid @RequestBody BoxCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(boxService.updateBox(id, request, userDetails.getUsername())));
    }

    @Operation(summary = "박스 삭제 (비활성화)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBox(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        boxService.deleteBox(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
