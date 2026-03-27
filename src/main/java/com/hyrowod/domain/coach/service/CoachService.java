package com.hyrowod.domain.coach.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.box.entity.Box;
import com.hyrowod.domain.box.service.BoxService;
import com.hyrowod.domain.coach.dto.CoachCreateRequest;
import com.hyrowod.domain.coach.dto.CoachDto;
import com.hyrowod.domain.coach.entity.Coach;
import com.hyrowod.domain.coach.repository.CoachRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoachService {

    private final CoachRepository coachRepository;
    private final BoxService boxService;

    public List<CoachDto> getCoachesByBox(Long boxId) {
        return coachRepository.findByBoxIdAndActiveTrueOrderByIdAsc(boxId)
            .stream().map(CoachDto::from).toList();
    }

    @Transactional
    public CoachDto createCoach(Long boxId, CoachCreateRequest request, String ownerEmail) {
        Box box = boxService.findActiveBox(boxId);

        if (box.getOwner() == null || !box.getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        Coach coach = Coach.builder()
            .box(box)
            .name(request.getName())
            .bio(request.getBio())
            .imageUrl(request.getImageUrl())
            .certifications(request.getCertifications() != null ? request.getCertifications() : List.of())
            .experienceYears(request.getExperienceYears())
            .build();

        return CoachDto.from(coachRepository.save(coach));
    }

    @Transactional
    public CoachDto updateCoach(Long coachId, CoachCreateRequest request, String ownerEmail) {
        Coach coach = coachRepository.findById(coachId)
            .orElseThrow(() -> new BusinessException(ErrorCode.COACH_NOT_FOUND));

        if (!coach.getBox().getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        coach.setName(request.getName());
        coach.setBio(request.getBio());
        coach.setImageUrl(request.getImageUrl());
        coach.setExperienceYears(request.getExperienceYears());
        if (request.getCertifications() != null) {
            coach.getCertifications().clear();
            coach.getCertifications().addAll(request.getCertifications());
        }

        return CoachDto.from(coach);
    }

    @Transactional
    public void deleteCoach(Long coachId, String ownerEmail) {
        Coach coach = coachRepository.findById(coachId)
            .orElseThrow(() -> new BusinessException(ErrorCode.COACH_NOT_FOUND));

        if (!coach.getBox().getOwner().getEmail().equals(ownerEmail)) {
            throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
        }

        coach.setActive(false);
    }
}
