package com.hyrowod.domain.performance.repository;

import com.hyrowod.domain.performance.entity.ExerciseType;
import com.hyrowod.domain.performance.entity.PersonalRecord;
import com.hyrowod.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonalRecordRepository extends JpaRepository<PersonalRecord, Long> {
    List<PersonalRecord> findByUserOrderByRecordedAtDesc(User user);
    List<PersonalRecord> findByUserAndExerciseTypeOrderByRecordedAtDesc(User user, ExerciseType type);
    Optional<PersonalRecord> findTopByUserAndExerciseTypeOrderByValueDesc(User user, ExerciseType type);
}
