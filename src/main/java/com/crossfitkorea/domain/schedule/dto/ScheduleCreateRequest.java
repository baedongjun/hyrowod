package com.crossfitkorea.domain.schedule.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
public class ScheduleCreateRequest {

    @NotNull(message = "요일을 선택해주세요.")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "시작 시간을 입력해주세요.")
    private LocalTime startTime;

    @NotNull(message = "종료 시간을 입력해주세요.")
    private LocalTime endTime;

    private String className;
    private Integer maxCapacity;
    private Long coachId;
}
