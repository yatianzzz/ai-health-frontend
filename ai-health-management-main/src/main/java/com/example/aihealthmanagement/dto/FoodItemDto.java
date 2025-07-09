package com.example.aihealthmanagement.dto;

import lombok.Data;

public class FoodItemDto {
    @Data
    public static class ItemRequest {
        private Long dietaryRecordId;
        private String name;
        private String category;
        private Double quantity;
        private String unit;
        private Integer calories;
    }

    @Data
    public static class ItemResponse {
        private Long id;
        private Long dietaryRecordId;
        private String name;
        private String category;
        private Double quantity;
        private String unit;
        private Integer calories;
    }
}
