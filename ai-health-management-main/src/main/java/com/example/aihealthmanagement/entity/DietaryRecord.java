package com.example.aihealthmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DietaryRecord {
    private Long id;
    private Long userId;
    private LocalDate recordDate;
    private LocalTime recordTime;
    private String mealType;
    private String notes;
    private Integer totalCalories;
    private LocalDateTime createTime;
}
