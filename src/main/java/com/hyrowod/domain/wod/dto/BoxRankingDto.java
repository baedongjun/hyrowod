package com.hyrowod.domain.wod.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BoxRankingDto {

    private Long boxId;
    private String boxName;
    private String boxCity;
    private int participantCount;
    private int rxCount;
    private List<String> topScores; // 상위 3개 기록 미리보기
}
