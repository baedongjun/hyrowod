package com.crossfitkorea.domain.payment.entity;

import com.crossfitkorea.common.BaseEntity;
import com.crossfitkorea.domain.competition.entity.Competition;
import com.crossfitkorea.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderId;  // UUID, 프론트에서 생성

    private String paymentKey;  // 토스 결제 키 (승인 후 발급)

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String orderName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;
}
