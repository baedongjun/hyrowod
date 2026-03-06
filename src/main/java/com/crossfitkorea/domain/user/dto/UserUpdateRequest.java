package com.crossfitkorea.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UserUpdateRequest {

    @NotBlank(message = "이름을 입력해주세요.")
    private String name;

    private String phone;

    private String profileImageUrl;
}
