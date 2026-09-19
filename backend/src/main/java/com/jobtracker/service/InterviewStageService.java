package com.jobtracker.service;

import com.jobtracker.dto.InterviewStageRequest;
import com.jobtracker.entity.InterviewStage;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.InterviewStageRepository;
import com.jobtracker.repository.JobApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterviewStageService {

    private final InterviewStageRepository interviewStageRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public List<InterviewStage> getStages(Long applicationId, Long userId) {
        // Verify ownership
        jobApplicationRepository.findByIdAndUserId(applicationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", applicationId));
        return interviewStageRepository.findByJobApplicationIdOrderByScheduledAtAsc(applicationId);
    }

    @Transactional
    public InterviewStage addStage(Long applicationId, Long userId, InterviewStageRequest request) {
        JobApplication app = jobApplicationRepository.findByIdAndUserId(applicationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", applicationId));

        InterviewStage stage = InterviewStage.builder()
                .jobApplication(app)
                .stageName(request.getStageName())
                .stageType(request.getStageType())
                .scheduledAt(request.getScheduledAt())
                .completedAt(request.getCompletedAt())
                .result(request.getResult() != null ? request.getResult() : InterviewStage.StageResult.PENDING)
                .notes(request.getNotes())
                .interviewerName(request.getInterviewerName())
                .interviewerEmail(request.getInterviewerEmail())
                .format(request.getFormat())
                .meetingLink(request.getMeetingLink())
                .build();

        return interviewStageRepository.save(stage);
    }

    @Transactional
    public InterviewStage updateStage(Long applicationId, Long stageId, Long userId, InterviewStageRequest request) {
        jobApplicationRepository.findByIdAndUserId(applicationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", applicationId));

        InterviewStage stage = interviewStageRepository.findByIdAndJobApplicationId(stageId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview stage", stageId));

        stage.setStageName(request.getStageName());
        stage.setStageType(request.getStageType());
        stage.setScheduledAt(request.getScheduledAt());
        stage.setCompletedAt(request.getCompletedAt());
        if (request.getResult() != null) stage.setResult(request.getResult());
        stage.setNotes(request.getNotes());
        stage.setInterviewerName(request.getInterviewerName());
        stage.setInterviewerEmail(request.getInterviewerEmail());
        stage.setFormat(request.getFormat());
        stage.setMeetingLink(request.getMeetingLink());

        return interviewStageRepository.save(stage);
    }

    @Transactional
    public void deleteStage(Long applicationId, Long stageId, Long userId) {
        jobApplicationRepository.findByIdAndUserId(applicationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", applicationId));

        InterviewStage stage = interviewStageRepository.findByIdAndJobApplicationId(stageId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview stage", stageId));

        interviewStageRepository.delete(stage);
    }
}
