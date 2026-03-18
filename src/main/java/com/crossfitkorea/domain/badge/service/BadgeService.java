package com.crossfitkorea.domain.badge.service;

import com.crossfitkorea.domain.badge.BadgeType;
import com.crossfitkorea.domain.badge.dto.BadgeDto;
import com.crossfitkorea.domain.badge.entity.UserBadge;
import com.crossfitkorea.domain.badge.repository.UserBadgeRepository;
import com.crossfitkorea.domain.notification.entity.NotificationType;
import com.crossfitkorea.domain.notification.service.NotificationService;
import com.crossfitkorea.domain.user.entity.User;
import com.crossfitkorea.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BadgeService {

    private final UserBadgeRepository userBadgeRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    // ── WOD 기록 후 호출 ──────────────────────────────────────
    @Transactional
    public void checkWodBadges(User user, long totalWodCount, String wodTitle) {
        if (totalWodCount >= 1)   award(user, BadgeType.FIRST_WOD);
        if (totalWodCount >= 10)  award(user, BadgeType.WOD_10);
        if (totalWodCount >= 50)  award(user, BadgeType.WOD_50);
        if (totalWodCount >= 100) award(user, BadgeType.WOD_100);

        // 벤치마크 WOD 제목 매칭 (대소문자 무관)
        if (wodTitle != null) {
            String t = wodTitle.trim().toLowerCase();
            if (t.equals("fran"))              award(user, BadgeType.BENCHMARK_FRAN);
            else if (t.equals("helen"))        award(user, BadgeType.BENCHMARK_HELEN);
            else if (t.equals("grace"))        award(user, BadgeType.BENCHMARK_GRACE);
            else if (t.equals("diane"))        award(user, BadgeType.BENCHMARK_DIANE);
            else if (t.equals("karen"))        award(user, BadgeType.BENCHMARK_KAREN);
            else if (t.equals("cindy"))        award(user, BadgeType.BENCHMARK_CINDY);
            else if (t.contains("murph"))      award(user, BadgeType.BENCHMARK_MURPH);
            else if (t.equals("annie"))        award(user, BadgeType.BENCHMARK_ANNIE);
        }
    }

    // ── 게시글 작성 후 호출 ────────────────────────────────────
    @Transactional
    public void checkPostBadges(User user, long totalPostCount) {
        if (totalPostCount >= 1)  award(user, BadgeType.FIRST_POST);
        if (totalPostCount >= 10) award(user, BadgeType.ACTIVE_POSTER);
    }

    // ── 리뷰 작성 후 호출 ─────────────────────────────────────
    @Transactional
    public void checkReviewBadge(User user) {
        award(user, BadgeType.FIRST_REVIEW);
    }

    // ── 박스 가입/WOD 기록 시 멤버십 기간 체크 ─────────────────
    @Transactional
    public void checkMembershipBadges(User user, long daysInBox) {
        if (daysInBox >= 30)  award(user, BadgeType.BOX_MEMBER_30);
        if (daysInBox >= 90)  award(user, BadgeType.BOX_MEMBER_90);
        if (daysInBox >= 365) award(user, BadgeType.BOX_MEMBER_365);
    }

    // ── 단일 배지 수여 ─────────────────────────────────────────
    @Transactional
    public void award(User user, BadgeType type) {
        if (!userBadgeRepository.existsByUserAndType(user, type)) {
            try {
                userBadgeRepository.save(
                    UserBadge.builder().user(user).type(type).build()
                );
                log.info("[배지] {} → {}", user.getEmail(), type.getName());
                notificationService.createNotification(
                    user,
                    NotificationType.BADGE,
                    "🏅 새 배지를 획득했습니다: " + type.getName() + " (" + type.getTier() + ")",
                    "/my"
                );
            } catch (Exception e) {
                log.debug("[배지] 중복 무시: {}", type);
            }
        }
    }

    // ── 조회 ──────────────────────────────────────────────────
    public List<BadgeDto> getMyBadges(String email) {
        User user = userService.getUserByEmail(email);
        return userBadgeRepository.findByUserOrderByAwardedAtDesc(user)
            .stream().map(BadgeDto::from).toList();
    }

    public List<BadgeDto> getUserBadges(Long userId) {
        User user = userService.getUserById(userId);
        return userBadgeRepository.findByUserOrderByAwardedAtDesc(user)
            .stream().map(BadgeDto::from).toList();
    }
}
