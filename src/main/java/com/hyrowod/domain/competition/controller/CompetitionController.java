package com.hyrowod.domain.competition.controller;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.domain.competition.dto.CompetitionDto;
import com.hyrowod.domain.competition.entity.CompetitionStatus;
import com.hyrowod.domain.competition.service.CompetitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/competitions")
@RequiredArgsConstructor
@Tag(name = "Competition", description = "대회 일정 API")
public class CompetitionController {

    private final CompetitionService competitionService;

    @Operation(summary = "대회 목록 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompetitionDto>>> getCompetitions(
        @RequestParam(required = false) CompetitionStatus status,
        @RequestParam(required = false) String city,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(competitionService.getCompetitions(status, city, pageable)));
    }

    @Operation(summary = "대회 상세 조회")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompetitionDto>> getCompetition(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(competitionService.getCompetition(id)));
    }
}
