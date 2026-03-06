package com.crossfitkorea.domain.user.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.user.dto.UserDto;
import com.crossfitkorea.domain.user.dto.UserUpdateRequest;
import com.crossfitkorea.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "사용자 API")
public class UserController {

    private final UserService userService;

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMyInfo(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.getMyInfo(userDetails.getUsername())));
    }

    @Operation(summary = "내 정보 수정")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMyInfo(
        @Valid @RequestBody UserUpdateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateMyInfo(userDetails.getUsername(), request)));
    }
}
