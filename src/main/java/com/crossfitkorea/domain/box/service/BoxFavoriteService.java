package com.crossfitkorea.domain.box.service;

import com.crossfitkorea.domain.box.dto.BoxDto;
import com.crossfitkorea.domain.box.entity.Box;
import com.crossfitkorea.domain.box.entity.BoxFavorite;
import com.crossfitkorea.domain.box.repository.BoxFavoriteRepository;
import com.crossfitkorea.domain.user.entity.User;
import com.crossfitkorea.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoxFavoriteService {

    private final BoxFavoriteRepository boxFavoriteRepository;
    private final BoxService boxService;
    private final UserService userService;

    public boolean isFavorited(Long boxId, String email) {
        User user = userService.getUserByEmail(email);
        return boxFavoriteRepository.existsByUserIdAndBoxId(user.getId(), boxId);
    }

    public Page<BoxDto> getMyFavorites(String email, Pageable pageable) {
        return boxFavoriteRepository.findByUserEmailOrderByCreatedAtDesc(email, pageable)
            .map(f -> BoxDto.from(f.getBox()));
    }

    @Transactional
    public boolean toggleFavorite(Long boxId, String email) {
        User user = userService.getUserByEmail(email);
        Box box = boxService.findActiveBox(boxId);

        return boxFavoriteRepository.findByUserIdAndBoxId(user.getId(), boxId)
            .map(fav -> {
                boxFavoriteRepository.delete(fav);
                return false; // 즐겨찾기 해제
            })
            .orElseGet(() -> {
                boxFavoriteRepository.save(BoxFavorite.builder()
                    .user(user)
                    .box(box)
                    .build());
                return true; // 즐겨찾기 추가
            });
    }
}
