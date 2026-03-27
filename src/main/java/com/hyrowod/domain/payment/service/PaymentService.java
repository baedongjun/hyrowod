package com.hyrowod.domain.payment.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.competition.entity.Competition;
import com.hyrowod.domain.competition.entity.CompetitionRegistration;
import com.hyrowod.domain.competition.entity.CompetitionStatus;
import com.hyrowod.domain.competition.repository.CompetitionRegistrationRepository;
import com.hyrowod.domain.competition.repository.CompetitionRepository;
import com.hyrowod.domain.payment.dto.PaymentConfirmRequest;
import com.hyrowod.domain.payment.dto.PaymentDto;
import com.hyrowod.domain.payment.dto.PaymentInitiateRequest;
import com.hyrowod.domain.payment.entity.Payment;
import com.hyrowod.domain.payment.entity.PaymentStatus;
import com.hyrowod.domain.payment.repository.PaymentRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CompetitionRepository competitionRepository;
    private final CompetitionRegistrationRepository registrationRepository;
    private final UserService userService;
    private final RestTemplate restTemplate;

    @Value("${toss.payments.secret-key}")
    private String tossSecretKey;

    private static final String TOSS_CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    @Transactional
    public PaymentDto initiate(PaymentInitiateRequest request, String email) {
        Competition competition = competitionRepository.findById(request.getCompetitionId())
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));

        if (competition.getStatus() != CompetitionStatus.OPEN) {
            throw new BusinessException(ErrorCode.COMPETITION_FULL);
        }

        User user = userService.getUserByEmail(email);

        Payment payment = Payment.builder()
            .orderId(request.getOrderId())
            .amount(competition.getEntryFee())
            .orderName(request.getOrderName())
            .user(user)
            .competition(competition)
            .build();

        return PaymentDto.from(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentDto confirm(PaymentConfirmRequest request, String email) {
        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
            .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        // 금액 검증
        if (!payment.getAmount().equals(request.getAmount())) {
            payment.setStatus(PaymentStatus.FAILED);
            throw new BusinessException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
        }

        // 토스 결제 승인 API 호출
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authHeader);

        Map<String, Object> body = Map.of(
            "paymentKey", request.getPaymentKey(),
            "orderId", request.getOrderId(),
            "amount", request.getAmount()
        );

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                TOSS_CONFIRM_URL,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                payment.setPaymentKey(request.getPaymentKey());
                payment.setStatus(PaymentStatus.APPROVED);

                // 대회 신청 처리
                Long competitionId = payment.getCompetition().getId();
                registrationRepository.findByCompetitionIdAndUserEmail(competitionId, email)
                    .ifPresentOrElse(r -> {
                        if (!r.isCancelled()) return;
                        r.setCancelled(false);
                    }, () -> registrationRepository.save(
                        CompetitionRegistration.builder()
                            .competition(payment.getCompetition())
                            .user(payment.getUser())
                            .build()
                    ));

                return PaymentDto.from(payment);
            } else {
                payment.setStatus(PaymentStatus.FAILED);
                throw new BusinessException(ErrorCode.PAYMENT_CONFIRM_FAILED);
            }
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Toss payment confirm error: {}", e.getMessage());
            payment.setStatus(PaymentStatus.FAILED);
            throw new BusinessException(ErrorCode.PAYMENT_CONFIRM_FAILED);
        }
    }
}
