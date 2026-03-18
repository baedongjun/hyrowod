package com.crossfitkorea.domain.competition.repository;

import com.crossfitkorea.domain.competition.entity.CompetitionRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompetitionRegistrationRepository extends JpaRepository<CompetitionRegistration, Long> {

    boolean existsByCompetitionIdAndUserEmailAndCancelledFalse(Long competitionId, String email);

    Optional<CompetitionRegistration> findByCompetitionIdAndUserEmail(Long competitionId, String email);

    long countByCompetitionIdAndCancelledFalse(Long competitionId);

    @Query("SELECT r FROM CompetitionRegistration r JOIN FETCH r.competition WHERE r.user.email = :email AND r.cancelled = false ORDER BY r.createdAt DESC")
    List<CompetitionRegistration> findByUserEmailAndCancelledFalseOrderByCreatedAtDesc(String email);
}
