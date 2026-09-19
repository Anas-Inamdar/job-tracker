package com.jobtracker.service;

import com.jobtracker.dto.DashboardStatsResponse;
import com.jobtracker.dto.JobApplicationRequest;
import com.jobtracker.dto.JobApplicationResponse;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import com.jobtracker.entity.Resume;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.JobApplicationRepository;
import com.jobtracker.repository.ResumeRepository;
import com.jobtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    public Page<JobApplicationResponse> getApplications(Long userId, String search,
                                                         ApplicationStatus status, Pageable pageable) {
        Page<JobApplication> apps = jobApplicationRepository
                .searchByUserIdAndFilters(userId, search, status, pageable);
        return apps.map(this::toResponse);
    }

    public JobApplicationResponse getApplication(Long id, Long userId) {
        JobApplication app = jobApplicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", id));
        return toResponse(app);
    }

    @Transactional
    public JobApplicationResponse createApplication(JobApplicationRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        JobApplication app = new JobApplication();
        mapRequestToEntity(request, app, userId);
        app.setUser(user);

        if (app.getStatus() == null) {
            app.setStatus(ApplicationStatus.WISHLIST);
        }

        return toResponse(jobApplicationRepository.save(app));
    }

    @Transactional
    public JobApplicationResponse updateApplication(Long id, JobApplicationRequest request, Long userId) {
        JobApplication app = jobApplicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", id));

        mapRequestToEntity(request, app, userId);
        return toResponse(jobApplicationRepository.save(app));
    }

    @Transactional
    public void deleteApplication(Long id, Long userId) {
        JobApplication app = jobApplicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Job application", id));
        jobApplicationRepository.delete(app);
    }

    public DashboardStatsResponse getDashboardStats(Long userId) {
        long total = jobApplicationRepository.countByUserId(userId);
        long offers = jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER_RECEIVED);
        long rejected = jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED);
        long interviews = jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.TECHNICAL_INTERVIEW)
                + jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.ONSITE_INTERVIEW)
                + jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.PHONE_SCREEN);

        long applied = jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED);

        Map<String, Long> statusBreakdown = new HashMap<>();
        List<Object[]> results = jobApplicationRepository.countByUserIdGroupByStatus(userId);
        for (Object[] row : results) {
            statusBreakdown.put(((ApplicationStatus) row[0]).name(), (Long) row[1]);
        }

        double responseRate = total > 0 ? (double)(total - jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.WISHLIST)) / total * 100 : 0;
        double interviewRate = applied > 0 ? (double) interviews / applied * 100 : 0;
        double offerRate = interviews > 0 ? (double) offers / interviews * 100 : 0;

        return DashboardStatsResponse.builder()
                .totalApplications(total)
                .activeApplications(total - rejected - jobApplicationRepository.countByUserIdAndStatus(userId, ApplicationStatus.WITHDRAWN))
                .interviewsScheduled(interviews)
                .offersReceived(offers)
                .rejections(rejected)
                .statusBreakdown(statusBreakdown)
                .responseRate(Math.round(responseRate * 10.0) / 10.0)
                .interviewRate(Math.round(interviewRate * 10.0) / 10.0)
                .offerRate(Math.round(offerRate * 10.0) / 10.0)
                .build();
    }

    public List<JobApplicationResponse> getDueFollowUps(Long userId) {
        return jobApplicationRepository.findDueFollowUps(userId)
                .stream().map(this::toResponse).toList();
    }

    private void mapRequestToEntity(JobApplicationRequest req, JobApplication app, Long userId) {
        app.setCompanyName(req.getCompanyName());
        app.setJobTitle(req.getJobTitle());
        app.setJobUrl(req.getJobUrl());
        app.setLocation(req.getLocation());
        app.setRemote(req.getRemote());
        app.setSalaryMin(req.getSalaryMin());
        app.setSalaryMax(req.getSalaryMax());
        app.setCurrency(req.getCurrency());
        if (req.getStatus() != null) app.setStatus(req.getStatus());
        app.setJobDescription(req.getJobDescription());
        app.setNotes(req.getNotes());
        app.setAppliedDate(req.getAppliedDate());
        app.setFollowUpDate(req.getFollowUpDate());
        app.setInterviewDate(req.getInterviewDate());
        app.setOfferDate(req.getOfferDate());
        app.setSource(req.getSource());
        app.setContactName(req.getContactName());
        app.setContactEmail(req.getContactEmail());
        app.setReferral(req.getReferral());

        if (req.getResumeId() != null) {
            Resume resume = resumeRepository.findByIdAndUserId(req.getResumeId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Resume", req.getResumeId()));
            app.setResume(resume);
        } else {
            app.setResume(null);
        }
    }

    private JobApplicationResponse toResponse(JobApplication app) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(app.getId());
        response.setCompanyName(app.getCompanyName());
        response.setJobTitle(app.getJobTitle());
        response.setJobUrl(app.getJobUrl());
        response.setLocation(app.getLocation());
        response.setRemote(app.getRemote());
        response.setSalaryMin(app.getSalaryMin());
        response.setSalaryMax(app.getSalaryMax());
        response.setCurrency(app.getCurrency());
        response.setStatus(app.getStatus());
        response.setJobDescription(app.getJobDescription());
        response.setNotes(app.getNotes());
        response.setAppliedDate(app.getAppliedDate());
        response.setFollowUpDate(app.getFollowUpDate());
        response.setInterviewDate(app.getInterviewDate());
        response.setOfferDate(app.getOfferDate());
        response.setSource(app.getSource());
        response.setContactName(app.getContactName());
        response.setContactEmail(app.getContactEmail());
        response.setReferral(app.getReferral());
        response.setCreatedAt(app.getCreatedAt());
        response.setUpdatedAt(app.getUpdatedAt());
        if (app.getResume() != null) {
            response.setResumeId(app.getResume().getId());
            response.setResumeName(app.getResume().getName());
        }
        return response;
    }
}
