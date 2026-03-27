package com.hyrowod.domain.goal.repository;

import com.hyrowod.domain.goal.entity.UserGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGoalRepository extends JpaRepository<UserGoal, Long> {

    List<UserGoal> findByUserIdOrderByAchievedAscCreatedAtDesc(Long userId);
}
