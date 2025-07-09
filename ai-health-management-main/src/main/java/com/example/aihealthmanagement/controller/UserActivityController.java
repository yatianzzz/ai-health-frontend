package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.UserActivityDto;
import com.example.aihealthmanagement.entity.UserActivity;
import com.example.aihealthmanagement.security.CustomUserDetails;
import com.example.aihealthmanagement.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-activities")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ServiceResponse<List<UserActivity>> list() {
        Long userId = getCurrentUserId();
        List<UserActivity> activities = userActivityService.listByUserId(userId);
        return ServiceResponse.success(activities);
    }

    @GetMapping("/{id}")
    public ServiceResponse<UserActivity> get(@PathVariable Long id) {
        UserActivity activity = userActivityService.getById(id);
        if (activity == null) {
            throw new ServiceException(404, "Activity not found");
        }
        return ServiceResponse.success(activity);
    }

    @PostMapping
    public ServiceResponse<?> create(@RequestBody UserActivityDto.ActivityRequest request) {
        Long userId = getCurrentUserId();
        UserActivity activity = UserActivity.builder()
                .userId(userId)
                .height(request.getHeight())
                .weight(request.getWeight())
                .bmi(request.getBmi())
                .activityDate(request.getActivityDate())
                .duration(request.getDuration())
                .exerciseType(request.getExerciseType())
                .steps(request.getSteps())
                .calories(request.getCalories())
                .maxHeartRate(request.getMaxHeartRate())
                .minHeartRate(request.getMinHeartRate())
                .build();
        userActivityService.create(activity);
        return ServiceResponse.success("Created", null);
    }

    @PutMapping("/{id}")
    public ServiceResponse<?> update(@PathVariable Long id, @RequestBody UserActivityDto.ActivityRequest request) {
        Long userId = getCurrentUserId();
        UserActivity activity = UserActivity.builder()
                .id(id)
                .userId(userId)
                .height(request.getHeight())
                .weight(request.getWeight())
                .bmi(request.getBmi())
                .activityDate(request.getActivityDate())
                .duration(request.getDuration())
                .exerciseType(request.getExerciseType())
                .steps(request.getSteps())
                .calories(request.getCalories())
                .maxHeartRate(request.getMaxHeartRate())
                .minHeartRate(request.getMinHeartRate())
                .build();
        userActivityService.update(activity);
        return ServiceResponse.success("Updated", null);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<?> delete(@PathVariable Long id) {
        userActivityService.delete(id);
        return ServiceResponse.success("Deleted", null);
    }
}
