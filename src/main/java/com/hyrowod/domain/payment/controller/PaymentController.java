package com.hyrowod.domain.payment.controller;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.domain.payment.dto.PaymentConfirmRequest;
import com.hyrowod.domain.payment.dto.PaymentDto;
import com.hyrowod.domain.payment.dto.PaymentInitiateRequest;
import com.hyrowod.domain.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "결제 API")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "결제 생성 (토스페이먼츠 위젯 표시 전 호출)")
    @PostMapping("/toss/initiate")
    public ResponseEntity<ApiResponse<PaymentDto>> initiate(
        @Valid @RequestBody PaymentInitiateRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            paymentService.initiate(request, userDetails.getUsername())
        ));
    }

    @Operation(summary = "결제 승인 (토스 성공 리다이렉트 후 호출)")
    @PostMapping("/toss/confirm")
    public ResponseEntity<ApiResponse<PaymentDto>> confirm(
        @Valid @RequestBody PaymentConfirmRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            paymentService.confirm(request, userDetails.getUsername())
        ));
    }
}
