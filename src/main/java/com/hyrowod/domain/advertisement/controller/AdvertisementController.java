package com.hyrowod.domain.advertisement.controller;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.domain.advertisement.dto.AdvertisementDto;
import com.hyrowod.domain.advertisement.service.AdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Advertisement", description = "광고 API")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @Operation(summary = "활성 광고 목록 조회")
    @GetMapping("/advertisements")
    public ResponseEntity<ApiResponse<List<AdvertisementDto>>> getAds(
        @RequestParam(required = false) String position) {
        return ResponseEntity.ok(ApiResponse.success(advertisementService.getActiveAds(position)));
    }

    @Operation(summary = "광고 등록 [ADMIN]")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/advertisements")
    public ResponseEntity<ApiResponse<AdvertisementDto>> create(@RequestBody Map<String, Object> body) {
        AdvertisementDto dto = advertisementService.create(
            (String) body.get("title"),
            (String) body.get("description"),
            (String) body.get("imageUrl"),
            (String) body.get("linkUrl"),
            (String) body.get("position"),
            body.get("priority") != null ? Integer.valueOf(body.get("priority").toString()) : null
        );
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @Operation(summary = "광고 수정 [ADMIN]")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/advertisements/{id}")
    public ResponseEntity<ApiResponse<AdvertisementDto>> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        AdvertisementDto dto = advertisementService.update(
            id,
            (String) body.get("title"),
            (String) body.get("description"),
            (String) body.get("imageUrl"),
            (String) body.get("linkUrl"),
            (String) body.get("position"),
            body.get("priority") != null ? Integer.valueOf(body.get("priority").toString()) : null
        );
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @Operation(summary = "광고 활성화/비활성화 [ADMIN]")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/advertisements/{id}/active")
    public ResponseEntity<ApiResponse<Void>> toggleActive(@PathVariable Long id, @RequestParam boolean active) {
        advertisementService.toggleActive(id, active);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "광고 삭제 [ADMIN]")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/advertisements/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        advertisementService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
