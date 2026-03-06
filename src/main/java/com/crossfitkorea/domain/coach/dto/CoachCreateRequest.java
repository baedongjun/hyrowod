package com.crossfitkorea.domain.coach.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CoachCreateRequest {

    @NotBlank(message = "코치 이름을 입력해주세요.")
    private String name;

    private String bio;
    private String imageUrl;
    private List<String> certifications;
    private Integer experienceYears;
}
