package com.crossfitkorea.domain.wod.service;

import com.crossfitkorea.common.exception.BusinessException;
import com.crossfitkorea.common.exception.ErrorCode;
import com.crossfitkorea.domain.box.entity.Box;
import com.crossfitkorea.domain.box.service.BoxService;
import com.crossfitkorea.domain.wod.dto.WodCreateRequest;
import com.crossfitkorea.domain.wod.dto.WodDto;
import com.crossfitkorea.domain.wod.entity.Wod;
import com.crossfitkorea.domain.wod.repository.WodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WodService {

    private final WodRepository wodRepository;
    private final BoxService boxService;

    public WodDto getTodayWod(Long boxId) {
        LocalDate today = LocalDate.now();
        Wod wod;

        if (boxId != null) {
            wod = wodRepository.findByBoxIdAndWodDateAndActiveTrue(boxId, today)
                .orElseGet(() -> wodRepository.findByBoxIsNullAndWodDateAndActiveTrue(today)
                    .orElseThrow(() -> new BusinessException(ErrorCode.WOD_NOT_FOUND)));
        } else {
            wod = wodRepository.findByBoxIsNullAndWodDateAndActiveTrue(today)
                .orElseThrow(() -> new BusinessException(ErrorCode.WOD_NOT_FOUND));
        }

        return WodDto.from(wod);
    }

    public Page<WodDto> getWodHistory(Pageable pageable) {
        return wodRepository.findByBoxIsNullAndActiveTrueOrderByWodDateDesc(pageable)
            .map(WodDto::from);
    }

    @Transactional
    public void deleteWod(Long id) {
        Wod wod = wodRepository.findById(id)
            .orElseThrow(() -> new com.crossfitkorea.common.exception.BusinessException(
                com.crossfitkorea.common.exception.ErrorCode.WOD_NOT_FOUND));
        wod.setActive(false);
    }

    @Transactional
    public WodDto createWod(Long boxId, WodCreateRequest request, String ownerEmail) {
        Box box = null;
        if (boxId != null) {
            box = boxService.findActiveBox(boxId);
            if (box.getOwner() == null || !box.getOwner().getEmail().equals(ownerEmail)) {
                throw new BusinessException(ErrorCode.BOX_NOT_AUTHORIZED);
            }
        }

        Wod wod = Wod.builder()
            .box(box)
            .wodDate(request.getWodDate())
            .title(request.getTitle())
            .type(request.getType())
            .content(request.getContent())
            .scoreType(request.getScoreType())
            .imageUrl(request.getImageUrl())
            .build();

        return WodDto.from(wodRepository.save(wod));
    }
}
