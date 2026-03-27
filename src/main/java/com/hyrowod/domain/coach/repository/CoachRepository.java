package com.hyrowod.domain.coach.repository;

import com.hyrowod.domain.coach.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    List<Coach> findByBoxIdAndActiveTrueOrderByIdAsc(Long boxId);
}
