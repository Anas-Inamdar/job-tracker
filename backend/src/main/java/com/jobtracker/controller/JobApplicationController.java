package com.jobtracker.controller;

import com.jobtracker.dto.DashboardStatsResponse;
import com.jobtracker.dto.JobApplicationRequest;
import com.jobtracker.dto.JobApplicationResponse;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import com.jobtracker.security.UserPrincipal;
import com.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping
    public ResponseEntity<Page<JobApplicationResponse>> getApplications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(
                jobApplicationService.getApplications(principal.getId(), search, status, pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(jobApplicationService.getApplication(id, principal.getId()));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(
            @Valid @RequestBody JobApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobApplicationService.createApplication(request, principal.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(jobApplicationService.updateApplication(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        jobApplicationService.deleteApplication(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(jobApplicationService.getDashboardStats(principal.getId()));
    }

    @GetMapping("/follow-ups")
    public ResponseEntity<List<JobApplicationResponse>> getDueFollowUps(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(jobApplicationService.getDueFollowUps(principal.getId()));
    }
}
