package com.crossfitkorea.domain.coach.repository;

import com.crossfitkorea.domain.coach.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    List<Coach> findByBoxIdAndActiveTrueOrderByIdAsc(Long boxId);
}
