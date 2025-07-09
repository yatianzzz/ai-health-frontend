package com.example.aihealthmanagement.dto;

import com.example.aihealthmanagement.entity.DietaryRecord;
import com.example.aihealthmanagement.entity.UserActivity;
import com.example.aihealthmanagement.entity.UserProfile;
import lombok.Data;

import java.util.List;

public class UserDataDto {

    @Data
    public static class ComprehensiveUserData {
        private UserProfile profile;
        private List<UserActivity> activities;
        private List<DietaryRecord> dietaryRecords;
        private UserStats stats;
    }

    @Data
    public static class UserStats {
        private Integer totalSteps;
        private Integer totalCalories;
        private Integer totalDuration;
        private Double avgHeartRate;
        private Integer totalDietaryRecords;
        private Double avgDailyCalories;
        private Integer recentActivitiesCount;
    }

    @Data
    public static class ProfileSummary {
        private String firstName;
        private String lastName;
        private Integer age;
        private String gender;
        private String occupation;
        private String favoriteSport;
        private Double height;
        private Double weight;
        private Double bmi;
    }
} 