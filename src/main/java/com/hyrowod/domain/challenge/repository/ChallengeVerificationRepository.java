package com.hyrowod.domain.challenge.repository;

import com.hyrowod.domain.challenge.entity.Challenge;
import com.hyrowod.domain.challenge.entity.ChallengeVerification;
import com.hyrowod.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ChallengeVerificationRepository extends JpaRepository<ChallengeVerification, Long> {

    boolean existsByChallengeAndUserAndVerifiedDate(Challenge challenge, User user, LocalDate verifiedDate);

    List<ChallengeVerification> findByChallengeAndUserOrderByVerifiedDateAsc(Challenge challenge, User user);

    List<ChallengeVerification> findByChallengeOrderByVerifiedDateDesc(Challenge challenge);

    long countByChallengeAndUser(Challenge challenge, User user);
}
