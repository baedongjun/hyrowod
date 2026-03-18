package com.crossfitkorea.domain.advertisement.repository;

import com.crossfitkorea.domain.advertisement.entity.AdPosition;
import com.crossfitkorea.domain.advertisement.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    List<Advertisement> findByActiveTrueAndPositionOrderByPriorityAsc(AdPosition position);
    List<Advertisement> findByActiveTrueOrderByPriorityAsc();
}
