package com.crossfitkorea.domain.coach.entity;

import com.crossfitkorea.common.BaseEntity;
import com.crossfitkorea.domain.box.entity.Box;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coaches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coach extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id", nullable = false)
    private Box box;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String bio;

    private String imageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "coach_certifications", joinColumns = @JoinColumn(name = "coach_id"))
    @Column(name = "certification")
    @Builder.Default
    private List<String> certifications = new ArrayList<>();  // CF-L1, CF-L2, Weightlifting 등

    private Integer experienceYears;

    @Builder.Default
    private boolean active = true;
}
