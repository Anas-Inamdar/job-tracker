package com.jobtracker.controller;

import com.jobtracker.dto.ResumeResponse;
import com.jobtracker.security.UserPrincipal;
import com.jobtracker.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getResumes(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(resumeService.getResumes(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(resumeService.getResume(id, principal.getId()));
    }

    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) String fileType,
            @RequestParam(required = false) Long fileSize,
            @RequestParam(required = false) String filePath,
            @RequestParam(defaultValue = "false") Boolean isDefault,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) Integer version,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resumeService.createResume(name, description, fileName, fileType,
                        fileSize, filePath, isDefault, tags, version, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        resumeService.deleteResume(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/default")
    public ResponseEntity<ResumeResponse> setDefault(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(resumeService.setDefault(id, principal.getId()));
    }
}
