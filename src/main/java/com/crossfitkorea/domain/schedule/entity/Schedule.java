package com.crossfitkorea.domain.schedule.entity;

import com.crossfitkorea.common.BaseEntity;
import com.crossfitkorea.domain.box.entity.Box;
import com.crossfitkorea.domain.coach.entity.Coach;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id", nullable = false)
    private Box box;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private Coach coach;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    private String className;     // 일반 WOD, 오픈짐, 초보자반 등

    private Integer maxCapacity;  // 최대 수강 인원

    @Builder.Default
    private boolean active = true;
}
