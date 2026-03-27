package com.hyrowod.domain.box.repository;

import com.hyrowod.domain.box.entity.BoxFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoxFavoriteRepository extends JpaRepository<BoxFavorite, Long> {

    Optional<BoxFavorite> findByUserIdAndBoxId(Long userId, Long boxId);

    boolean existsByUserIdAndBoxId(Long userId, Long boxId);

    Page<BoxFavorite> findByUserEmailOrderByCreatedAtDesc(String email, Pageable pageable);

    long countByBoxId(Long boxId);
}
