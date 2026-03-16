package com.crossfitkorea.domain.notification.dto;

import com.crossfitkorea.domain.notification.entity.Notification;
import com.crossfitkorea.domain.notification.entity.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationDto {

    private Long id;
    private NotificationType type;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationDto from(Notification n) {
        return NotificationDto.builder()
            .id(n.getId())
            .type(n.getType())
            .message(n.getMessage())
            .link(n.getLink())
            .read(n.isRead())
            .createdAt(n.getCreatedAt())
            .build();
    }
}
