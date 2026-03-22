package com.crossfitkorea.domain.box.dto;

import com.crossfitkorea.domain.box.entity.BoxMembership;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class BoxMembershipDto {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long boxId;
    private String boxName;
    private String boxCity;
    private String boxDistrict;
    private String boxAddress;
    private LocalDate joinedAt;
    private long memberCount;
    private long daysInBox;

    public static BoxMembershipDto from(BoxMembership m, long memberCount) {
        long days = m.getJoinedAt() != null
            ? java.time.temporal.ChronoUnit.DAYS.between(m.getJoinedAt(), LocalDate.now())
            : 0;
        return BoxMembershipDto.builder()
            .id(m.getId())
            .userId(m.getUser() != null ? m.getUser().getId() : null)
            .userName(m.getUser() != null ? m.getUser().getName() : null)
            .userEmail(m.getUser() != null ? m.getUser().getEmail() : null)
            .boxId(m.getBox().getId())
            .boxName(m.getBox().getName())
            .boxCity(m.getBox().getCity())
            .boxDistrict(m.getBox().getDistrict())
            .boxAddress(m.getBox().getAddress())
            .joinedAt(m.getJoinedAt())
            .memberCount(memberCount)
            .daysInBox(days)
            .build();
    }
}
