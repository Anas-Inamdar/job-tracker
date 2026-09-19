package com.jobtracker.repository;

import com.jobtracker.entity.InterviewStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewStageRepository extends JpaRepository<InterviewStage, Long> {
    List<InterviewStage> findByJobApplicationIdOrderByScheduledAtAsc(Long jobApplicationId);
    Optional<InterviewStage> findByIdAndJobApplicationId(Long id, Long jobApplicationId);
}
