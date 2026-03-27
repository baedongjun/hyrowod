package com.hyrowod.domain.ranking.dto;

import com.hyrowod.domain.ranking.entity.NamedWodRecord;
import com.hyrowod.domain.ranking.entity.ScoreType;
import com.hyrowod.domain.ranking.entity.VerificationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class NamedWodRecordDto {
    private Long id;
    private Long namedWodId;
    private String namedWodName;
    private String userName;
    private ScoreType scoreType;
    private String scoreUnit;
    private Double score;
    private String scoreFormatted;
    private String videoUrl;
    private LocalDate recordedAt;
    private String notes;
    private VerificationStatus status;
    private String verifiedBoxName;
    private String verifiedByName;
    private String verificationComment;
    private LocalDateTime createdAt;

    public static NamedWodRecordDto from(NamedWodRecord r) {
        String boxName = r.getVerifiedBox() != null ? r.getVerifiedBox().getName() : null;
        String verifierName = r.getVerifiedBy() != null ? r.getVerifiedBy().getName() : null;
        ScoreType scoreType = r.getNamedWod().getScoreType();
        return NamedWodRecordDto.builder()
                .id(r.getId())
                .namedWodId(r.getNamedWod().getId())
                .namedWodName(r.getNamedWod().getName())
                .userName(r.getUser().getName())
                .scoreType(scoreType)
                .scoreUnit(r.getNamedWod().getScoreUnit())
                .score(r.getScore())
                .scoreFormatted(RankingEntryDto.formatScoreStatic(r.getScore(), scoreType))
                .videoUrl(r.getVideoUrl())
                .recordedAt(r.getRecordedAt())
                .notes(r.getNotes())
                .status(r.getStatus())
                .verifiedBoxName(boxName)
                .verifiedByName(verifierName)
                .verificationComment(r.getVerificationComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
