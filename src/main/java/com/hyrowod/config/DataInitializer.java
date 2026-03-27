package com.hyrowod.config;

import com.hyrowod.domain.ranking.entity.NamedWod;
import com.hyrowod.domain.ranking.entity.NamedWodCategory;
import com.hyrowod.domain.ranking.entity.ScoreType;
import com.hyrowod.domain.ranking.repository.NamedWodRepository;
import com.hyrowod.domain.user.entity.User;
import com.hyrowod.domain.user.entity.UserRole;
import com.hyrowod.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private final NamedWodRepository namedWodRepository;

    @Override
    public void run(String... args) {
        // OAuth2 소셜 로그인 지원: password 컬럼 nullable 마이그레이션
        try {
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");
            log.info("✅ users.password column: NOT NULL constraint removed");
        } catch (Exception e) {
            // 이미 nullable이거나 컬럼 없으면 무시
        }

        String adminEmail = "admin@crossfitkorea.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("Admin1234!"))
                .name("관리자")
                .role(UserRole.ROLE_ADMIN)
                .build();
            userRepository.save(admin);
            log.info("✅ Admin account created: {}", adminEmail);
        }

        seedNamedWods();
    }

    private void seedNamedWods() {
        if (namedWodRepository.count() > 0) return;

        List<NamedWod> wods = List.of(
            // ── GIRLS ──────────────────────────────────────────────────────────
            NamedWod.builder()
                .name("Fran")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("21-15-9\nThruster (43/29 kg)\nPull-up")
                .build(),
            NamedWod.builder()
                .name("Helen")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("3 Rounds For Time\n400m Run\n21 Kettlebell Swing (24/16 kg)\n12 Pull-up")
                .build(),
            NamedWod.builder()
                .name("Grace")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("30 Clean & Jerk (61/43 kg)\nFor Time")
                .build(),
            NamedWod.builder()
                .name("Isabel")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("30 Snatch (61/43 kg)\nFor Time")
                .build(),
            NamedWod.builder()
                .name("Annie")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("50-40-30-20-10\nDouble Under\nSit-up")
                .build(),
            NamedWod.builder()
                .name("Diane")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("21-15-9\nDeadlift (102/70 kg)\nHandstand Push-up")
                .build(),
            NamedWod.builder()
                .name("Elizabeth")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("21-15-9\nClean (61/43 kg)\nRing Dip")
                .build(),
            NamedWod.builder()
                .name("Jackie")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("For Time\n1000m Row\n50 Thruster (20/15 kg)\n30 Pull-up")
                .build(),
            NamedWod.builder()
                .name("Kelly")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("5 Rounds For Time\n400m Run\n30 Box Jump (61/51 cm)\n30 Wall Ball (9/6 kg)")
                .build(),
            NamedWod.builder()
                .name("Nancy")
                .category(NamedWodCategory.GIRLS)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("5 Rounds For Time\n400m Run\n15 Overhead Squat (43/29 kg)")
                .build(),

            // ── HEROES ─────────────────────────────────────────────────────────
            NamedWod.builder()
                .name("Murph")
                .category(NamedWodCategory.HEROES)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("For Time (weighted vest 9kg 권장)\n1 Mile Run\n100 Pull-up\n200 Push-up\n300 Air Squat\n1 Mile Run")
                .build(),
            NamedWod.builder()
                .name("DT")
                .category(NamedWodCategory.HEROES)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("5 Rounds For Time\n12 Deadlift (70/47 kg)\n9 Hang Power Clean\n6 Push Jerk")
                .build(),
            NamedWod.builder()
                .name("Cindy")
                .category(NamedWodCategory.HEROES)
                .scoreType(ScoreType.ROUNDS)
                .scoreUnit("라운드")
                .description("AMRAP 20min\n5 Pull-up\n10 Push-up\n15 Air Squat")
                .build(),
            NamedWod.builder()
                .name("Chad")
                .category(NamedWodCategory.HEROES)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("For Time (weighted vest 20lb)\n1000 Box Step (50cm, 45lb plate)")
                .build(),

            // ── BENCHMARK ──────────────────────────────────────────────────────
            NamedWod.builder()
                .name("Fight Gone Bad")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.REPS)
                .scoreUnit("점")
                .description("3 Rounds (1min each station, 1min rest)\nWall Ball (9/6 kg)\nSumo Deadlift High Pull (35/25 kg)\nBox Jump (51cm)\nPush Press (35/25 kg)\nRow (칼로리)\n* 총 반복 수가 점수")
                .build(),
            NamedWod.builder()
                .name("Barbara")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.TIME)
                .scoreUnit("초")
                .description("5 Rounds For Time (3min rest between rounds)\n20 Pull-up\n30 Push-up\n40 Sit-up\n50 Air Squat")
                .build(),
            NamedWod.builder()
                .name("Chelsea")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.ROUNDS)
                .scoreUnit("라운드")
                .description("EMOM 30min (완료한 라운드 수)\n5 Pull-up\n10 Push-up\n15 Air Squat")
                .build(),
            NamedWod.builder()
                .name("Mary")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.ROUNDS)
                .scoreUnit("라운드+렙")
                .description("AMRAP 20min\n5 Handstand Push-up\n10 Pistol (각 5회)\n15 Pull-up")
                .build(),
            NamedWod.builder()
                .name("1RM Back Squat")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.WEIGHT)
                .scoreUnit("kg")
                .description("Back Squat 1 Rep Max")
                .build(),
            NamedWod.builder()
                .name("1RM Clean & Jerk")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.WEIGHT)
                .scoreUnit("kg")
                .description("Clean & Jerk 1 Rep Max")
                .build(),
            NamedWod.builder()
                .name("1RM Snatch")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.WEIGHT)
                .scoreUnit("kg")
                .description("Snatch 1 Rep Max")
                .build(),
            NamedWod.builder()
                .name("1RM Deadlift")
                .category(NamedWodCategory.BENCHMARK)
                .scoreType(ScoreType.WEIGHT)
                .scoreUnit("kg")
                .description("Deadlift 1 Rep Max")
                .build()
        );

        namedWodRepository.saveAll(wods);
        log.info("✅ Named WOD seed data inserted: {}개", wods.size());
    }
}
