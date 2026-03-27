package com.hyrowod.domain.schedule.repository;

import com.hyrowod.domain.schedule.entity.ClassReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ClassReservationRepository extends JpaRepository<ClassReservation, Long> {

    Optional<ClassReservation> findByScheduleIdAndUserIdAndClassDate(Long scheduleId, Long userId, LocalDate classDate);

    long countByScheduleIdAndClassDateAndCancelledFalse(Long scheduleId, LocalDate classDate);

    List<ClassReservation> findByUserIdAndClassDateGreaterThanEqualAndCancelledFalseOrderByClassDateAsc(Long userId, LocalDate from);

    @Query("SELECT r FROM ClassReservation r WHERE r.schedule.box.id = :boxId AND r.classDate = :date AND r.cancelled = false ORDER BY r.classDate ASC")
    List<ClassReservation> findByBoxIdAndDate(@Param("boxId") Long boxId, @Param("date") LocalDate date);

    @Query("SELECT r FROM ClassReservation r JOIN FETCH r.user JOIN FETCH r.schedule WHERE r.schedule.box.id = :boxId AND r.classDate >= :from AND r.cancelled = false ORDER BY r.classDate ASC, r.schedule.startTime ASC")
    List<ClassReservation> findUpcomingByBoxId(@Param("boxId") Long boxId, @Param("from") LocalDate from);
}
