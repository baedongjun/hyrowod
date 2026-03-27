package com.hyrowod.admin;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.badge.BadgeType;
import com.hyrowod.domain.badge.dto.BadgeDto;
import com.hyrowod.domain.badge.entity.UserBadge;
import com.hyrowod.domain.badge.repository.UserBadgeRepository;
import com.hyrowod.domain.badge.service.BadgeService;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "어드민 배지 관리 API")
public class AdminBadgeController {

    private final UserBadgeRepository userBadgeRepository;
    private final UserRepository userRepository;
    private final BadgeService badgeService;

    @Data
    @Builder
    static class AdminBadgeDto {
        private Long id;
        private Long userId;
        private String userName;
        private String type;
        private String name;
        private String description;
        private String tier;
        private LocalDateTime awardedAt;

        public static AdminBadgeDto from(UserBadge ub) {
            BadgeType t = ub.getType();
            return AdminBadgeDto.builder()
                .id(ub.getId())
                .userId(ub.getUser().getId())
                .userName(ub.getUser().getName())
                .type(t.name())
                .name(t.getName())
                .description(t.getDescription())
                .tier(t.getTier())
                .awardedAt(ub.getAwardedAt())
                .build();
        }
    }

    @Operation(summary = "[어드민] 전체 배지 수여 내역")
    @GetMapping("/badges")
    public ResponseEntity<ApiResponse<Page<AdminBadgeDto>>> getAllBadges(
        @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<UserBadge> badges = userBadgeRepository.findAllWithUserOrderByAwardedAtDesc(pageable);
        Page<AdminBadgeDto> result = badges.map(AdminBadgeDto::from);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "[어드민] 배지 타입 목록")
    @GetMapping("/badges/types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBadgeTypes() {
        List<Map<String, Object>> types = Arrays.stream(BadgeType.values())
            .map(t -> Map.<String, Object>of(
                "type", t.name(),
                "name", t.getName(),
                "description", t.getDescription(),
                "tier", t.getTier(),
                "count", userBadgeRepository.countByType(t)
            ))
            .toList();
        return ResponseEntity.ok(ApiResponse.success(types));
    }

    @Operation(summary = "[어드민] 특정 사용자에게 배지 수여")
    @PostMapping("/badges/award")
    public ResponseEntity<ApiResponse<BadgeDto>> awardBadge(
        @RequestBody AwardBadgeRequest request
    ) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        BadgeType badgeType;
        try {
            badgeType = BadgeType.valueOf(request.getBadgeType());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        badgeService.award(user, badgeType);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "[어드민] 배지 회수")
    @DeleteMapping("/badges/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeBadge(@PathVariable Long id) {
        UserBadge badge = userBadgeRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_INPUT_VALUE));
        userBadgeRepository.delete(badge);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Data
    static class AwardBadgeRequest {
        private Long userId;
        private String badgeType;
    }
}
