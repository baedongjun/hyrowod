package com.hyrowod.domain.ranking.repository;

import com.hyrowod.domain.ranking.entity.NamedWod;
import com.hyrowod.domain.ranking.entity.NamedWodRecord;
import com.hyrowod.domain.ranking.entity.VerificationStatus;
import com.hyrowod.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NamedWodRecordRepository extends JpaRepository<NamedWodRecord, Long> {

    /** 인증된 기록 (랭킹용) */
    List<NamedWodRecord> findByNamedWodAndStatusOrderByScoreAsc(NamedWod namedWod, VerificationStatus status);

    /** 특정 WOD의 인증 대기 기록 (박스오너 인증 페이지) */
    Page<NamedWodRecord> findByNamedWodAndStatusOrderByCreatedAtAsc(NamedWod namedWod, VerificationStatus status, Pageable pageable);

    /** 전체 인증 대기 기록 (박스오너가 볼 수 있는 모든 PENDING) */
    Page<NamedWodRecord> findByStatusOrderByCreatedAtAsc(VerificationStatus status, Pageable pageable);

    /** 사용자의 특정 WOD 기록들 */
    List<NamedWodRecord> findByNamedWodAndUserOrderByCreatedAtDesc(NamedWod namedWod, User user);

    /** 사용자의 모든 기록 */
    Page<NamedWodRecord> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /** 사용자의 특정 WOD 최신 기록 */
    Optional<NamedWodRecord> findTopByNamedWodAndUserOrderByCreatedAtDesc(NamedWod namedWod, User user);

    /** 해당 WOD의 인증된 기록 총 수 */
    long countByNamedWodAndStatus(NamedWod namedWod, VerificationStatus status);

    /** 전체 인증 대기 수 */
    long countByStatus(VerificationStatus status);

    /** 상태별 전체 기록 (최신순) — 어드민 관리용 */
    Page<NamedWodRecord> findByStatusOrderByCreatedAtDesc(VerificationStatus status, Pageable pageable);
}
