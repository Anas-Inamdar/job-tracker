package com.jobtracker.dto;

import com.jobtracker.entity.JobApplication.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 200)
    private String companyName;

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String jobTitle;

    @Size(max = 500)
    private String jobUrl;

    @Size(max = 100)
    private String location;

    private Boolean remote;
    private Integer salaryMin;
    private Integer salaryMax;

    @Size(max = 10)
    private String currency;

    private ApplicationStatus status;
    private String jobDescription;
    private String notes;
    private LocalDate appliedDate;
    private LocalDate followUpDate;
    private LocalDate interviewDate;
    private LocalDate offerDate;
    private Long resumeId;

    @Size(max = 100)
    private String source;

    @Size(max = 100)
    private String contactName;

    @Size(max = 200)
    private String contactEmail;

    @Size(max = 100)
    private String referral;
}
