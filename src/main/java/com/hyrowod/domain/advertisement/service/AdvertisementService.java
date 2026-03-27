package com.hyrowod.domain.advertisement.service;

import com.hyrowod.domain.advertisement.dto.AdvertisementDto;
import com.hyrowod.domain.advertisement.entity.AdPosition;
import com.hyrowod.domain.advertisement.entity.Advertisement;
import com.hyrowod.domain.advertisement.repository.AdvertisementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;

    public List<AdvertisementDto> getActiveAds(String position) {
        if (position != null) {
            AdPosition pos = AdPosition.valueOf(position.toUpperCase());
            return advertisementRepository.findByActiveTrueAndPositionOrderByPriorityAsc(pos)
                .stream().map(AdvertisementDto::from).toList();
        }
        return advertisementRepository.findByActiveTrueOrderByPriorityAsc()
            .stream().map(AdvertisementDto::from).toList();
    }

    @Transactional
    public AdvertisementDto create(String title, String description, String imageUrl, String linkUrl, String position, Integer priority) {
        Advertisement ad = Advertisement.builder()
            .title(title)
            .description(description)
            .imageUrl(imageUrl)
            .linkUrl(linkUrl)
            .position(position != null ? AdPosition.valueOf(position.toUpperCase()) : AdPosition.BANNER)
            .priority(priority != null ? priority : 0)
            .active(true)
            .build();
        return AdvertisementDto.from(advertisementRepository.save(ad));
    }

    @Transactional
    public AdvertisementDto update(Long id, String title, String description, String imageUrl, String linkUrl, String position, Integer priority) {
        Advertisement ad = advertisementRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("광고를 찾을 수 없습니다."));
        ad.update(title, description, imageUrl, linkUrl,
            position != null ? AdPosition.valueOf(position.toUpperCase()) : ad.getPosition(),
            priority);
        return AdvertisementDto.from(ad);
    }

    @Transactional
    public void toggleActive(Long id, boolean active) {
        Advertisement ad = advertisementRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("광고를 찾을 수 없습니다."));
        if (active) ad.activate(); else ad.deactivate();
    }

    @Transactional
    public void delete(Long id) {
        advertisementRepository.deleteById(id);
    }
}
