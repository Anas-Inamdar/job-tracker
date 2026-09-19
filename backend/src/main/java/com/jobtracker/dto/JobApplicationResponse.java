package com.jobtracker.dto;

import com.jobtracker.entity.JobApplication.ApplicationStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {
    private Long id;
    private String companyName;
    private String jobTitle;
    private String jobUrl;
    private String location;
    private Boolean remote;
    private Integer salaryMin;
    private Integer salaryMax;
    private String currency;
    private ApplicationStatus status;
    private String jobDescription;
    private String notes;
    private LocalDate appliedDate;
    private LocalDate followUpDate;
    private LocalDate interviewDate;
    private LocalDate offerDate;
    private Long resumeId;
    private String resumeName;
    private String source;
    private String contactName;
    private String contactEmail;
    private String referral;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
