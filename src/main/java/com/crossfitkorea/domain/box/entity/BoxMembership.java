package com.crossfitkorea.domain.box.entity;

import com.crossfitkorea.common.BaseEntity;
import com.crossfitkorea.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "box_memberships",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "box_id"}))
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoxMembership extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id", nullable = false)
    private Box box;

    @Column(nullable = false)
    private LocalDate joinedAt;

    @Builder.Default
    private boolean active = true;

    public void deactivate() {
        this.active = false;
    }
}
