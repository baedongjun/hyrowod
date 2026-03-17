package com.crossfitkorea.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentInitiateRequest {

    @NotNull
    private Long competitionId;

    @NotBlank
    private String orderId;  // 프론트에서 UUID로 생성

    @NotBlank
    private String orderName;
}
