package com.hyrowod.domain.schedule.dto;

import com.hyrowod.domain.schedule.entity.Schedule;
import lombok.Builder;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Builder
public class ScheduleDto {

    private Long id;
    private Long boxId;
    private DayOfWeek dayOfWeek;
    private String dayOfWeekKorean;
    private LocalTime startTime;
    private LocalTime endTime;
    private String className;
    private Integer maxCapacity;
    private String coachName;

    public static ScheduleDto from(Schedule schedule) {
        String[] days = {"", "월", "화", "수", "목", "금", "토", "일"};
        return ScheduleDto.builder()
            .id(schedule.getId())
            .boxId(schedule.getBox().getId())
            .dayOfWeek(schedule.getDayOfWeek())
            .dayOfWeekKorean(days[schedule.getDayOfWeek().getValue()])
            .startTime(schedule.getStartTime())
            .endTime(schedule.getEndTime())
            .className(schedule.getClassName())
            .maxCapacity(schedule.getMaxCapacity())
            .coachName(schedule.getCoach() != null ? schedule.getCoach().getName() : null)
            .build();
    }
}
