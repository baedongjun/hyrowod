package com.hyrowod.domain.advertisement.dto;

import com.hyrowod.domain.advertisement.entity.AdPosition;
import com.hyrowod.domain.advertisement.entity.Advertisement;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdvertisementDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String linkUrl;
    private AdPosition position;
    private boolean active;
    private Integer priority;

    public static AdvertisementDto from(Advertisement ad) {
        return AdvertisementDto.builder()
            .id(ad.getId())
            .title(ad.getTitle())
            .description(ad.getDescription())
            .imageUrl(ad.getImageUrl())
            .linkUrl(ad.getLinkUrl())
            .position(ad.getPosition())
            .active(ad.isActive())
            .priority(ad.getPriority())
            .build();
    }
}
