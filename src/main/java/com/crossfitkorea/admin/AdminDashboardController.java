package com.crossfitkorea.admin;

import com.crossfitkorea.common.ApiResponse;
import com.crossfitkorea.domain.box.repository.BoxRepository;
import com.crossfitkorea.domain.community.repository.PostRepository;
import com.crossfitkorea.domain.competition.repository.CompetitionRepository;
import com.crossfitkorea.domain.user.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "어드민 API")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final BoxRepository boxRepository;
    private final PostRepository postRepository;
    private final CompetitionRepository competitionRepository;

    @Operation(summary = "대시보드 통계")
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Map<String, Object> stats = Map.of(
            "totalUsers", userRepository.count(),
            "totalBoxes", boxRepository.countByActiveTrue(),
            "totalPosts", postRepository.count(),
            "totalCompetitions", competitionRepository.countByActiveTrue()
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
