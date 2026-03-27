package com.hyrowod.domain.notification.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.notification.dto.NotificationDto;
import com.hyrowod.domain.notification.entity.Notification;
import com.hyrowod.domain.notification.entity.NotificationType;
import com.hyrowod.domain.notification.repository.NotificationRepository;
import com.hyrowod.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSseService sseService;

    public List<NotificationDto> getMyNotifications(String email) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email)
            .stream().map(NotificationDto::from).toList();
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByUserEmailAndReadFalse(email);
    }

    @Transactional
    public void markAsRead(Long id, String email) {
        Notification n = notificationRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_NOT_FOUND));
        if (!n.getUser().getEmail().equals(email)) {
            throw new BusinessException(ErrorCode.COMMON_FORBIDDEN);
        }
        n.setRead(true);
    }

    @Transactional
    public void markAllAsRead(String email) {
        notificationRepository.markAllReadByEmail(email);
    }

    @Transactional
    public void deleteNotification(Long id, String email) {
        Notification n = notificationRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMMON_NOT_FOUND));
        if (!n.getUser().getEmail().equals(email)) {
            throw new BusinessException(ErrorCode.COMMON_FORBIDDEN);
        }
        notificationRepository.delete(n);
    }

    @Transactional
    public void deleteReadNotifications(String email) {
        notificationRepository.deleteReadByEmail(email);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createNotification(User user, NotificationType type, String message, String link) {
        try {
            Notification notification = notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .link(link)
                .build());

            sseService.sendNotification(user.getId(), Map.of(
                "id", notification.getId(),
                "message", notification.getMessage(),
                "type", notification.getType().name(),
                "link", notification.getLink() != null ? notification.getLink() : ""
            ));
        } catch (Exception e) {
            log.warn("Failed to create notification (type={}, userId={}): {}", type, user.getId(), e.getMessage());
        }
    }
}
