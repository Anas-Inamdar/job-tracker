package com.jobtracker.controller;

import com.jobtracker.dto.InterviewStageRequest;
import com.jobtracker.entity.InterviewStage;
import com.jobtracker.security.UserPrincipal;
import com.jobtracker.service.InterviewStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/{applicationId}/stages")
@RequiredArgsConstructor
public class InterviewStageController {

    private final InterviewStageService interviewStageService;

    @GetMapping
    public ResponseEntity<List<InterviewStage>> getStages(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(interviewStageService.getStages(applicationId, principal.getId()));
    }

    @PostMapping
    public ResponseEntity<InterviewStage> addStage(
            @PathVariable Long applicationId,
            @Valid @RequestBody InterviewStageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(interviewStageService.addStage(applicationId, principal.getId(), request));
    }

    @PutMapping("/{stageId}")
    public ResponseEntity<InterviewStage> updateStage(
            @PathVariable Long applicationId,
            @PathVariable Long stageId,
            @Valid @RequestBody InterviewStageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                interviewStageService.updateStage(applicationId, stageId, principal.getId(), request)
        );
    }

    @DeleteMapping("/{stageId}")
    public ResponseEntity<Void> deleteStage(
            @PathVariable Long applicationId,
            @PathVariable Long stageId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        interviewStageService.deleteStage(applicationId, stageId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
