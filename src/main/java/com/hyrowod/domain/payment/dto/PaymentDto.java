package com.hyrowod.domain.payment.dto;

import com.hyrowod.domain.payment.entity.Payment;
import com.hyrowod.domain.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentDto {

    private Long id;
    private String orderId;
    private String paymentKey;
    private Integer amount;
    private String orderName;
    private PaymentStatus status;
    private Long competitionId;
    private LocalDateTime createdAt;

    public static PaymentDto from(Payment payment) {
        return PaymentDto.builder()
            .id(payment.getId())
            .orderId(payment.getOrderId())
            .paymentKey(payment.getPaymentKey())
            .amount(payment.getAmount())
            .orderName(payment.getOrderName())
            .status(payment.getStatus())
            .competitionId(payment.getCompetition() != null ? payment.getCompetition().getId() : null)
            .createdAt(payment.getCreatedAt())
            .build();
    }
}
