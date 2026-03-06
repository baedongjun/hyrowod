package com.crossfitkorea.domain.community.repository;

import com.crossfitkorea.domain.community.entity.Post;
import com.crossfitkorea.domain.community.entity.PostCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByCategoryAndActiveTrueOrderByCreatedAtDesc(PostCategory category, Pageable pageable);

    Page<Post> findByUserEmailAndActiveTrueOrderByCreatedAtDesc(String email, Pageable pageable);
}
