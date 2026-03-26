package com.crossfitkorea.domain.ranking.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VerificationRequest {
    private String comment;  // 인증/거절 사유 (선택)
}
