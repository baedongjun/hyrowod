package com.hyrowod.domain.challenge.repository;

import com.hyrowod.domain.challenge.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    List<Challenge> findByActiveTrueOrderByStartDateDesc();

    Optional<Challenge> findByIdAndActiveTrue(Long id);
}
