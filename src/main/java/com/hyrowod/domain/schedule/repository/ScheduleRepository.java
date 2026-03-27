package com.hyrowod.domain.schedule.repository;

import com.hyrowod.domain.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByBoxIdAndActiveTrueOrderByDayOfWeekAscStartTimeAsc(Long boxId);
    List<Schedule> findByBoxIdAndDayOfWeekAndActiveTrue(Long boxId, DayOfWeek dayOfWeek);
}
