package com.crossfitkorea.domain.box.service;

import com.crossfitkorea.domain.badge.BadgeType;
import com.crossfitkorea.domain.badge.service.BadgeService;
import com.crossfitkorea.domain.box.dto.BoxMembershipDto;
import com.crossfitkorea.domain.box.entity.Box;
import com.crossfitkorea.domain.box.entity.BoxMembership;
import com.crossfitkorea.domain.box.repository.BoxMembershipRepository;
import com.crossfitkorea.domain.box.repository.BoxRepository;
import com.crossfitkorea.domain.notification.entity.NotificationType;
import com.crossfitkorea.domain.notification.service.NotificationService;
import com.crossfitkorea.domain.user.entity.User;
import com.crossfitkorea.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoxMembershipService {

    private final BoxMembershipRepository membershipRepository;
    private final BoxRepository boxRepository;
    private final UserService userService;
    private final BadgeService badgeService;
    private final NotificationService notificationService;

    @Transactional
    public BoxMembershipDto join(Long boxId, String email) {
        User user = userService.getUserByEmail(email);
        Box box = getBox(boxId);

        // 이미 같은 박스 가입 여부 확인
        if (membershipRepository.findByUserAndBoxIdAndActiveTrue(user, boxId).isPresent()) {
            throw new IllegalStateException("이미 가입된 박스입니다.");
        }

        // 다른 박스 기존 멤버십 비활성화 (한 번에 하나의 박스만 가입 가능)
        membershipRepository.findByUserAndActiveTrue(user)
            .ifPresent(BoxMembership::deactivate);

        BoxMembership membership = membershipRepository.save(
            BoxMembership.builder()
                .user(user)
                .box(box)
                .joinedAt(LocalDate.now())
                .active(true)
                .build()
        );

        // 배지 수여: 첫 박스 가입
        badgeService.award(user, BadgeType.BOX_ROOKIE);

        // 알림 발행
        notificationService.createNotification(
            user,
            NotificationType.MEMBERSHIP,
            "🏋️ " + box.getName() + " 박스에 가입했습니다!",
            "/boxes/" + box.getId()
        );

        long memberCount = membershipRepository.countByBoxIdAndActiveTrue(boxId);
        return BoxMembershipDto.from(membership, memberCount);
    }

    @Transactional
    public void leave(Long boxId, String email) {
        User user = userService.getUserByEmail(email);
        BoxMembership membership = membershipRepository
            .findByUserAndBoxIdAndActiveTrue(user, boxId)
            .orElseThrow(() -> new IllegalStateException("가입된 박스가 아닙니다."));
        Box box = membership.getBox();
        membership.deactivate();

        notificationService.createNotification(
            user,
            NotificationType.MEMBERSHIP,
            "🏃 " + box.getName() + " 박스를 탈퇴했습니다.",
            "/boxes/" + box.getId()
        );
    }

    public Optional<BoxMembershipDto> getMyBox(String email) {
        User user = userService.getUserByEmail(email);
        return membershipRepository.findByUserAndActiveTrue(user)
            .map(m -> BoxMembershipDto.from(m,
                membershipRepository.countByBoxIdAndActiveTrue(m.getBox().getId())));
    }

    public List<BoxMembershipDto> getBoxMembers(Long boxId) {
        long count = membershipRepository.countByBoxIdAndActiveTrue(boxId);
        return membershipRepository.findByBoxIdAndActiveTrueOrderByJoinedAtAsc(boxId)
            .stream()
            .map(m -> BoxMembershipDto.from(m, count))
            .toList();
    }

    public long getMemberCount(Long boxId) {
        return membershipRepository.countByBoxIdAndActiveTrue(boxId);
    }

    public boolean isMember(Long boxId, String email) {
        try {
            User user = userService.getUserByEmail(email);
            return membershipRepository.findByUserAndBoxIdAndActiveTrue(user, boxId).isPresent();
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void removeMember(Long boxId, Long userId, String ownerEmail) {
        User owner = userService.getUserByEmail(ownerEmail);
        Box box = getBox(boxId);

        boolean isOwner = box.getOwner() != null && box.getOwner().getId().equals(owner.getId());
        boolean isAdmin = owner.getRole().name().equals("ROLE_ADMIN");
        if (!isOwner && !isAdmin) {
            throw new IllegalStateException("권한이 없습니다.");
        }

        User member = userService.getUserById(userId);
        BoxMembership membership = membershipRepository
            .findByUserAndBoxIdAndActiveTrue(member, boxId)
            .orElseThrow(() -> new IllegalStateException("해당 멤버를 찾을 수 없습니다."));
        membership.deactivate();

        notificationService.createNotification(
            member,
            NotificationType.MEMBERSHIP,
            "📢 " + box.getName() + " 박스에서 탈퇴 처리되었습니다.",
            "/boxes/" + boxId
        );
    }

    private Box getBox(Long boxId) {
        return boxRepository.findById(boxId)
            .orElseThrow(() -> new IllegalArgumentException("박스를 찾을 수 없습니다."));
    }
}
