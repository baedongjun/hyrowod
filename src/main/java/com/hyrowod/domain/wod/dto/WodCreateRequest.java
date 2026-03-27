package com.hyrowod.domain.wod.dto;

import com.hyrowod.domain.wod.entity.WodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class WodCreateRequest {

    @NotNull(message = "날짜를 입력해주세요.")
    private LocalDate wodDate;

    @NotBlank(message = "WOD 제목을 입력해주세요.")
    private String title;

    private WodType type;

    @NotBlank(message = "WOD 내용을 입력해주세요.")
    private String content;

    private String scoreType;
    private String imageUrl;
}
