package com.crossfitkorea.admin;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.ranking.dto.NamedWodCreateRequest;
import com.crossfitkorea.domain.ranking.dto.NamedWodDto;
import com.crossfitkorea.domain.ranking.dto.NamedWodRecordDto;
import com.crossfitkorea.domain.ranking.service.RankingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/ranking")
@RequiredArgsConstructor
public class AdminRankingController {

    private final RankingService rankingService;

    /** Named WOD 등록 [ADMIN] */
    @PostMapping("/wods")
    public ResponseEntity<ApiResponse<NamedWodDto>> create(
            @Valid @RequestBody NamedWodCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(rankingService.createNamedWod(request)));
    }

    /** Named WOD 수정 [ADMIN] */
    @PutMapping("/wods/{id}")
    public ResponseEntity<ApiResponse<NamedWodDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody NamedWodCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(rankingService.updateNamedWod(id, request)));
    }

    /** Named WOD 활성화/비활성화 [ADMIN] */
    @PatchMapping("/wods/{id}/active")
    public ResponseEntity<ApiResponse<Void>> toggleActive(
            @PathVariable Long id,
            @RequestParam boolean active) {
        rankingService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /** 인증된 기록 목록 [ADMIN] */
    @GetMapping("/records")
    public ResponseEntity<ApiResponse<Page<NamedWodRecordDto>>> getVerifiedRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(rankingService.getVerifiedRecords(page, size)));
    }

    /** 기록 삭제 [ADMIN] */
    @DeleteMapping("/records/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(@PathVariable Long id) {
        rankingService.deleteRecord(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
