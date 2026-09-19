package com.jobtracker.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data @Builder
public class DashboardStatsResponse {
    private long totalApplications;
    private long activeApplications;
    private long interviewsScheduled;
    private long offersReceived;
    private long rejections;
    private Map<String, Long> statusBreakdown;
    private double responseRate;
    private double interviewRate;
    private double offerRate;
}
