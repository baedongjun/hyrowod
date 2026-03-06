package com.crossfitkorea.domain.schedule.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.schedule.dto.ScheduleCreateRequest;
import com.crossfitkorea.domain.schedule.dto.ScheduleDto;
import com.crossfitkorea.domain.schedule.service.ScheduleService;
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
@Tag(name = "Schedule", description = "수업 시간표 API")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "박스 시간표 조회")
    @GetMapping("/boxes/{boxId}/schedules")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getSchedules(@PathVariable Long boxId) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesByBox(boxId)));
    }

    @Operation(summary = "시간표 등록")
    @PostMapping("/boxes/{boxId}/schedules")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleDto>> createSchedule(
        @PathVariable Long boxId,
        @Valid @RequestBody ScheduleCreateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.createSchedule(boxId, request, userDetails.getUsername())));
    }

    @Operation(summary = "시간표 삭제")
    @DeleteMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasAnyRole('BOX_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
        @PathVariable Long scheduleId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        scheduleService.deleteSchedule(scheduleId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
