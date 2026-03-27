package com.hyrowod.domain.competition.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.competition.entity.Competition;
import com.hyrowod.domain.competition.entity.CompetitionRegistration;
import com.hyrowod.domain.competition.entity.CompetitionStatus;
import com.hyrowod.domain.competition.repository.CompetitionRegistrationRepository;
import com.hyrowod.domain.competition.repository.CompetitionRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hyrowod.domain.competition.dto.CompetitionDto;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompetitionRegistrationService {

    private final CompetitionRegistrationRepository registrationRepository;
    private final CompetitionRepository competitionRepository;
    private final UserService userService;

    public Map<String, Object> getRegistrationStatus(Long competitionId, String email) {
        boolean registered = email != null &&
            registrationRepository.existsByCompetitionIdAndUserEmailAndCancelledFalse(competitionId, email);
        long count = registrationRepository.countByCompetitionIdAndCancelledFalse(competitionId);
        return Map.of("registered", registered, "count", count);
    }

    @Transactional
    public void register(Long competitionId, String email) {
        Competition competition = competitionRepository.findById(competitionId)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));

        if (competition.getStatus() != CompetitionStatus.OPEN) {
            throw new BusinessException(ErrorCode.COMPETITION_FULL);
        }

        long currentCount = registrationRepository.countByCompetitionIdAndCancelledFalse(competitionId);
        if (competition.getMaxParticipants() != null && currentCount >= competition.getMaxParticipants()) {
            throw new BusinessException(ErrorCode.COMPETITION_FULL);
        }

        User user = userService.getUserByEmail(email);

        // 이미 신청 이력이 있으면 cancelled 여부 체크
        registrationRepository.findByCompetitionIdAndUserEmail(competitionId, email).ifPresentOrElse(r -> {
            if (!r.isCancelled()) throw new BusinessException(ErrorCode.COMPETITION_ALREADY_REGISTERED);
            r.setCancelled(false);  // 재신청
        }, () -> registrationRepository.save(CompetitionRegistration.builder()
            .competition(competition)
            .user(user)
            .build()));
    }

    public List<CompetitionDto> getMyRegistrations(String email) {
        return registrationRepository.findByUserEmailAndCancelledFalseOrderByCreatedAtDesc(email)
            .stream()
            .map(r -> CompetitionDto.from(r.getCompetition(),
                registrationRepository.countByCompetitionIdAndCancelledFalse(r.getCompetition().getId())))
            .toList();
    }

    @Transactional
    public void cancel(Long competitionId, String email) {
        CompetitionRegistration reg = registrationRepository
            .findByCompetitionIdAndUserEmail(competitionId, email)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_REGISTRATION_NOT_FOUND));
        reg.setCancelled(true);
    }
}
