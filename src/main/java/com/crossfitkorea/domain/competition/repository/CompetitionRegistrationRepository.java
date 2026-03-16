package com.crossfitkorea.domain.competition.repository;

import com.crossfitkorea.domain.competition.entity.CompetitionRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompetitionRegistrationRepository extends JpaRepository<CompetitionRegistration, Long> {

    boolean existsByCompetitionIdAndUserEmailAndCancelledFalse(Long competitionId, String email);

    Optional<CompetitionRegistration> findByCompetitionIdAndUserEmail(Long competitionId, String email);

    long countByCompetitionIdAndCancelledFalse(Long competitionId);
}
