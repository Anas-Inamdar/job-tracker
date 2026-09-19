package com.jobtracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_stages")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_application_id", nullable = false)
    private JobApplication jobApplication;

    @Column(nullable = false, length = 100)
    private String stageName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StageType stageType;

    @Column
    private LocalDateTime scheduledAt;

    @Column
    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StageResult result = StageResult.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 200)
    private String interviewerName;

    @Column(length = 200)
    private String interviewerEmail;

    @Column(length = 100)
    private String format;

    @Column(length = 255)
    private String meetingLink;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum StageType {
        PHONE_SCREEN,
        TECHNICAL,
        BEHAVIORAL,
        SYSTEM_DESIGN,
        TAKE_HOME,
        PANEL,
        HR,
        FINAL,
        OTHER
    }

    public enum StageResult {
        PENDING,
        PASSED,
        FAILED,
        CANCELLED,
        NO_SHOW
    }
}
