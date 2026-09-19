package com.jobtracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_applications")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String companyName;

    @Column(nullable = false, length = 200)
    private String jobTitle;

    @Column(length = 500)
    private String jobUrl;

    @Column(length = 100)
    private String location;

    @Column
    private Boolean remote;

    @Column
    private Integer salaryMin;

    @Column
    private Integer salaryMax;

    @Column(length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.WISHLIST;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column
    private LocalDate appliedDate;

    @Column
    private LocalDate followUpDate;

    @Column
    private LocalDate interviewDate;

    @Column
    private LocalDate offerDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @Column(length = 100)
    private String source;

    @Column(length = 100)
    private String contactName;

    @Column(length = 200)
    private String contactEmail;

    @Column(length = 100)
    private String referral;

    @OneToMany(mappedBy = "jobApplication", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InterviewStage> interviewStages = new ArrayList<>();

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        WISHLIST,
        APPLIED,
        PHONE_SCREEN,
        TECHNICAL_INTERVIEW,
        ONSITE_INTERVIEW,
        OFFER_RECEIVED,
        OFFER_ACCEPTED,
        OFFER_DECLINED,
        REJECTED,
        WITHDRAWN
    }
}
