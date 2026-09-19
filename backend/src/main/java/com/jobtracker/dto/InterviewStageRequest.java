package com.jobtracker.dto;

import com.jobtracker.entity.InterviewStage.StageResult;
import com.jobtracker.entity.InterviewStage.StageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InterviewStageRequest {

    @NotBlank
    private String stageName;

    @NotNull
    private StageType stageType;

    private LocalDateTime scheduledAt;
    private LocalDateTime completedAt;
    private StageResult result;
    private String notes;
    private String interviewerName;
    private String interviewerEmail;
    private String format;
    private String meetingLink;
}
