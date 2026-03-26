package com.crossfitkorea.domain.ranking.entity;

import com.crossfitkorea.common.BaseEntity;
import com.crossfitkorea.domain.box.entity.Box;
import com.crossfitkorea.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "named_wod_records")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NamedWodRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "named_wod_id", nullable = false)
    private NamedWod namedWod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 점수 (TIME이면 초 단위, REPS면 횟수, WEIGHT면 kg, ROUNDS면 라운드수) */
    @Column(nullable = false)
    private Double score;

    /** YouTube 영상 URL (인증용) */
    @Column(nullable = false)
    private String videoUrl;

    /** 기록 날짜 */
    @Column(nullable = false)
    private LocalDate recordedAt;

    /** 메모 */
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VerificationStatus status = VerificationStatus.PENDING;

    /** 인증한 박스 오너 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedBy;

    /** 인증해준 박스 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_box_id")
    private Box verifiedBox;

    /** 인증/거절 사유 */
    @Column
    private String verificationComment;

    public void verify(User verifier, Box box, String comment) {
        this.status = VerificationStatus.VERIFIED;
        this.verifiedBy = verifier;
        this.verifiedBox = box;
        this.verificationComment = comment;
    }

    public void reject(User verifier, String comment) {
        this.status = VerificationStatus.REJECTED;
        this.verifiedBy = verifier;
        this.verificationComment = comment;
    }
}
