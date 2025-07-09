package com.example.aihealthmanagement.service;

import com.example.aihealthmanagement.dto.UserDataDto;

public interface UserDataService {
    UserDataDto.ComprehensiveUserData getComprehensiveUserData(Long userId);
    UserDataDto.UserStats getUserStats(Long userId);
} 