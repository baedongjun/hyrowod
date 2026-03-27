package com.hyrowod.domain.box.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.box.dto.BoxClaimDto;
import com.hyrowod.domain.box.dto.BoxDto;
import com.hyrowod.domain.box.entity.Box;
import com.hyrowod.domain.box.entity.BoxClaimRequest;
import com.hyrowod.domain.box.entity.BoxClaimStatus;
import com.hyrowod.domain.box.repository.BoxClaimRepository;
import com.hyrowod.domain.box.repository.BoxRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoxClaimService {

    private final BoxClaimRepository claimRepository;
    private final BoxRepository boxRepository;
    private final UserService userService;

    @Transactional
    public BoxClaimDto submitClaim(Long boxId, String requesterEmail, String message) {
        Box box = boxRepository.findById(boxId)
            .orElseThrow(() -> new BusinessException(ErrorCode.BOX_NOT_FOUND));

        if (box.getOwner() != null) {
            throw new BusinessException(ErrorCode.BOX_ALREADY_HAS_OWNER);
        }

        if (claimRepository.existsByBoxIdAndRequesterEmailAndStatus(boxId, requesterEmail, BoxClaimStatus.PENDING)) {
            throw new BusinessException(ErrorCode.BOX_CLAIM_ALREADY_PENDING);
        }

        User requester = userService.getUserByEmail(requesterEmail);

        BoxClaimRequest claim = claimRepository.save(BoxClaimRequest.builder()
            .box(box)
            .requester(requester)
            .message(message)
            .build());

        return BoxClaimDto.from(claim);
    }

    public List<BoxClaimDto> getMyClaims(String email) {
        return claimRepository.findByRequesterEmailOrderByCreatedAtDesc(email)
            .stream().map(BoxClaimDto::from).toList();
    }

    public Page<BoxClaimDto> getAllClaims(Pageable pageable) {
        return claimRepository.findAllByOrderByCreatedAtDesc(pageable).map(BoxClaimDto::from);
    }

    @Transactional
    public BoxClaimDto approveClaim(Long claimId, String adminNote) {
        BoxClaimRequest claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new BusinessException(ErrorCode.BOX_CLAIM_NOT_FOUND));

        Box box = claim.getBox();
        if (box.getOwner() != null) {
            throw new BusinessException(ErrorCode.BOX_ALREADY_HAS_OWNER);
        }

        // Assign owner
        box.setOwner(claim.getRequester());
        boxRepository.save(box);

        // Approve this claim
        claim.setStatus(BoxClaimStatus.APPROVED);
        claim.setAdminNote(adminNote);

        // Reject all other pending claims for the same box
        claimRepository.findByBoxIdAndStatus(box.getId(), BoxClaimStatus.PENDING)
            .stream()
            .filter(c -> !c.getId().equals(claimId))
            .forEach(c -> {
                c.setStatus(BoxClaimStatus.REJECTED);
                c.setAdminNote("다른 신청이 승인되어 자동 거절되었습니다.");
            });

        return BoxClaimDto.from(claim);
    }

    @Transactional
    public BoxClaimDto rejectClaim(Long claimId, String adminNote) {
        BoxClaimRequest claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new BusinessException(ErrorCode.BOX_CLAIM_NOT_FOUND));

        claim.setStatus(BoxClaimStatus.REJECTED);
        claim.setAdminNote(adminNote);
        return BoxClaimDto.from(claim);
    }

    @Transactional
    public BoxDto assignOwner(Long boxId, Long userId) {
        Box box = boxRepository.findById(boxId)
            .orElseThrow(() -> new BusinessException(ErrorCode.BOX_NOT_FOUND));

        User newOwner = userService.getUserById(userId);
        box.setOwner(newOwner);
        return BoxDto.from(boxRepository.save(box));
    }
}
