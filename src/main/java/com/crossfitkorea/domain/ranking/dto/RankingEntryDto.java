package com.crossfitkorea.domain.ranking.dto;

import com.crossfitkorea.domain.ranking.entity.NamedWodRecord;
import com.crossfitkorea.domain.ranking.entity.ScoreType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class RankingEntryDto {
    private Long recordId;
    private int rank;
    private Long userId;
    private String userName;
    private String userProfileImageUrl;
    private Double score;
    private String scoreFormatted;  // "3:45", "150kg" 등 보기 좋은 형태
    private String videoUrl;
    private LocalDate recordedAt;
    private String verifiedBoxName;  // 인증해준 박스 이름

    public static RankingEntryDto from(NamedWodRecord record, int rank) {
        String boxName = record.getVerifiedBox() != null ? record.getVerifiedBox().getName() : null;
        return RankingEntryDto.builder()
                .recordId(record.getId())
                .rank(rank)
                .userId(record.getUser().getId())
                .userName(record.getUser().getName())
                .userProfileImageUrl(record.getUser().getProfileImageUrl())
                .score(record.getScore())
                .scoreFormatted(formatScore(record.getScore(), record.getNamedWod().getScoreType()))
                .videoUrl(record.getVideoUrl())
                .recordedAt(record.getRecordedAt())
                .verifiedBoxName(boxName)
                .build();
    }

    public static String formatScoreStatic(Double score, ScoreType scoreType) {
        return formatScore(score, scoreType);
    }

    private static String formatScore(Double score, ScoreType scoreType) {
        if (score == null) return "-";
        if (scoreType == ScoreType.TIME) {
            int totalSec = score.intValue();
            int min = totalSec / 60;
            int sec = totalSec % 60;
            return String.format("%d:%02d", min, sec);
        }
        if (score == Math.floor(score)) {
            return String.valueOf(score.intValue());
        }
        return String.format("%.1f", score);
    }
}
