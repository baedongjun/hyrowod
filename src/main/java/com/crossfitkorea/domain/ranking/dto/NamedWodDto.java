package com.crossfitkorea.domain.ranking.dto;

import com.crossfitkorea.domain.ranking.entity.NamedWod;
import com.crossfitkorea.domain.ranking.entity.NamedWodCategory;
import com.crossfitkorea.domain.ranking.entity.ScoreType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NamedWodDto {
    private Long id;
    private String name;
    private String description;
    private NamedWodCategory category;
    private ScoreType scoreType;
    private String scoreUnit;
    private long verifiedCount;

    public static NamedWodDto from(NamedWod wod, long verifiedCount) {
        return NamedWodDto.builder()
                .id(wod.getId())
                .name(wod.getName())
                .description(wod.getDescription())
                .category(wod.getCategory())
                .scoreType(wod.getScoreType())
                .scoreUnit(wod.getScoreUnit())
                .verifiedCount(verifiedCount)
                .build();
    }
}
