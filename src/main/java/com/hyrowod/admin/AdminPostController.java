package com.hyrowod.admin;

import com.hyrowod.common.ApiResponse;
import com.hyrowod.common.exception.BusinessException;
import com.hyrowod.common.exception.ErrorCode;
import com.hyrowod.domain.community.dto.PostDto;
import com.hyrowod.domain.community.entity.Post;
import com.hyrowod.domain.community.entity.PostCategory;
import com.hyrowod.domain.community.service.PostService;
import com.hyrowod.domain.community.repository.PostRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "어드민 콘텐츠 관리 API")
public class AdminPostController {

    private final PostService postService;
    private final PostRepository postRepository;

    @Operation(summary = "[어드민] 전체 게시글 목록 (필터)")
    @GetMapping("/posts")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<PostDto>>> getAllPosts(
        @RequestParam(required = false) PostCategory category,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Boolean pinned,
        @RequestParam(defaultValue = "false") boolean reportedOnly,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword : null;
        Page<PostDto> posts = postRepository.searchPostsAdmin(category, kw, pinned, reportedOnly, pageable)
            .map(PostDto::from);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @Operation(summary = "[어드민] 게시글 공지 고정/해제")
    @Transactional
    @PatchMapping("/posts/{id}/pin")
    public ResponseEntity<ApiResponse<PostDto>> togglePin(@PathVariable Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        post.setPinned(!post.isPinned());
        return ResponseEntity.ok(ApiResponse.success(PostDto.from(post)));
    }

    @Operation(summary = "[어드민] 게시글 강제 삭제")
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.adminDeletePost(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "[어드민] 댓글 강제 삭제")
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long id) {
        postService.adminDeleteComment(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Operation(summary = "[어드민] 신고된 게시글 목록 (신고 1건 이상)")
    @GetMapping("/posts/reported")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Page<PostDto>>> getReportedPosts(
        @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<PostDto> posts = postRepository
            .findByActiveTrueAndReportCountGreaterThanOrderByReportCountDesc(0, pageable)
            .map(PostDto::from);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @Operation(summary = "[어드민] 신고 카운트 초기화")
    @Transactional
    @PatchMapping("/posts/{id}/clear-reports")
    public ResponseEntity<ApiResponse<Void>> clearReports(@PathVariable Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
        post.clearReports();
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
