package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.repository.DietaryRecordRepository;
import com.example.aihealthmanagement.repository.FoodItemRepository;
import com.example.aihealthmanagement.repository.UserActivityRepository;
import com.example.aihealthmanagement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;

@RestController
@RequestMapping("/api/dietary-stats")
@CrossOrigin(origins = "http://localhost:3000")
public class DietaryStatsController {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private DietaryRecordRepository dietaryRecordRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    @GetMapping("/food-categories")
    public ServiceResponse<?> getFoodCategoriesData() {
        Long userId = getCurrentUserId();
        
        // Calculate current week date range based on latest date
        String[] dateRange = getCurrentWeekDateRange();
        String startDate = dateRange[0];
        String endDate = dateRange[1];
        
        List<Map<String, Object>> categoryData = foodItemRepository.getCategoryDataByUserAndDateRange(
                userId, startDate, endDate);
        
        // Transform data for frontend pie chart
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> item : categoryData) {
            Map<String, Object> chartData = new HashMap<>();
            chartData.put("type", item.get("category"));
            chartData.put("value", item.get("totalCalories"));
            result.add(chartData);
        }
        
        return ServiceResponse.success("Food categories data retrieved successfully", result);
    }

    @GetMapping("/calorie-comparison")
    public ServiceResponse<?> getCalorieComparisonData() {
        Long userId = getCurrentUserId();
        
        // Calculate current week date range based on latest date
        String[] dateRange = getCurrentWeekDateRange();
        String startDate = dateRange[0];
        String endDate = dateRange[1];
        
        // Get intake data
        List<Map<String, Object>> intakeData = dietaryRecordRepository.getCaloriesIntakeByUserAndDateRange(
                userId, startDate, endDate);
        
        // Get burned data
        List<Map<String, Object>> burnedData = userActivityRepository.getCaloriesBurnedByUserAndDateRange(
                userId, startDate, endDate);
        
        // Combine data for line chart
        List<Map<String, Object>> result = new ArrayList<>();
        
        // Add intake data
        for (Map<String, Object> item : intakeData) {
            Map<String, Object> chartData = new HashMap<>();
            chartData.put("date", item.get("record_date").toString());
            chartData.put("value", item.get("totalCalories"));
            chartData.put("category", "Consumed");
            result.add(chartData);
        }
        
        // Add burned data
        for (Map<String, Object> item : burnedData) {
            Map<String, Object> chartData = new HashMap<>();
            chartData.put("date", item.get("activity_date").toString());
            chartData.put("value", item.get("totalCalories"));
            chartData.put("category", "Burned");
            result.add(chartData);
        }
        
        return ServiceResponse.success("Calorie comparison data retrieved successfully", result);
    }

    @GetMapping("/daily-summary")
    public ServiceResponse<?> getDailySummaryData() {
        Long userId = getCurrentUserId();
        String today = LocalDate.now().toString();
        
        // Get today's intake
        List<Map<String, Object>> todayIntake = dietaryRecordRepository.getCaloriesIntakeByUserAndDateRange(
                userId, today, today);
        
        // Get today's burned calories
        List<Map<String, Object>> todayBurned = userActivityRepository.getCaloriesBurnedByUserAndDateRange(
                userId, today, today);
        
        int caloriesConsumed = 0;
        int caloriesBurned = 0;
        
        if (!todayIntake.isEmpty()) {
            Object calories = todayIntake.get(0).get("totalCalories");
            caloriesConsumed = calories != null ? ((Number) calories).intValue() : 0;
        }
        
        if (!todayBurned.isEmpty()) {
            Object calories = todayBurned.get(0).get("totalCalories");
            caloriesBurned = calories != null ? ((Number) calories).intValue() : 0;
        }
        
        int netCalories = caloriesConsumed - caloriesBurned;
        
        Map<String, Object> result = new HashMap<>();
        result.put("caloriesConsumed", caloriesConsumed);
        result.put("caloriesBurned", caloriesBurned);
        result.put("netCalories", netCalories);
        result.put("trend", netCalories > 0 ? "up" : "down");
        
        return ServiceResponse.success("Daily summary data retrieved successfully", result);
    }

    private String[] getCurrentWeekDateRange() {
        LocalDate today = LocalDate.now();
        
        // Get the start of the current week (Monday)
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        LocalDate startOfWeek = today.with(weekFields.dayOfWeek(), 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return new String[]{startOfWeek.format(formatter), endOfWeek.format(formatter)};
    }
}
