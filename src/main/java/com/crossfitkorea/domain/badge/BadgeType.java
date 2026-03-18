package com.crossfitkorea.domain.badge;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BadgeType {

    // ─── WOD 기록 ───────────────────────────────────────────
    FIRST_WOD     ("첫 WOD",     "첫 번째 WOD를 기록했습니다!",       "BRONZE"),
    WOD_10        ("WOD 10회",   "WOD를 10회 완료했습니다",            "SILVER"),
    WOD_50        ("WOD 50회",   "WOD를 50회 완료했습니다",            "GOLD"),
    WOD_100       ("WOD 100회",  "WOD를 100회 완료했습니다",           "PLATINUM"),

    // ─── CrossFit 벤치마크 WOD ────────────────────────────
    BENCHMARK_FRAN  ("Fran",     "벤치마크 WOD Fran을 완주했습니다",   "SILVER"),
    BENCHMARK_HELEN ("Helen",    "벤치마크 WOD Helen을 완주했습니다",  "SILVER"),
    BENCHMARK_GRACE ("Grace",    "벤치마크 WOD Grace를 완주했습니다",  "SILVER"),
    BENCHMARK_DIANE ("Diane",    "벤치마크 WOD Diane을 완주했습니다",  "SILVER"),
    BENCHMARK_KAREN ("Karen",    "벤치마크 WOD Karen을 완주했습니다",  "SILVER"),
    BENCHMARK_CINDY ("Cindy",    "벤치마크 WOD Cindy를 완주했습니다",  "SILVER"),
    BENCHMARK_MURPH ("Murph",    "전설의 WOD Murph를 완주했습니다",    "GOLD"),
    BENCHMARK_ANNIE ("Annie",    "벤치마크 WOD Annie를 완주했습니다",  "SILVER"),

    // ─── 박스 멤버십 ─────────────────────────────────────
    BOX_ROOKIE      ("박스 루키",   "박스에 처음 가입했습니다",         "BRONZE"),
    BOX_MEMBER_30   ("30일 멤버",   "박스 멤버로 30일을 채웠습니다",    "SILVER"),
    BOX_MEMBER_90   ("90일 멤버",   "박스 멤버로 90일을 채웠습니다",    "GOLD"),
    BOX_MEMBER_365  ("1년 멤버",    "박스 멤버로 1년을 채웠습니다",     "PLATINUM"),

    // ─── 커뮤니티 ────────────────────────────────────────
    FIRST_POST      ("첫 글쓴이",   "첫 번째 게시글을 작성했습니다",    "BRONZE"),
    ACTIVE_POSTER   ("활발한 회원", "게시글을 10개 작성했습니다",        "SILVER"),
    FIRST_REVIEW    ("리뷰어",      "첫 번째 박스 리뷰를 작성했습니다", "BRONZE");

    private final String name;
    private final String description;
    private final String tier; // BRONZE | SILVER | GOLD | PLATINUM
}
