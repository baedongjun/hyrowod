package com.crossfitkorea.domain.competition.dto;

import com.crossfitkorea.domain.competition.entity.Competition;
import com.crossfitkorea.domain.competition.entity.CompetitionLevel;
import com.crossfitkorea.domain.competition.entity.CompetitionStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class CompetitionDto {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String city;
    private LocalDate registrationDeadline;
    private String registrationUrl;
    private String imageUrl;
    private String organizer;
    private CompetitionLevel level;
    private CompetitionStatus status;
    private Integer maxParticipants;
    private Integer entryFee;

    public static CompetitionDto from(Competition competition) {
        return CompetitionDto.builder()
            .id(competition.getId())
            .name(competition.getName())
            .description(competition.getDescription())
            .startDate(competition.getStartDate())
            .endDate(competition.getEndDate())
            .location(competition.getLocation())
            .city(competition.getCity())
            .registrationDeadline(competition.getRegistrationDeadline())
            .registrationUrl(competition.getRegistrationUrl())
            .imageUrl(competition.getImageUrl())
            .organizer(competition.getOrganizer())
            .level(competition.getLevel())
            .status(competition.getStatus())
            .maxParticipants(competition.getMaxParticipants())
            .entryFee(competition.getEntryFee())
            .build();
    }
}
