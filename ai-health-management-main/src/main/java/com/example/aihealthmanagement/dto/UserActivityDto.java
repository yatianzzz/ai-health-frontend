package com.example.aihealthmanagement.dto;

import lombok.Data;

import java.time.LocalDate;

public class UserActivityDto {
    @Data
    public static class ActivityRequest {
        private Double height;
        private Double weight;
        private Double bmi;
        private LocalDate activityDate;
        private Integer duration;
        private String exerciseType;
        private Integer steps;
        private Integer calories;
        private Integer maxHeartRate;
        private Integer minHeartRate;
    }

    @Data
    public static class ActivityResponse {
        private Long id;
        private Long userId;
        private Double height;
        private Double weight;
        private Double bmi;
        private LocalDate activityDate;
        private Integer duration;
        private String exerciseType;
        private Integer steps;
        private Integer calories;
        private Integer maxHeartRate;
        private Integer minHeartRate;
    }
}
