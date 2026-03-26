package com.crossfitkorea.domain.ranking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class NamedWodRecordRequest {

    @NotNull
    private Long namedWodId;

    @NotNull
    @Positive
    private Double score;

    @NotNull
    private String videoUrl;

    private LocalDate recordedAt;

    private String notes;
}
