package com.crossfitkorea.domain.wod.dto;

import com.crossfitkorea.domain.wod.entity.WodRecord;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class WodRecordDto {

    private Long id;
    private LocalDate wodDate;
    private String score;
    private String notes;
    private boolean rx;
    private String userName;

    public static WodRecordDto from(WodRecord record) {
        return WodRecordDto.builder()
            .id(record.getId())
            .wodDate(record.getWodDate())
            .score(record.getScore())
            .notes(record.getNotes())
            .rx(record.isRx())
            .userName(record.getUser().getName())
            .build();
    }
}
