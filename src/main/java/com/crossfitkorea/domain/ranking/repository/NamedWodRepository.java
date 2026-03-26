package com.crossfitkorea.domain.ranking.repository;

import com.crossfitkorea.domain.ranking.entity.NamedWod;
import com.crossfitkorea.domain.ranking.entity.NamedWodCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NamedWodRepository extends JpaRepository<NamedWod, Long> {

    List<NamedWod> findByActiveTrueOrderByCategoryAscNameAsc();

    List<NamedWod> findByCategoryAndActiveTrueOrderByNameAsc(NamedWodCategory category);

    Optional<NamedWod> findByIdAndActiveTrue(Long id);
}
