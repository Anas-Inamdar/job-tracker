package com.jobtracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResumeResponse {
    private Long id;
    private String name;
    private String description;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Boolean isDefault;
    private Integer version;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
