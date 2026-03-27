package com.hyrowod.domain.wod.dto;

import com.hyrowod.domain.wod.entity.Wod;
import com.hyrowod.domain.wod.entity.WodType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class WodDto {

    private Long id;
    private Long boxId;
    private String boxName;
    private LocalDate wodDate;
    private String title;
    private WodType type;
    private String content;
    private String scoreType;
    private String imageUrl;

    public static WodDto from(Wod wod) {
        return WodDto.builder()
            .id(wod.getId())
            .boxId(wod.getBox() != null ? wod.getBox().getId() : null)
            .boxName(wod.getBox() != null ? wod.getBox().getName() : "공통 WOD")
            .wodDate(wod.getWodDate())
            .title(wod.getTitle())
            .type(wod.getType())
            .content(wod.getContent())
            .scoreType(wod.getScoreType())
            .imageUrl(wod.getImageUrl())
            .build();
    }
}
