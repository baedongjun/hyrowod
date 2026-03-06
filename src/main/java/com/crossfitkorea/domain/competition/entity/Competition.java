package com.crossfitkorea.domain.competition.entity;

import com.crossfitkorea.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "competitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    private String location;
    private String city;

    private LocalDate registrationDeadline;
    private String registrationUrl;

    private String imageUrl;
    private String organizer;  // 주최

    @Enumerated(EnumType.STRING)
    private CompetitionLevel level;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CompetitionStatus status = CompetitionStatus.UPCOMING;

    private Integer maxParticipants;
    private Integer entryFee;  // 참가비 (원)

    @Builder.Default
    private boolean active = true;
}
