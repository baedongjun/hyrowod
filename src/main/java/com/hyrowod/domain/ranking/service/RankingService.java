package com.hyrowod.domain.ranking.service;

import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.box.entity.Box;
import com.hyrowod.domain.box.repository.BoxRepository;
import com.hyrowod.domain.ranking.dto.*;
import com.hyrowod.domain.ranking.entity.*;
import com.hyrowod.domain.ranking.repository.NamedWodRecordRepository;
import com.hyrowod.domain.ranking.repository.NamedWodRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.entity.UserRole;
import com.hyrowod.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final NamedWodRepository namedWodRepository;
    private final NamedWodRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final BoxRepository boxRepository;

    /** 활성 Named WOD 목록 */
    public List<NamedWodDto> getNamedWods() {
        return namedWodRepository.findByActiveTrueOrderByCategoryAscNameAsc()
                .stream()
                .map(wod -> NamedWodDto.from(wod,
                        recordRepository.countByNamedWodAndStatus(wod, VerificationStatus.VERIFIED)))
                .collect(Collectors.toList());
    }

    /** Named WOD 상세 + 랭킹 */
    public NamedWodDetailDto getDetail(Long namedWodId, String email) {
        NamedWod wod = namedWodRepository.findByIdAndActiveTrue(namedWodId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_NOT_FOUND));

        List<NamedWodRecord> verifiedRecords =
                recordRepository.findByNamedWodAndStatusOrderByScoreAsc(wod, VerificationStatus.VERIFIED);

        // TIME 타입은 낮을수록 좋음 (이미 ASC로 정렬됨)
        // REPS/WEIGHT/ROUNDS는 높을수록 좋음 → 역순
        if (wod.getScoreType() != ScoreType.TIME) {
            verifiedRecords = new ArrayList<>(verifiedRecords);
            java.util.Collections.reverse(verifiedRecords);
        }

        AtomicInteger rankCounter = new AtomicInteger(1);
        List<RankingEntryDto> leaderboard = verifiedRecords.stream()
                .map(r -> RankingEntryDto.from(r, rankCounter.getAndIncrement()))
                .collect(Collectors.toList());

        NamedWodRecordDto myRecord = null;
        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                myRecord = recordRepository.findTopByNamedWodAndUserOrderByCreatedAtDesc(wod, user)
                        .map(NamedWodRecordDto::from).orElse(null);
            }
        }

        return NamedWodDetailDto.builder()
                .id(wod.getId())
                .name(wod.getName())
                .description(wod.getDescription())
                .category(wod.getCategory())
                .scoreType(wod.getScoreType())
                .scoreUnit(wod.getScoreUnit())
                .leaderboard(leaderboard)
                .myLatestRecord(myRecord)
                .build();
    }

    /** 기록 제출 */
    @Transactional
    public NamedWodRecordDto submitRecord(String email, NamedWodRecordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        NamedWod wod = namedWodRepository.findByIdAndActiveTrue(request.getNamedWodId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_NOT_FOUND));

        NamedWodRecord record = NamedWodRecord.builder()
                .namedWod(wod)
                .user(user)
                .score(request.getScore())
                .videoUrl(request.getVideoUrl())
                .recordedAt(request.getRecordedAt() != null ? request.getRecordedAt() : LocalDate.now())
                .notes(request.getNotes())
                .status(VerificationStatus.PENDING)
                .build();

        return NamedWodRecordDto.from(recordRepository.save(record));
    }

    /** 내 기록 목록 */
    public Page<NamedWodRecordDto> getMyRecords(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return recordRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(page, size))
                .map(NamedWodRecordDto::from);
    }

    /** 인증 대기 기록 목록 (박스 오너용) */
    public Page<NamedWodRecordDto> getPendingRecords(int page, int size) {
        return recordRepository.findByStatusOrderByCreatedAtAsc(
                VerificationStatus.PENDING, PageRequest.of(page, size))
                .map(NamedWodRecordDto::from);
    }

    /** 기록 인증 */
    @Transactional
    public NamedWodRecordDto verifyRecord(Long recordId, String email, VerificationRequest request) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.ROLE_BOX_OWNER && owner.getRole() != UserRole.ROLE_ADMIN) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        NamedWodRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_RECORD_NOT_FOUND));

        if (record.getStatus() != VerificationStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 박스 오너의 경우 본인이 오너인 박스를 인증 박스로 설정
        Box ownerBox = null;
        if (owner.getRole() == UserRole.ROLE_BOX_OWNER) {
            ownerBox = boxRepository.findByOwnerEmailAndActiveTrue(
                    owner.getEmail(), PageRequest.of(0, 1))
                    .getContent().stream().findFirst().orElse(null);
        }

        record.verify(owner, ownerBox, request.getComment());
        return NamedWodRecordDto.from(recordRepository.save(record));
    }

    /** 기록 거절 */
    @Transactional
    public NamedWodRecordDto rejectRecord(Long recordId, String email, VerificationRequest request) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.ROLE_BOX_OWNER && owner.getRole() != UserRole.ROLE_ADMIN) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        NamedWodRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_RECORD_NOT_FOUND));

        if (record.getStatus() != VerificationStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        record.reject(owner, request.getComment());
        return NamedWodRecordDto.from(recordRepository.save(record));
    }

    /** 인증된 기록 목록 — 어드민 관리용 */
    public Page<NamedWodRecordDto> getVerifiedRecords(int page, int size) {
        return recordRepository.findByStatusOrderByCreatedAtDesc(
                VerificationStatus.VERIFIED, PageRequest.of(page, size))
                .map(NamedWodRecordDto::from);
    }

    /** 기록 삭제 (어드민) */
    @Transactional
    public void deleteRecord(Long recordId) {
        NamedWodRecord record = recordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_RECORD_NOT_FOUND));
        recordRepository.delete(record);
    }

    /** Named WOD 등록 (어드민) */
    @Transactional
    public NamedWodDto createNamedWod(NamedWodCreateRequest request) {
        NamedWod wod = NamedWod.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .scoreType(request.getScoreType())
                .scoreUnit(request.getScoreUnit())
                .build();
        NamedWod saved = namedWodRepository.save(wod);
        return NamedWodDto.from(saved, 0);
    }

    /** Named WOD 수정 (어드민) */
    @Transactional
    public NamedWodDto updateNamedWod(Long id, NamedWodCreateRequest request) {
        NamedWod wod = namedWodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_NOT_FOUND));
        wod.update(request.getName(), request.getDescription(),
                request.getCategory(), request.getScoreType(), request.getScoreUnit());
        long count = recordRepository.countByNamedWodAndStatus(wod, VerificationStatus.VERIFIED);
        return NamedWodDto.from(wod, count);
    }

    /** Named WOD 활성화/비활성화 (어드민) */
    @Transactional
    public void toggleActive(Long id, boolean active) {
        NamedWod wod = namedWodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NAMED_WOD_NOT_FOUND));
        wod.setActive(active);
    }

    /** 종합 랭킹 개요 — WOD별 TOP 3 */
    public List<RankingOverviewDto> getOverview() {
        return namedWodRepository.findByActiveTrueOrderByCategoryAscNameAsc()
                .stream()
                .map(wod -> {
                    List<NamedWodRecord> verified =
                            recordRepository.findByNamedWodAndStatusOrderByScoreAsc(wod, VerificationStatus.VERIFIED);

                    if (wod.getScoreType() != ScoreType.TIME) {
                        verified = new ArrayList<>(verified);
                        java.util.Collections.reverse(verified);
                    }

                    AtomicInteger rank = new AtomicInteger(1);
                    List<RankingEntryDto> top3 = verified.stream()
                            .limit(3)
                            .map(r -> RankingEntryDto.from(r, rank.getAndIncrement()))
                            .collect(Collectors.toList());

                    return RankingOverviewDto.builder()
                            .wodId(wod.getId())
                            .wodName(wod.getName())
                            .category(wod.getCategory())
                            .scoreType(wod.getScoreType())
                            .scoreUnit(wod.getScoreUnit())
                            .totalVerified(verified.size())
                            .top3(top3)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
