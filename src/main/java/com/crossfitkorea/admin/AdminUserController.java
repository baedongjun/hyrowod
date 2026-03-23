package com.crossfitkorea.admin;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.common.exception.BusinessException;
import com.crossfitkorea.common.exception.ErrorCode;
import com.crossfitkorea.domain.user.dto.UserDto;
import com.crossfitkorea.domain.user.entity.User;
import com.crossfitkorea.domain.user.entity.UserRole;
import com.crossfitkorea.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "어드민 API")
public class AdminUserController {

    private final UserRepository userRepository;

    @Operation(summary = "[어드민] 전체 회원 목록 (키워드 검색)")
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
        @RequestParam(required = false) String keyword,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<UserDto> users = (keyword != null && !keyword.isBlank())
            ? userRepository.searchUsers(keyword, pageable).map(UserDto::from)
            : userRepository.findAll(pageable).map(UserDto::from);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @Operation(summary = "[어드민] 회원 활성/비활성화")
    @PatchMapping("/users/{id}/active")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserActive(
        @PathVariable Long id,
        @RequestParam boolean active
    ) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setActive(active);
        return ResponseEntity.ok(ApiResponse.success(UserDto.from(userRepository.save(user))));
    }

    @Operation(summary = "[어드민] 회원 역할 변경")
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
        @PathVariable Long id,
        @RequestParam UserRole role
    ) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setRole(role);
        return ResponseEntity.ok(ApiResponse.success(UserDto.from(userRepository.save(user))));
    }

    @Operation(summary = "[어드민] 회원 정보 수정 (이름, 전화번호)")
    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (body.containsKey("name") && body.get("name") != null && !body.get("name").isBlank()) {
            user.setName(body.get("name").trim());
        }
        if (body.containsKey("phone")) {
            user.setPhone(body.get("phone") != null && !body.get("phone").isBlank() ? body.get("phone").trim() : null);
        }
        return ResponseEntity.ok(ApiResponse.success(UserDto.from(userRepository.save(user))));
    }
}
