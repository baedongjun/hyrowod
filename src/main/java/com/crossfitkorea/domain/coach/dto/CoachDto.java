package com.crossfitkorea.domain.coach.dto;

import com.crossfitkorea.domain.coach.entity.Coach;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CoachDto {

    private Long id;
    private Long boxId;
    private String name;
    private String bio;
    private String imageUrl;
    private List<String> certifications;
    private Integer experienceYears;

    public static CoachDto from(Coach coach) {
        return CoachDto.builder()
            .id(coach.getId())
            .boxId(coach.getBox().getId())
            .name(coach.getName())
            .bio(coach.getBio())
            .imageUrl(coach.getImageUrl())
            .certifications(coach.getCertifications())
            .experienceYears(coach.getExperienceYears())
            .build();
    }
}
