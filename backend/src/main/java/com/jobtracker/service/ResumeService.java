package com.jobtracker.service;

import com.jobtracker.dto.ResumeResponse;
import com.jobtracker.entity.Resume;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.ResumeRepository;
import com.jobtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public List<ResumeResponse> getResumes(Long userId) {
        return resumeRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    public ResumeResponse getResume(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", id));
        return toResponse(resume);
    }

    @Transactional
    public ResumeResponse createResume(String name, String description, String fileName,
                                        String fileType, Long fileSize, String filePath,
                                        Boolean isDefault, String tags, Integer version, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (Boolean.TRUE.equals(isDefault)) {
            resumeRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(r -> { r.setIsDefault(false); resumeRepository.save(r); });
        }

        Resume resume = Resume.builder()
                .user(user)
                .name(name)
                .description(description)
                .fileName(fileName)
                .fileType(fileType)
                .fileSize(fileSize)
                .filePath(filePath)
                .isDefault(isDefault != null && isDefault)
                .tags(tags)
                .version(version)
                .build();

        return toResponse(resumeRepository.save(resume));
    }

    @Transactional
    public void deleteResume(Long id, Long userId) {
        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", id));
        resumeRepository.delete(resume);
    }

    @Transactional
    public ResumeResponse setDefault(Long id, Long userId) {
        resumeRepository.findByUserIdAndIsDefaultTrue(userId)
                .ifPresent(r -> { r.setIsDefault(false); resumeRepository.save(r); });

        Resume resume = resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume", id));
        resume.setIsDefault(true);
        return toResponse(resumeRepository.save(resume));
    }

    private ResumeResponse toResponse(Resume r) {
        ResumeResponse res = new ResumeResponse();
        res.setId(r.getId());
        res.setName(r.getName());
        res.setDescription(r.getDescription());
        res.setFileName(r.getFileName());
        res.setFileType(r.getFileType());
        res.setFileSize(r.getFileSize());
        res.setIsDefault(r.getIsDefault());
        res.setVersion(r.getVersion());
        res.setTags(r.getTags());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }
}
