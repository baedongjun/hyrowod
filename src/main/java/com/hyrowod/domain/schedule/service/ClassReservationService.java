package com.hyrowod.domain.schedule.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.notification.entity.NotificationType;
import com.hyrowod.domain.notification.service.NotificationService;
import com.hyrowod.domain.schedule.entity.ClassReservation;
import com.hyrowod.domain.schedule.entity.Schedule;
import com.hyrowod.domain.schedule.repository.ClassReservationRepository;
import com.hyrowod.domain.schedule.repository.ScheduleRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClassReservationService {

    private final ClassReservationRepository reservationRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public Map<String, Object> reserve(Long scheduleId, LocalDate classDate, String email) {
        User user = userService.getUserByEmail(email);
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_NOT_FOUND));

        // 이미 예약했는지 확인
        Optional<ClassReservation> existing = reservationRepository
            .findByScheduleIdAndUserIdAndClassDate(scheduleId, user.getId(), classDate);

        if (existing.isPresent()) {
            if (!existing.get().isCancelled()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
            // 취소된 예약 재활성화
            existing.get().setCancelled(false);
            notificationService.createNotification(user, NotificationType.SYSTEM,
                schedule.getClassName() + " 클래스 예약이 완료되었습니다. (" + classDate + ")",
                "/boxes/" + schedule.getBox().getId());
            return Map.of("reserved", true, "scheduleId", scheduleId, "classDate", classDate.toString());
        }

        // 정원 체크
        if (schedule.getMaxCapacity() != null) {
            long currentCount = reservationRepository.countByScheduleIdAndClassDateAndCancelledFalse(scheduleId, classDate);
            if (currentCount >= schedule.getMaxCapacity()) {
                throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
            }
        }

        reservationRepository.save(ClassReservation.builder()
            .schedule(schedule)
            .user(user)
            .classDate(classDate)
            .build());

        notificationService.createNotification(user, NotificationType.SYSTEM,
            schedule.getClassName() + " 클래스 예약이 완료되었습니다. (" + classDate + ")",
            "/boxes/" + schedule.getBox().getId());

        return Map.of("reserved", true, "scheduleId", scheduleId, "classDate", classDate.toString());
    }

    @Transactional
    public void cancel(Long scheduleId, LocalDate classDate, String email) {
        User user = userService.getUserByEmail(email);
        ClassReservation reservation = reservationRepository
            .findByScheduleIdAndUserIdAndClassDate(scheduleId, user.getId(), classDate)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_NOT_FOUND));
        reservation.setCancelled(true);
    }

    public Map<String, Object> getStatus(Long scheduleId, LocalDate classDate, String email) {
        long count = reservationRepository.countByScheduleIdAndClassDateAndCancelledFalse(scheduleId, classDate);
        boolean reserved = false;
        if (email != null) {
            User user = userService.getUserByEmail(email);
            reserved = reservationRepository
                .findByScheduleIdAndUserIdAndClassDate(scheduleId, user.getId(), classDate)
                .map(r -> !r.isCancelled())
                .orElse(false);
        }
        return Map.of("reservedCount", count, "reserved", reserved);
    }

    public List<Map<String, Object>> getBoxUpcoming(Long boxId) {
        return reservationRepository.findUpcomingByBoxId(boxId, LocalDate.now())
            .stream().map(r -> Map.<String, Object>of(
                "id", r.getId(),
                "userId", r.getUser().getId(),
                "userName", r.getUser().getName(),
                "scheduleId", r.getSchedule().getId(),
                "className", r.getSchedule().getClassName(),
                "startTime", r.getSchedule().getStartTime().toString(),
                "classDate", r.getClassDate().toString()
            )).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMyUpcoming(String email) {
        User user = userService.getUserByEmail(email);
        return reservationRepository.findByUserIdAndClassDateGreaterThanEqualAndCancelledFalseOrderByClassDateAsc(
            user.getId(), LocalDate.now()
        ).stream().map(r -> Map.<String, Object>of(
            "id", r.getId(),
            "scheduleId", r.getSchedule().getId(),
            "boxId", r.getSchedule().getBox().getId(),
            "boxName", r.getSchedule().getBox().getName(),
            "className", r.getSchedule().getClassName(),
            "startTime", r.getSchedule().getStartTime().toString(),
            "classDate", r.getClassDate().toString()
        )).collect(Collectors.toList());
    }
}
