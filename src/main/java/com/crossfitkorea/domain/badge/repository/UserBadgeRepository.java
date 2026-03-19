package com.crossfitkorea.domain.badge.repository;

import com.crossfitkorea.domain.badge.BadgeType;
import com.crossfitkorea.domain.badge.entity.UserBadge;
import com.crossfitkorea.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    List<UserBadge> findByUserOrderByAwardedAtDesc(User user);

    boolean existsByUserAndType(User user, BadgeType type);

    List<UserBadge> findByUserInOrderByAwardedAtDesc(List<User> users);

    @Query("SELECT ub FROM UserBadge ub JOIN FETCH ub.user ORDER BY ub.awardedAt DESC")
    Page<UserBadge> findAllWithUserOrderByAwardedAtDesc(Pageable pageable);

    long countByType(BadgeType type);
}
