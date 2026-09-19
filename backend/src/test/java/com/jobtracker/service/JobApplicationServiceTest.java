package com.jobtracker.service;

import com.jobtracker.dto.JobApplicationRequest;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.JobApplication.ApplicationStatus;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.JobApplicationRepository;
import com.jobtracker.repository.ResumeRepository;
import com.jobtracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock JobApplicationRepository jobApplicationRepository;
    @Mock UserRepository userRepository;
    @Mock ResumeRepository resumeRepository;

    @InjectMocks JobApplicationService jobApplicationService;

    private User user;
    private JobApplication app;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("user@test.com").firstName("John").lastName("Doe").build();

        app = new JobApplication();
        app.setId(1L);
        app.setUser(user);
        app.setCompanyName("Acme Corp");
        app.setJobTitle("Software Engineer");
        app.setStatus(ApplicationStatus.APPLIED);
    }

    @Test
    void getApplications_shouldReturnPagedResults() {
        Page<JobApplication> page = new PageImpl<>(List.of(app));
        when(jobApplicationRepository.searchByUserIdAndFilters(anyLong(), any(), any(), any()))
                .thenReturn(page);

        var result = jobApplicationService.getApplications(1L, null, null, PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getCompanyName()).isEqualTo("Acme Corp");
    }

    @Test
    void getApplication_withValidId_shouldReturnApplication() {
        when(jobApplicationRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(app));

        var result = jobApplicationService.getApplication(1L, 1L);

        assertThat(result.getCompanyName()).isEqualTo("Acme Corp");
        assertThat(result.getJobTitle()).isEqualTo("Software Engineer");
    }

    @Test
    void getApplication_withInvalidId_shouldThrowNotFound() {
        when(jobApplicationRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobApplicationService.getApplication(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void createApplication_shouldSaveAndReturnResponse() {
        JobApplicationRequest req = new JobApplicationRequest();
        req.setCompanyName("TechCo");
        req.setJobTitle("Backend Developer");
        req.setStatus(ApplicationStatus.WISHLIST);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(inv -> {
            JobApplication saved = inv.getArgument(0);
            saved.setId(2L);
            return saved;
        });

        var result = jobApplicationService.createApplication(req, 1L);

        assertThat(result.getCompanyName()).isEqualTo("TechCo");
        assertThat(result.getJobTitle()).isEqualTo("Backend Developer");
        verify(jobApplicationRepository).save(any(JobApplication.class));
    }

    @Test
    void deleteApplication_withValidId_shouldDelete() {
        when(jobApplicationRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(app));

        jobApplicationService.deleteApplication(1L, 1L);

        verify(jobApplicationRepository).delete(app);
    }

    @Test
    void deleteApplication_withInvalidId_shouldThrowNotFound() {
        when(jobApplicationRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobApplicationService.deleteApplication(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getDashboardStats_shouldReturnStats() {
        when(jobApplicationRepository.countByUserId(1L)).thenReturn(10L);
        when(jobApplicationRepository.countByUserIdAndStatus(eq(1L), any())).thenReturn(2L);
        when(jobApplicationRepository.countByUserIdGroupByStatus(1L)).thenReturn(List.of());

        var stats = jobApplicationService.getDashboardStats(1L);

        assertThat(stats.getTotalApplications()).isEqualTo(10L);
        assertThat(stats).isNotNull();
    }
}
