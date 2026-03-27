package com.hyrowod.domain.ranking.dto;

import com.hyrowod.domain.ranking.entity.NamedWodCategory;
import com.hyrowod.domain.ranking.entity.ScoreType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class NamedWodDetailDto {
    private Long id;
    private String name;
    private String description;
    private NamedWodCategory category;
    private ScoreType scoreType;
    private String scoreUnit;
    private List<RankingEntryDto> leaderboard;
    private NamedWodRecordDto myLatestRecord;
}
