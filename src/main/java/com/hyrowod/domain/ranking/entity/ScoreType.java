package com.hyrowod.domain.ranking.entity;

public enum ScoreType {
    TIME,    // 낮을수록 좋음 (초 단위)
    REPS,    // 높을수록 좋음
    WEIGHT,  // 높을수록 좋음 (kg)
    ROUNDS   // 높을수록 좋음
}
