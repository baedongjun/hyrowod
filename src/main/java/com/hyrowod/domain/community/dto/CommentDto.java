package com.hyrowod.domain.community.dto;

import com.hyrowod.domain.community.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommentDto {

    private Long id;
    private Long postId;
    private Long parentId;
    private String content;
    private Long userId;
    private String userName;
    private String userProfileImageUrl;
    private LocalDateTime createdAt;
    private List<CommentDto> replies;
    private int likeCount;

    public static CommentDto from(Comment comment) {
        return CommentDto.builder()
            .id(comment.getId())
            .postId(comment.getPost().getId())
            .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
            .content(comment.getContent())
            .userId(comment.getUser().getId())
            .userName(comment.getUser().getName())
            .userProfileImageUrl(comment.getUser().getProfileImageUrl())
            .createdAt(comment.getCreatedAt())
            .likeCount(comment.getLikeCount())
            .build();
    }
}
