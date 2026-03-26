package com.crossfitkorea.domain.ranking.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.ranking.dto.*;
import com.crossfitkorea.domain.ranking.service.RankingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    /** Named WOD 목록 [PUBLIC] */
    @GetMapping("/wods")
    public ResponseEntity<ApiResponse<List<NamedWodDto>>> getWods() {
        return ResponseEntity.ok(ApiResponse.success(rankingService.getNamedWods()));
    }

    /** Named WOD 상세 + 랭킹 [PUBLIC+AUTH] */
    @GetMapping("/wods/{id}")
    public ResponseEntity<ApiResponse<NamedWodDetailDto>> getWodDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.success(rankingService.getDetail(id, email)));
    }

    /** 기록 제출 [AUTH] */
    @PostMapping("/records")
    public ResponseEntity<ApiResponse<NamedWodRecordDto>> submitRecord(
            @Valid @RequestBody NamedWodRecordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                "기록이 제출되었습니다. 박스 오너의 인증을 기다려주세요.",
                rankingService.submitRecord(userDetails.getUsername(), request)));
    }

    /** 내 기록 목록 [AUTH] */
    @GetMapping("/records/my")
    public ResponseEntity<ApiResponse<Page<NamedWodRecordDto>>> getMyRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                rankingService.getMyRecords(userDetails.getUsername(), page, size)));
    }

    /** 인증 대기 기록 목록 (박스 오너/어드민) [BOX_OWNER/ADMIN] */
    @GetMapping("/records/pending")
    public ResponseEntity<ApiResponse<Page<NamedWodRecordDto>>> getPendingRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(rankingService.getPendingRecords(page, size)));
    }

    /** 기록 인증 [BOX_OWNER/ADMIN] */
    @PatchMapping("/records/{id}/verify")
    public ResponseEntity<ApiResponse<NamedWodRecordDto>> verifyRecord(
            @PathVariable Long id,
            @RequestBody(required = false) VerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        VerificationRequest req = request != null ? request : new VerificationRequest();
        return ResponseEntity.ok(ApiResponse.success(
                "기록이 인증되었습니다.",
                rankingService.verifyRecord(id, userDetails.getUsername(), req)));
    }

    /** 기록 거절 [BOX_OWNER/ADMIN] */
    @PatchMapping("/records/{id}/reject")
    public ResponseEntity<ApiResponse<NamedWodRecordDto>> rejectRecord(
            @PathVariable Long id,
            @RequestBody(required = false) VerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        VerificationRequest req = request != null ? request : new VerificationRequest();
        return ResponseEntity.ok(ApiResponse.success(
                "기록이 거절되었습니다.",
                rankingService.rejectRecord(id, userDetails.getUsername(), req)));
    }
}
