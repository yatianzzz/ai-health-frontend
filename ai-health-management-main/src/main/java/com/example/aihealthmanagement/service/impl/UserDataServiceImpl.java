package com.example.aihealthmanagement.service.impl;

import com.example.aihealthmanagement.dto.UserDataDto;
import com.example.aihealthmanagement.entity.DietaryRecord;
import com.example.aihealthmanagement.entity.UserActivity;
import com.example.aihealthmanagement.entity.UserProfile;
import com.example.aihealthmanagement.repository.DietaryRecordRepository;
import com.example.aihealthmanagement.repository.UserActivityRepository;
import com.example.aihealthmanagement.repository.UserProfileRepository;
import com.example.aihealthmanagement.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.OptionalDouble;

@Service
public class UserDataServiceImpl implements UserDataService {

    @Autowired
    private UserProfileRepository userProfileRepository;
    
    @Autowired
    private UserActivityRepository userActivityRepository;
    
    @Autowired
    private DietaryRecordRepository dietaryRecordRepository;

    @Override
    public UserDataDto.ComprehensiveUserData getComprehensiveUserData(Long userId) {
        UserDataDto.ComprehensiveUserData data = new UserDataDto.ComprehensiveUserData();
        
        // Get user profile
        UserProfile profile = userProfileRepository.findByUserId(userId);
        data.setProfile(profile);
        
        // Get recent activities (last 30 days)
        List<UserActivity> activities = userActivityRepository.findByUserId(userId);
        data.setActivities(activities);
        
        // Get dietary records
        List<DietaryRecord> dietaryRecords = dietaryRecordRepository.findByUserId(userId);
        data.setDietaryRecords(dietaryRecords);
        
        // Calculate stats
        UserDataDto.UserStats stats = calculateUserStats(activities, dietaryRecords);
        data.setStats(stats);
        
        return data;
    }

    @Override
    public UserDataDto.UserStats getUserStats(Long userId) {
        List<UserActivity> activities = userActivityRepository.findByUserId(userId);
        List<DietaryRecord> dietaryRecords = dietaryRecordRepository.findByUserId(userId);
        
        return calculateUserStats(activities, dietaryRecords);
    }

    private UserDataDto.UserStats calculateUserStats(List<UserActivity> activities, List<DietaryRecord> dietaryRecords) {
        UserDataDto.UserStats stats = new UserDataDto.UserStats();
        
        // Calculate activity stats
        int totalSteps = activities.stream()
                .mapToInt(activity -> activity.getSteps() != null ? activity.getSteps() : 0)
                .sum();
        
        int totalCalories = activities.stream()
                .mapToInt(activity -> activity.getCalories() != null ? activity.getCalories() : 0)
                .sum();
        
        int totalDuration = activities.stream()
                .mapToInt(activity -> activity.getDuration() != null ? activity.getDuration() : 0)
                .sum();
        
        // Calculate average heart rate
        OptionalDouble avgHeartRate = activities.stream()
                .filter(activity -> activity.getMaxHeartRate() != null && activity.getMinHeartRate() != null)
                .mapToDouble(activity -> (activity.getMaxHeartRate() + activity.getMinHeartRate()) / 2.0)
                .average();
        
        // Calculate dietary stats
        int totalDietaryRecords = dietaryRecords.size();
        double avgDailyCalories = dietaryRecords.stream()
                .mapToInt(record -> record.getTotalCalories() != null ? record.getTotalCalories() : 0)
                .average()
                .orElse(0.0);
        
        // Get recent activities count (last 7 days)
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        int recentActivitiesCount = (int) activities.stream()
                .filter(activity -> activity.getActivityDate() != null && 
                        activity.getActivityDate().isAfter(sevenDaysAgo))
                .count();
        
        stats.setTotalSteps(totalSteps);
        stats.setTotalCalories(totalCalories);
        stats.setTotalDuration(totalDuration);
        stats.setAvgHeartRate(avgHeartRate.orElse(0.0));
        stats.setTotalDietaryRecords(totalDietaryRecords);
        stats.setAvgDailyCalories(avgDailyCalories);
        stats.setRecentActivitiesCount(recentActivitiesCount);
        
        return stats;
    }
} 