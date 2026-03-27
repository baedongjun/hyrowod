package com.hyrowod.domain.box.repository;

import com.hyrowod.domain.box.entity.BoxMembership;
import com.hyrowod.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoxMembershipRepository extends JpaRepository<BoxMembership, Long> {

    // 유저의 현재 활성 멤버십 (가입된 박스)
    Optional<BoxMembership> findByUserAndActiveTrue(User user);

    // 특정 박스에 유저가 가입했는지 확인
    Optional<BoxMembership> findByUserAndBoxIdAndActiveTrue(User user, Long boxId);

    // 박스 회원 전체 목록
    List<BoxMembership> findByBoxIdAndActiveTrueOrderByJoinedAtAsc(Long boxId);

    // 박스 회원 수
    long countByBoxIdAndActiveTrue(Long boxId);

    // userId로 활성 멤버십 조회 (JPQL)
    @Query("SELECT bm FROM BoxMembership bm JOIN FETCH bm.box WHERE bm.user.id = :userId AND bm.active = true")
    Optional<BoxMembership> findActiveByUserId(@Param("userId") Long userId);

    // WOD 랭킹 계산용: 날짜 범위 내 활성 멤버십
    @Query("SELECT bm FROM BoxMembership bm JOIN FETCH bm.box WHERE bm.user.email = :email AND bm.active = true")
    Optional<BoxMembership> findActiveByUserEmail(@Param("email") String email);
}
