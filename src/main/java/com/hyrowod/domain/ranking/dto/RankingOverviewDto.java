package com.hyrowod.domain.ranking.dto;

import com.hyrowod.domain.ranking.entity.NamedWodCategory;
import com.hyrowod.domain.ranking.entity.ScoreType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RankingOverviewDto {
    private Long wodId;
    private String wodName;
    private NamedWodCategory category;
    private ScoreType scoreType;
    private String scoreUnit;
    private long totalVerified;
    private List<RankingEntryDto> top3;
}
