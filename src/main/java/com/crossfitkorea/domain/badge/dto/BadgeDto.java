package com.crossfitkorea.domain.badge.dto;

import com.crossfitkorea.domain.badge.BadgeType;
import com.crossfitkorea.domain.badge.entity.UserBadge;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BadgeDto {

    private Long id;
    private String type;
    private String name;
    private String description;
    private String tier;       // BRONZE | SILVER | GOLD | PLATINUM
    private LocalDateTime awardedAt;

    public static BadgeDto from(UserBadge badge) {
        BadgeType t = badge.getType();
        return BadgeDto.builder()
            .id(badge.getId())
            .type(t.name())
            .name(t.getName())
            .description(t.getDescription())
            .tier(t.getTier())
            .awardedAt(badge.getAwardedAt())
            .build();
    }
}
