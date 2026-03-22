package com.crossfitkorea.domain.schedule.controller;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.schedule.service.ClassReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ClassReservationController {

    private final ClassReservationService reservationService;

    /** POST /api/v1/schedules/{id}/reserve?date=YYYY-MM-DD — 클래스 예약 [AUTH] */
    @PostMapping("/{id}/reserve")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reserve(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
            reservationService.reserve(id, date, userDetails.getUsername())));
    }

    /** DELETE /api/v1/schedules/{id}/reserve?date=YYYY-MM-DD — 예약 취소 [AUTH] */
    @DeleteMapping("/{id}/reserve")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {
        reservationService.cancel(id, date, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /** GET /api/v1/schedules/{id}/reserve/status?date=YYYY-MM-DD — 예약 현황 [PUBLIC+AUTH] */
    @GetMapping("/{id}/reserve/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(ApiResponse.success(
            reservationService.getStatus(id, date, email)));
    }

    /** GET /api/v1/users/me/reservations — 내 예약 목록 [AUTH] */
    @GetMapping("/my-reservations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyReservations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
            reservationService.getMyUpcoming(userDetails.getUsername())));
    }

    /** GET /api/v1/boxes/{boxId}/reservations — 박스 예약 현황 [BOX_OWNER/ADMIN] */
    @GetMapping("/box/{boxId}/reservations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBoxReservations(
            @PathVariable Long boxId) {
        return ResponseEntity.ok(ApiResponse.success(
            reservationService.getBoxUpcoming(boxId)));
    }
}
