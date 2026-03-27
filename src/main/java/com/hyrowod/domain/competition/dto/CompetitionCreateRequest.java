package com.hyrowod.domain.competition.dto;

import com.hyrowod.domain.competition.entity.CompetitionLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class CompetitionCreateRequest {

    @NotBlank(message = "대회명을 입력해주세요.")
    private String name;

    private String description;

    @NotNull(message = "시작일을 입력해주세요.")
    private LocalDate startDate;

    private LocalDate endDate;
    private String location;
    private String city;
    private LocalDate registrationDeadline;
    private String registrationUrl;
    private String imageUrl;
    private String organizer;
    private CompetitionLevel level;
    private Integer maxParticipants;
    private Integer entryFee;
}
