package com.hyrowod.domain.review.entity;

import com.hyrowod.common.BaseEntity;
import com.hyrowod.domain.box.entity.Box;
import com.hyrowod.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "box_id", nullable = false)
    private Box box;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int rating;   // 1 ~ 5

    @Column(nullable = false, length = 2000)
    private String content;

    @Builder.Default
    private boolean active = true;
}
