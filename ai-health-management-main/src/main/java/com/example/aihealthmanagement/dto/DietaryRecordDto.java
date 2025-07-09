package com.example.aihealthmanagement.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

public class DietaryRecordDto {
    @Data
    public static class RecordRequest {
        private LocalDate recordDate;
        private LocalTime recordTime;
        private String mealType;
        private String notes;
        private Integer totalCalories;
    }

    @Data
    public static class RecordResponse {
        private Long id;
        private Long userId;
        private LocalDate recordDate;
        private LocalTime recordTime;
        private String mealType;
        private String notes;
        private Integer totalCalories;
    }
}
