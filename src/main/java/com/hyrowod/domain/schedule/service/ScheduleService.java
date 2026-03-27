package com.hyrowod.domain.schedule.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.box.entity.Box;
import com.hyrowod.domain.box.service.BoxService;
import com.hyrowod.domain.coach.entity.Coach;
import com.hyrowod.domain.coach.repository.CoachRepository;
import com.hyrowod.domain.schedule.dto.ScheduleCreateRequest;
import com.hyrowod.domain.schedule.dto.ScheduleDto;
import com.hyrowod.domain.schedule.entity.Schedule;
import com.hyrowod.domain.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final BoxService boxService;
    private final CoachRepository coachRepository;

    public List<ScheduleDto> getSchedulesByBox(Long boxId) {
        return scheduleRepository.findByBoxIdAndActiveTrueOrderByDayOfWeekAscStartTimeAsc(boxId)
            .stream().map(ScheduleDto::from).toList();
    }

    @Transactional
    public ScheduleDto createSchedule(Long boxId, ScheduleCreateRequest request, String ownerEmail) {
        Box box = boxService.findActiveBox(boxId);

        if (box.getOwner() == null || !box.getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        Coach coach = null;
        if (request.getCoachId() != null) {
            coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new BusinessException(ErrorCode.COACH_NOT_FOUND));
        }

        Schedule schedule = Schedule.builder()
            .box(box)
            .coach(coach)
            .dayOfWeek(request.getDayOfWeek())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .className(request.getClassName())
            .maxCapacity(request.getMaxCapacity())
            .build();

        return ScheduleDto.from(scheduleRepository.save(schedule));
    }

    @Transactional
    public ScheduleDto updateSchedule(Long scheduleId, ScheduleCreateRequest request, String ownerEmail) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if (!schedule.getBox().getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setClassName(request.getClassName());
        schedule.setMaxCapacity(request.getMaxCapacity());

        if (request.getCoachId() != null) {
            Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new BusinessException(ErrorCode.COACH_NOT_FOUND));
            schedule.setCoach(coach);
        } else {
            schedule.setCoach(null);
        }

        return ScheduleDto.from(schedule);
    }

    @Transactional
    public void deleteSchedule(Long scheduleId, String ownerEmail) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND));

        if (!schedule.getBox().getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        schedule.setActive(false);
    }
}
