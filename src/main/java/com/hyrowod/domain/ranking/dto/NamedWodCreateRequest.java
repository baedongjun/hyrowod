package com.hyrowod.domain.ranking.dto;

import com.hyrowod.domain.ranking.entity.NamedWodCategory;
import com.hyrowod.domain.ranking.entity.ScoreType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class NamedWodCreateRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private NamedWodCategory category;

    @NotNull
    private ScoreType scoreType;

    private String scoreUnit;
}
