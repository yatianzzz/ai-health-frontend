package com.example.aihealthmanagement.controller;

import com.example.aihealthmanagement.common.ServiceException;
import com.example.aihealthmanagement.common.ServiceResponse;
import com.example.aihealthmanagement.dto.UserDataDto;
import com.example.aihealthmanagement.security.CustomUserDetails;
import com.example.aihealthmanagement.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-data")
public class UserDataController {

    @Autowired
    private UserDataService userDataService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails)) {
            throw new ServiceException(401, "User not authenticated");
        }
        return ((CustomUserDetails) auth.getPrincipal()).getId();
    }

    @GetMapping("/comprehensive")
    public ServiceResponse<UserDataDto.ComprehensiveUserData> getComprehensiveUserData() {
        Long userId = getCurrentUserId();
        UserDataDto.ComprehensiveUserData data = userDataService.getComprehensiveUserData(userId);
        return ServiceResponse.success(data);
    }

    @GetMapping("/stats")
    public ServiceResponse<UserDataDto.UserStats> getUserStats() {
        Long userId = getCurrentUserId();
        UserDataDto.UserStats stats = userDataService.getUserStats(userId);
        return ServiceResponse.success(stats);
    }
} 