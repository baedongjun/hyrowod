package com.hyrowod.domain.wod.entity;

import com.hyrowod.common.BaseEntity;
import com.hyrowod.domain.box.entity.Box;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "wods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wod extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id")
    private Box box;  // null 이면 공통 WOD

    @Column(nullable = false)
    private LocalDate wodDate;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private WodType type;

    @Column(nullable = false, length = 5000)
    private String content;

    private String scoreType;  // TIME, ROUNDS, REPS, WEIGHT, LOAD

    private String imageUrl;

    @Builder.Default
    private boolean active = true;
}
