package com.crossfitkorea.domain.box.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class BoxCreateRequest {

    @NotBlank(message = "박스 이름을 입력해주세요.")
    private String name;

    @NotBlank(message = "주소를 입력해주세요.")
    private String address;

    @NotBlank(message = "지역을 선택해주세요.")
    private String city;

    private String district;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String website;
    private String instagram;
    private String youtube;
    private String description;
    private Integer monthlyFee;
    private String openTime;
    private String closeTime;
}
