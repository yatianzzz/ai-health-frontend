package com.example.aihealthmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {
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
