package com.crossfitkorea.domain.review.dto;

import com.crossfitkorea.domain.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewDto {

    private Long id;
    private Long boxId;
    private int rating;
    private String content;
    private String userName;
    private String userProfileImageUrl;
    private LocalDateTime createdAt;

    public static ReviewDto from(Review review) {
        return ReviewDto.builder()
            .id(review.getId())
            .boxId(review.getBox().getId())
            .rating(review.getRating())
            .content(review.getContent())
            .userName(review.getUser().getName())
            .userProfileImageUrl(review.getUser().getProfileImageUrl())
            .createdAt(review.getCreatedAt())
            .build();
    }
}
