package com.example.aihealthmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    private Long id;
    private Long dietaryRecordId;
    private String name;
    private String category;
    private Double quantity;
    private String unit;
    private Integer calories;
    private LocalDateTime createTime;
}
