package com.crossfitkorea.domain.box.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoxSearchRequest {
    private String city;
    private String district;
    private String keyword;
    private Boolean verified;
    private Boolean premium;
    private Integer maxFee;
    private Double minRating;
}
