package com.crossfitkorea.domain.wod.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class WodRecordRequest {

    private LocalDate wodDate;
    private String score;
    private String notes;
    private boolean rx;
}
