package com.crossfitkorea.domain.competition.service;

import com.crossfitkorea.common.exception.BusinessException;
import com.crossfitkorea.common.exception.ErrorCode;
import com.crossfitkorea.domain.competition.dto.CompetitionCreateRequest;
import com.crossfitkorea.domain.competition.dto.CompetitionDto;
import com.crossfitkorea.domain.competition.entity.Competition;
import com.crossfitkorea.domain.competition.entity.CompetitionStatus;
import com.crossfitkorea.domain.competition.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    public Page<CompetitionDto> getCompetitions(CompetitionStatus status, String city, Pageable pageable) {
        return competitionRepository.searchCompetitions(status, city, pageable)
            .map(CompetitionDto::from);
    }

    public CompetitionDto getCompetition(Long id) {
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));
        return CompetitionDto.from(competition);
    }

    @Transactional
    public CompetitionDto createCompetition(CompetitionCreateRequest request) {
        Competition competition = Competition.builder()
            .name(request.getName())
            .description(request.getDescription())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .location(request.getLocation())
            .city(request.getCity())
            .registrationDeadline(request.getRegistrationDeadline())
            .registrationUrl(request.getRegistrationUrl())
            .imageUrl(request.getImageUrl())
            .organizer(request.getOrganizer())
            .level(request.getLevel())
            .maxParticipants(request.getMaxParticipants())
            .entryFee(request.getEntryFee())
            .build();

        return CompetitionDto.from(competitionRepository.save(competition));
    }

    @Transactional
    public CompetitionDto updateCompetition(Long id, CompetitionCreateRequest request) {
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));

        competition.setName(request.getName());
        competition.setDescription(request.getDescription());
        competition.setStartDate(request.getStartDate());
        competition.setEndDate(request.getEndDate());
        competition.setLocation(request.getLocation());
        competition.setCity(request.getCity());
        competition.setRegistrationDeadline(request.getRegistrationDeadline());
        competition.setRegistrationUrl(request.getRegistrationUrl());
        competition.setImageUrl(request.getImageUrl());
        competition.setOrganizer(request.getOrganizer());
        competition.setLevel(request.getLevel());
        competition.setMaxParticipants(request.getMaxParticipants());
        competition.setEntryFee(request.getEntryFee());

        return CompetitionDto.from(competition);
    }

    @Transactional
    public CompetitionDto updateStatus(Long id, CompetitionStatus status) {
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));
        competition.setStatus(status);
        return CompetitionDto.from(competition);
    }

    @Transactional
    public void deleteCompetition(Long id) {
        Competition competition = competitionRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.COMPETITION_NOT_FOUND));
        competition.setActive(false);
    }
}
