package com.crossfitkorea.domain.ranking.entity;

import com.crossfitkorea.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "named_wods")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NamedWod extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NamedWodCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScoreType scoreType;

    @Column
    private String scoreUnit; // "초", "회", "kg", "라운드" 등

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    public void update(String name, String description, NamedWodCategory category,
                       ScoreType scoreType, String scoreUnit) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.scoreType = scoreType;
        this.scoreUnit = scoreUnit;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
